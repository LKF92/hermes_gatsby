<?php

namespace Drupal\decoupled_toolbox\Service;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\decoupled_toolbox\Exception\CouldNotRetrieveContentException;
use Drupal\decoupled_toolbox\Exception\FieldNotYetProcessedException;
use Drupal\decoupled_toolbox\Exception\InvalidContentException;
use Drupal\decoupled_toolbox\Exception\InvalidFormatterSettingsException;
use Drupal\decoupled_toolbox\Exception\UnavailableDecoupledViewDisplayException;
use Drupal\decoupled_toolbox\Exception\UnexpectedFormatterException;
use Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter\DecoupledFormatterInterface;

/**
 * Renders an entity for decoupled.
 */
class DecoupledRenderer implements DecoupledRendererInterface {

  /**
   * Cache backend service.
   *
   * @var \Drupal\Core\Cache\CacheBackendInterface
   */
  private $cacheBackend;

  /**
   * Array containing entities which are currently rendering.
   *
   * Use this to prevent entity reference infinite loops.
   *
   * @var \Drupal\Core\Entity\ContentEntityInterface[]
   */
  private $currentEntityRenderStack = [];

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  private $entityTypeManager;

  /**
   * Contains a collection of EntityViewDisplayInterface for reuse.
   *
   * Items are indexed by ID such as "node.article.teaser".
   *
   * @var \Drupal\Core\Entity\Display\EntityViewDisplayInterface[]
   */
  private $entityViewDisplayCache = [];

  /**
   * Entity view display storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  private $entityViewDisplayStorage;

  /**
   * Language manager service.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  private $languageManager;

  /**
   * Renderer constructor.
   *
   * @param \Drupal\Core\Cache\CacheBackendInterface $cacheBackend
   *   Cache backend service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   Entity type manager service.
   * @param \Drupal\Core\Language\LanguageManagerInterface $languageManager
   *   Language manager service.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function __construct(
    CacheBackendInterface $cacheBackend,
    EntityTypeManagerInterface $entityTypeManager,
    LanguageManagerInterface $languageManager) {
    $this->cacheBackend = $cacheBackend;
    $this->entityTypeManager = $entityTypeManager;
    $this->languageManager = $languageManager;
    $this->entityViewDisplayStorage = $entityTypeManager->getStorage('entity_view_display');
  }

  /**
   * Adds the specified entity to the current entity render stack.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity to add.
   */
  private function addEntityToCurrentEntityRenderStack(ContentEntityInterface $entity) {
    $this->currentEntityRenderStack[$this->getEntityRenderStackEntityId($entity)] = $entity;
  }

  /**
   * Caches the render result.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity which was rendered.
   * @param array $finalizedRender
   *   Array of values ready for decoupled output.
   * @param array $cacheTagsToMerge
   *   Array of additional cache tags to merge.
   * @param string $langCode
   *   The language code.
   */
  private function cacheRenderedEntityResult(ContentEntityInterface $entity, array $finalizedRender, array $cacheTagsToMerge, $langCode = NULL) {
    $mergedCacheTags = _decoupled_toolbox_cache_merge_tags($cacheTagsToMerge, $entity->getCacheTags());
    $cacheId = $this->getCacheIdForEntity($entity, $langCode);
    $this->cacheBackend->set($cacheId, $finalizedRender, Cache::PERMANENT, $mergedCacheTags);
  }

  /**
   * Finalizes the fields to render.
   *
   * The output is freed from metadata and ready for serialization such as a
   * JSON object.
   *
   * @param array $fieldsToRender
   *   Fields to render as given by $this->filterFields(...).
   *
   * @return array
   *   True values without metadata ready for serialization.
   */
  private function finalizeFieldsToRender(array $fieldsToRender) {
    $finalized = [];

    foreach ($fieldsToRender as $item) {
      $finalized += $item['renderedFieldValue'];
    }

    return $finalized;
  }

  /**
   * Gets the cache ID for the specified entity.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   Content entity.
   * @param string $langCode
   *   The language code.
   *
   * @return string
   *   Cache ID ready for use.
   */
  private function getCacheIdForEntity(ContentEntityInterface $entity, $langCode) {
    return $this->getCacheIdForEntityTypeAndId($entity->getEntityTypeId(), $entity->id(), $langCode);
  }

  /**
   * Gets the cache ID for the specified entity.
   *
   * @param string $entityTypeId
   *   Entity type ID.
   * @param int $id
   *   ID of the entity.
   * @param string $langCode
   *   The language code.
   *
   * @return string
   *   Cache ID ready for use.
   */
  private function getCacheIdForEntityTypeAndId($entityTypeId, $id, $langCode) {
    return 'decoupled.' . $entityTypeId . '.' . $id . (is_null($langCode) ? '' : '.' . $langCode);
  }

  /**
   * Gets the entity view display for the given entity.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity to get the view display.
   *
   * @return \Drupal\Core\Entity\Display\EntityViewDisplayInterface|null
   *   The entity view display object, or NULL if not found.
   */
  private function getDecoupledViewDisplayForEntity(ContentEntityInterface $entity) {
    $entityTypeId = $entity->getEntityTypeId();
    $entityBundle = $entity->bundle();

    $viewDisplayId = $entityTypeId . '.' . $entityBundle . '.' . EntityViewDisplayManagerInterface::ENTITY_DECOUPLED_VIEW_MODE_ID;

    if (isset($this->entityViewDisplayCache[$viewDisplayId])) {
      // Already loaded. Reuse the value. May return NULL if the entity view
      // display does not exist.
      return $this->entityViewDisplayCache[$viewDisplayId];
    }

    /* @var \Drupal\Core\Entity\Display\EntityViewDisplayInterface $viewDisplay */
    $viewDisplay = $this->entityViewDisplayStorage->load($viewDisplayId);

    // Cache the result.
    $this->entityViewDisplayCache[$viewDisplayId] = $viewDisplay;

    return $viewDisplay;
  }

  /**
   * Retrieves the rendered entity cached data.
   *
   * @param string $entityTypeId
   *   Entity type ID.
   * @param int $id
   *   ID of the entity.
   * @param string $langCode
   *   The language code.
   *
   * @return object|null
   *   Cached data object, or NULL if not yet cached.
   *   This is a stdClass object containing cache values.
   */
  private function getEntityCachedDataByEntityTypeAndId($entityTypeId, $id, $langCode = NULL) {
    $cacheId = $this->getCacheIdForEntityTypeAndId($entityTypeId, $id, $langCode);
    $cacheObject = $this->cacheBackend->get($cacheId);

    if (empty($cacheObject)) {
      return NULL;
    }

    return $cacheObject;
  }

  /**
   * Gets the ID used for the currentEntityRenderStack array.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity which we want to get the entity render stack ID.
   *
   * @return string
   *   Entity render stack ID.
   */
  private function getEntityRenderStackEntityId(ContentEntityInterface $entity) {
    return $entity->getEntityTypeId() . '.' . $entity->id();
  }

  /**
   * Tells whether the given entity is already in the current render stack.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity to check.
   *
   * @return bool
   *   TRUE if already in current render stack. FALSE otherwise.
   */
  private function isEntityInCurrentEntityRenderStack(ContentEntityInterface $entity) {
    return array_key_exists($this->getEntityRenderStackEntityId($entity), $this->currentEntityRenderStack);
  }

  /**
   * Adds the specified entity to the current entity render stack.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity to remove.
   */
  private function removeEntityFromCurrentEntityRenderStack(ContentEntityInterface $entity) {
    unset($this->currentEntityRenderStack[$this->getEntityRenderStackEntityId($entity)]);
  }

  /**
   * {@inheritdoc}
   */
  public function renderByEntityTypeAndId($entityTypeId, $id, &$cacheTags) {
    $cachedDataObject = $this->getEntityCachedDataByEntityTypeAndId($entityTypeId, $id);

    if (!empty($cachedDataObject)) {
      // Entry found in cache.
      $cacheTags = $cachedDataObject->tags;

      // The returned value can be an empty array and be a valid value.
      return $cachedDataObject->data;
    }

    try {
      $entityStorage = $this->entityTypeManager->getStorage($entityTypeId);
    }
    catch (\Exception $exception) {
      // Storage error.
      throw new CouldNotRetrieveContentException();
    }

    $entity = $entityStorage->load($id);

    if (empty($entity)) {
      throw new CouldNotRetrieveContentException();
    }

    if (!$entity instanceof ContentEntityInterface) {
      throw new InvalidContentException();
    }

    $rendered = [];
    $cacheTagsFromFieldsMerged = [];

    $rendered["id"] = $entity->id();
    $rendered["uuid"] = $entity->uuid();
    $rendered["bundle"] = $entity->bundle();

    // If the entity type is translatable, we return the proper
    // translations objects for the current entity.
    /* @var \Drupal\Core\Language\LanguageInterface $language */
    foreach ($entity->getTranslationLanguages(TRUE) as $language) {
      $langCode = $language->getId();
      // Render the entity translation.
      // This will put the entity in cache upon completion.
      $cacheTagsFromFields = [];
      $rendered[$langCode] = $this->renderEntity($entity->getTranslation($langCode), $cacheTagsFromFields);

      $cacheTagsFromFieldsMerged = _decoupled_toolbox_cache_merge_tags($cacheTagsFromFieldsMerged, $cacheTagsFromFields);
    }

    // Cache the rendered object using the field tags.
    $this->cacheRenderedEntityResult($entity, $rendered, $cacheTagsFromFieldsMerged);

    // Retrieve the entity cached data created by $this->renderEntity(...).
    $cacheDataObject = $this->getEntityCachedDataByEntityTypeAndId($entityTypeId, $id);

    $cacheTags = [];

    if (!empty($cacheDataObject)) {
      // It happens that the currently rendered entity is already rendering in
      // the render stack without being yet in cache, especially when an entity
      // ends up referencing itself (through a field, terms, paragraphs, etc)
      // and the entity being new or after a cache clear.
      //
      // In this particular case here, we know that the entity has already been
      // put in cache so we can return the cache tags which were set.
      //
      // If it was not, we simply have to not return cache tags because they
      // will be handled by the entity which is rendering on the lower end of
      // the stack. After all, these are the same object.
      $cacheTags = $this->getEntityCachedDataByEntityTypeAndId($entityTypeId, $id)->tags;
    }

    return $rendered;
  }

  /**
   * Renders an entity reference.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity to render.
   * @param string $langCode
   *   The language code.
   * @param array $cacheTags
   *   Cache tags associated to the rendered entity and its descendants from
   *   fields.
   *
   * @return array
   *   The rendered content as array, ready for serialization.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\UnavailableDecoupledViewDisplayException
   *   The decoupled view display is not available on the given entity.
   */
  public function renderEntityReference(ContentEntityInterface $entity, $langCode, array &$cacheTags) {
    $cachedDataObject = $this->getEntityCachedDataByEntityTypeAndId($entity->getEntityTypeId(), $entity->id(), $langCode);

    if (!empty($cachedDataObject)) {
      // Entry found in cache.
      $cacheTags = $cachedDataObject->tags;

      // The returned value can be an empty array and be a valid value.
      return $cachedDataObject->data;
    }

    // Render the entity.
    $cacheTagsFromFields = [];
    $rendered = $this->renderEntity($entity, $cacheTagsFromFields);

    // Cache the rendered object using the field tags.
    $this->cacheRenderedEntityResult($entity, $rendered, $cacheTagsFromFields, $langCode);

    // Retrieve the entity cached data created by $this->renderEntity(...).
    $cacheDataObject = $this->getEntityCachedDataByEntityTypeAndId($entity->getEntityTypeId(), $entity->id(), $langCode);

    $cacheTags = [];

    if (!empty($cacheDataObject)) {
      // It happens that the currently rendered entity is already rendering in
      // the render stack without being yet in cache, especially when an entity
      // ends up referencing itself (through a field, terms, paragraphs, etc)
      // and the entity being new or after a cache clear.
      //
      // In this particular case here, we know that the entity has already been
      // put in cache so we can return the cache tags which were set.
      //
      // If it was not, we simply have to not return cache tags because they
      // will be handled by the entity which is rendering on the lower end of
      // the stack. After all, these are the same object.
      $cacheTags = $this->getEntityCachedDataByEntityTypeAndId($entity->getEntityTypeId(), $entity->id(), $langCode)->tags;
    }

    return $rendered;
  }

  /**
   * Renders the specified content entity.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity to render.
   * @param array $cacheTagsFromFields
   *   Cache tags associated to the entity descendants fields.
   *
   * @return array
   *   The rendered content as array, ready for serialization.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\UnavailableDecoupledViewDisplayException
   *   The entity has no decoupled view display set.
   */
  private function renderEntity(ContentEntityInterface $entity, array &$cacheTagsFromFields) {
    if ($this->isEntityInCurrentEntityRenderStack($entity)) {
      // The entity is already rendering in the stack. We have to prevent
      // infinite loops by not attempting to render this entity again.
      return [
        $entity->getEntityType()->getKey('id') => $entity->id(),
        'infiniteInclusionPrevention' => TRUE,
      ];
    }

    $this->addEntityToCurrentEntityRenderStack($entity);

    // Get the decoupled view mode for the given entity.
    $viewDisplay = $this->getDecoupledViewDisplayForEntity($entity);

    if (empty($viewDisplay)) {
      throw new UnavailableDecoupledViewDisplayException();
    }

    // Get active fields on this view display.
    $enabledFields = $viewDisplay->getComponents();

    // Get language code.
    $langCode = $entity->language()->getId();

    $fieldsToRender = [];
    $cacheTagsFromFields = [];

    foreach ($enabledFields as $fieldId => $fieldSettings) {
      $fieldRenderer = $viewDisplay->getRenderer($fieldId);

      if (!$fieldRenderer instanceof DecoupledFormatterInterface) {
        // Filter out fields without a valid formatter.
        continue;
      }

      $fieldItemList = $entity->get($fieldId);

      try {
        $renderedFieldValue = $fieldRenderer->viewElementsForDecoupled($fieldItemList, $langCode);

        // Retrieve cache tags from the processed field. This is useful for
        // entity references or specific formatters which may need to invalidate
        // caches.
        $cacheTagsFromFields = _decoupled_toolbox_cache_merge_tags($cacheTagsFromFields, $fieldRenderer->getProcessedFieldCacheTags());
      }
      catch (FieldNotYetProcessedException $exception) {
        // This should never happen here.
        continue;
      }
      catch (InvalidContentException $exception) {
        // Do not block on content error.
        // Silently ignore this field.
        continue;
      }
      catch (InvalidFormatterSettingsException $exception) {
        // Reporting the error in watchdog may result in database spam.
        // Silently ignore this field.
        continue;
      }
      catch (UnexpectedFormatterException $exception) {
        // A formatter was set on a field which does not support it. E.g. an
        // entity formatter was set on a field which does not implements
        // EntityReferenceFieldItemListInterface.
        // Silently ignore this field.
        continue;
      }

      $fieldsToRender[] = [
        'renderedFieldValue' => $renderedFieldValue,
        'weight' => $enabledFields[$fieldId]['weight'],
      ];
    }

    // Respect the weight set on the field UI of the view mode.
    $this->sortFieldsToRenderByWeight($fieldsToRender);

    // Remove metadata.
    $finalValues = $this->finalizeFieldsToRender($fieldsToRender);

    // We are safe from infinite loops.
    $this->removeEntityFromCurrentEntityRenderStack($entity);

    return $finalValues;
  }

  /**
   * Sorts the fields to render by their weight key.
   *
   * @param array &$fieldsToRender
   *   Array of fields to render.
   */
  private function sortFieldsToRenderByWeight(array &$fieldsToRender) {
    usort($fieldsToRender, function ($a, $b) {
      return $a['weight'] <=> $b['weight'];
    });
  }

}
