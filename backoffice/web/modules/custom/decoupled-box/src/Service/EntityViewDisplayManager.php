<?php

namespace Drupal\decoupled_toolbox\Service;

use Drupal\Core\Config\ConfigInstallerInterface;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Entity\EntityTypeEvent;
use Drupal\Core\Entity\EntityTypeEvents;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\decoupled_toolbox\Exception\DecoupledSetupFailureException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class EntityViewDisplayManager.
 */
class EntityViewDisplayManager implements EntityViewDisplayManagerInterface, EventSubscriberInterface {

  use StringTranslationTrait;

  /**
   * Config installer service.
   *
   * @var \Drupal\Core\Config\ConfigInstallerInterface
   */
  protected $configInstaller;

  /**
   * Entity type bundle info service.
   *
   * @var \Drupal\Core\Entity\EntityTypeBundleInfoInterface
   */
  protected $entityTypeBundleInfo;

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  private $entityTypeManager;

  /**
   * Entity view display storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  private $entityViewDisplayStorage;

  /**
   * Entity view mode storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  private $entityViewModeStorage;

  /**
   * Constructs a new EntityViewDisplayManager object.
   *
   * @param \Drupal\Core\Config\ConfigInstallerInterface $configInstaller
   *   Config installer service.
   * @param \Drupal\Core\Entity\EntityTypeBundleInfoInterface $entityTypeBundleInfo
   *   Entity type bundle info service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   Entity type manager service.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $translation
   *   String translation service.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function __construct(
    ConfigInstallerInterface $configInstaller,
    EntityTypeBundleInfoInterface $entityTypeBundleInfo,
    EntityTypeManagerInterface $entityTypeManager,
    TranslationInterface $translation
  ) {
    $this->configInstaller = $configInstaller;
    $this->entityTypeBundleInfo = $entityTypeBundleInfo;
    $this->entityTypeManager = $entityTypeManager;
    $this->stringTranslation = $translation;
    $this->entityViewDisplayStorage = $entityTypeManager->getStorage('entity_view_display');
    $this->entityViewModeStorage = $entityTypeManager->getStorage('entity_view_mode');
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[EntityTypeEvents::CREATE][] = ['onEntityTypeCreate'];
    return $events;
  }

  /**
   * Gets entity types suitable for decoupled display mode.
   *
   * @return \Drupal\Core\Entity\ContentEntityTypeInterface[]
   *   Array of entity types.
   */
  private function getValidEntityTypesForDecoupledDisplayMode() {
    $entityTypes = [];
    foreach ($this->entityTypeManager->getDefinitions() as $entityTypeId => $entityType) {
      if ($entityType->get('field_ui_base_route') && $entityType->hasViewBuilderClass()) {
        // This should filter on only ContentEntityTypeInterface instances.
        $entityTypes[$entityTypeId] = $entityType;
      }
    }
    return $entityTypes;
  }

  /**
   * Reacts on bundle creation.
   *
   * @param string $entityTypeId
   *   The entity type ID.
   * @param string $bundleId
   *   The created bundle ID.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function onBundleCreate($entityTypeId, $bundleId) {
    if ($this->configInstaller->isSyncing()) {
      // Do not attempt to prepare display when syncing configuraton.
      return;
    }

    $this->prepareDisplayForEntityTypeAndBundle($entityTypeId, $bundleId);
  }

  /**
   * Reacts on entity type events.
   *
   * @param \Drupal\Core\Entity\EntityTypeEvent $event
   *   Triggered event.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\DecoupledSetupFailureException
   */
  public function onEntityTypeCreate(EntityTypeEvent $event) {
    if ($this->configInstaller->isSyncing()) {
      // Do not attempt to prepare display when syncing configuraton.
      return;
    }

    $this->prepareDecoupledDisplayForAllEntityTypes();
  }

  /**
   * {@inheritdoc}
   */
  public function prepareDecoupledDisplayForAllEntityTypes() {
    $validEntityTypes = $this->getValidEntityTypesForDecoupledDisplayMode();
    foreach ($validEntityTypes as $entityTypeId => $entityType) {
      try {
        $this->prepareDecoupledDisplayForEntityType($entityTypeId);
      }
      catch (EntityStorageException $exception) {
        throw new DecoupledSetupFailureException(
          $this->t('EntityStorageException raised while preparing decoupled display for the entity type @entityTypeLabel (@entityTypeId)', [
            '@entityTypeLabel' => $entityType->getLabel(),
            '@entityTypeId' => $entityTypeId,
          ]));
      }
    }
  }

  /**
   * Prepares the decoupled display for the specified entity type.
   *
   * @param string $entityTypeId
   *   The entity type ID.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  private function prepareDecoupledDisplayForEntityType($entityTypeId) {
    // Prepare the view mode for the entity type here, to make it available
    // even when no bundle has been created yet on the target entity type.
    $this->prepareViewModeForEntityType($entityTypeId);

    // Work on all bundles. This also works for entity types without bundles.
    $bundles = $this->entityTypeBundleInfo->getBundleInfo($entityTypeId);

    foreach ($bundles as $bundleId => $bundleData) {
      $this->prepareDisplayForEntityTypeAndBundle($entityTypeId, $bundleId);
    }
  }

  /**
   * Prepares a new view display or returns it if already exists.
   *
   * Will create the entity view mode if it does not exist yet.
   *
   * @param string $entityTypeId
   *   Entity type id.
   * @param string $bundle
   *   Bundle of the entity.
   *
   * @return \Drupal\Core\Entity\Display\EntityViewDisplayInterface
   *   The created entity view display.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  private function prepareDisplayForEntityTypeAndBundle($entityTypeId, $bundle) {
    // Make sure the view mode is available on the entity type.
    $this->prepareViewModeForEntityType($entityTypeId);

    // Try loading the display from configuration.
    $configId = $entityTypeId . '.' . $bundle . '.' . self::ENTITY_DECOUPLED_VIEW_MODE_ID;

    /* @var \Drupal\Core\Entity\Display\EntityViewDisplayInterface $display */
    $display = $this->entityViewDisplayStorage->load($configId);

    if (!empty($display)) {
      // Already created.
      return $display;
    }

    /* @var \Drupal\Core\Entity\Display\EntityViewDisplayInterface $display */
    $display = $this->entityViewDisplayStorage->create([
      'targetEntityType' => $entityTypeId,
      'bundle' => $bundle,
      'mode' => self::ENTITY_DECOUPLED_VIEW_MODE_ID,
      'status' => TRUE,
    ]);

    $display->save();

    return $display;
  }

  /**
   * Prepares a new view mode or returns it if already exists.
   *
   * @param string $entityTypeId
   *   Entity type id.
   *
   * @return \Drupal\Core\Entity\EntityViewModeInterface
   *   Entity view mode instance.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  private function prepareViewModeForEntityType($entityTypeId) {
    $viewModeFullId = $entityTypeId . '.' . self::ENTITY_DECOUPLED_VIEW_MODE_ID;

    /* @var \Drupal\Core\Entity\EntityViewModeInterface $viewMode */
    $viewMode = $this->entityViewModeStorage->load($viewModeFullId);

    if (!empty($viewMode)) {
      // Already created.
      return $viewMode;
    }

    $viewMode = $this->entityViewModeStorage->create([
      'id' => $entityTypeId . '.' . self::ENTITY_DECOUPLED_VIEW_MODE_ID,
      'label' => self::ENTITY_DECOUPLED_VIEW_MODE_NAME,
      'targetEntityType' => $entityTypeId,
    ]);

    $viewMode->save();

    return $viewMode;
  }

}
