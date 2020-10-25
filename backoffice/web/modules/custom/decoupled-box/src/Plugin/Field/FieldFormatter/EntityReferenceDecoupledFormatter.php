<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\EntityReferenceItem;
use Drupal\Core\TypedData\Exception\MissingDataException;
use Drupal\decoupled_toolbox\Exception\InvalidContentException;
use Drupal\decoupled_toolbox\Exception\UnexpectedFormatterException;
use Drupal\decoupled_toolbox\Service\DecoupledRendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation of the 'decoupled_entity_reference' formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_entity_reference",
 *   label = @Translation("Entity reference decoupled formatter"),
 *   field_types = {
 *     "entity_reference",
 *     "entity_reference_revisions",
 *   }
 * )
 */
class EntityReferenceDecoupledFormatter extends DecoupledFormatterBase {

  /**
   * The language code used.
   *
   * @var string
   */
  protected $langCode;

  /**
   * Decoupled renderer service.
   *
   * @var \Drupal\decoupled_toolbox\Service\DecoupledRendererInterface
   */
  protected $decoupledRenderer;

  /**
   * Constructs a EntityReferenceDecoupledFormatter object.
   *
   * @param string $plugin_id
   *   The plugin_id for the formatter.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Field\FieldDefinitionInterface $field_definition
   *   The definition of the field to which the formatter is associated.
   * @param array $settings
   *   The formatter settings.
   * @param string $label
   *   The formatter label display setting.
   * @param string $view_mode
   *   The view mode.
   * @param array $third_party_settings
   *   Any third party settings.
   * @param \Drupal\decoupled_toolbox\Service\DecoupledRendererInterface $decoupledRenderer
   *   Decoupled renderer service.
   */
  public function __construct(
    $plugin_id,
    $plugin_definition,
    FieldDefinitionInterface $field_definition,
    array $settings,
    $label,
    $view_mode,
    array $third_party_settings,
    DecoupledRendererInterface $decoupledRenderer
  ) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $label, $view_mode, $third_party_settings);
    $this->decoupledRenderer = $decoupledRenderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    /* @var \Drupal\decoupled_toolbox\Service\DecoupledRendererInterface $decoupledRenderer */
    $decoupledRenderer = $container->get('decoupled.renderer');

    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['label'],
      $configuration['view_mode'],
      $configuration['third_party_settings'],
      $decoupledRenderer);
  }

  /**
   * Set the language code.
   *
   * @param string $langCode
   *   The language code.
   */
  private function setLangCode($langCode) {
    $this->langCode = $langCode;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElementsForDecoupled(FieldItemListInterface $items, $langCode) {
    $this->validateSettingsOnRender();

    $decoupledFieldKey = $this->getDecoupledFieldKey();

    $this->setLangCode($langCode);

    if ($this->isMultivaluedFieldItemList($items)) {
      $processedMultiValuedItems = $this->viewMultivaluedFieldItemList($items);

      if (empty($processedMultiValuedItems)) {
        // No value set.
        $this->setProcessedFieldValue([$decoupledFieldKey => NULL]);
        return [$decoupledFieldKey => NULL];
      }

      $processedFieldValue = [$decoupledFieldKey => $processedMultiValuedItems];
      $this->setProcessedFieldValue($processedFieldValue);
      return $processedFieldValue;
    }

    try {
      /* @var \Drupal\Core\Field\FieldItemInterface $item */
      $item = $items->first();
    }
    catch (MissingDataException $exception) {
      // No value set.
      $this->setProcessedFieldValue([$decoupledFieldKey => NULL]);
      return [$decoupledFieldKey => NULL];
    }

    if (empty($item)) {
      // No value set.
      $this->setProcessedFieldValue([$decoupledFieldKey => NULL]);
      return [$decoupledFieldKey => NULL];
    }

    $processedFieldValue = [$decoupledFieldKey => $this->viewFieldItem($item)];
    $this->setProcessedFieldValue($processedFieldValue);
    return $processedFieldValue;
  }

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    if (!$item instanceof EntityReferenceItem) {
      throw new UnexpectedFormatterException('Tried to render an entity field item, but the given object does not implement EntityReferenceItem.');
    }

    // $fieldValue is supposed to be an array containing at least the target_id
    // key, and the target_revision_id for entity reference revisions fields.
    $fieldValue = $item->getValue();

    if (empty($fieldValue)) {
      // This should never be possible.
      throw new InvalidContentException('Field value is empty.');
    }

    /* @var \Drupal\Core\Entity\ContentEntityInterface $entity */
    $entity = $item->entity;

    if (empty($entity)) {
      // This happens when the reference was deleted.
      throw new InvalidContentException('Reference was deleted.');
    }

    try {
      $cacheTags = [];

      if ($entity->isTranslatable() && $entity->hasTranslation($this->langCode)) {
        $rendered = $this->decoupledRenderer->renderEntityReference(
          $entity->getTranslation($this->langCode), $this->langCode, $cacheTags);
      }
      else {
        // Fallback to default translation.
        $rendered = $this->decoupledRenderer->renderEntityReference($entity, $this->langCode, $cacheTags);
      }
    }
    catch (\Exception $exception) {
      // Unrenderable entity.
      throw new InvalidContentException('Unrenderable entity.');
    }

    foreach ($cacheTags as $tag) {
      $this->addProcessedFieldCacheTag($tag);
    }

    return $rendered;
  }

  /**
   * {@inheritdoc}
   */
  protected function viewMultivaluedFieldItemList(FieldItemListInterface $items) {
    if (!$items instanceof EntityReferenceFieldItemListInterface) {
      throw new UnexpectedFormatterException('Tried to render an entity field list, but the field does not implement EntityReferenceFieldItemListInterface.');
    }

    $data = [];

    foreach ($items as $delta => $item) {
      $data[$delta] = $this->viewFieldItem($item);
    }

    return $data;
  }

}
