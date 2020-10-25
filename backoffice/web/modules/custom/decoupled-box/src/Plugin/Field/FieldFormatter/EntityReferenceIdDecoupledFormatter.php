<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\EntityReferenceItem;
use Drupal\Core\TypedData\Exception\MissingDataException;
use Drupal\decoupled_toolbox\Exception\InvalidContentException;
use Drupal\decoupled_toolbox\Exception\UnexpectedFormatterException;

/**
 * Plugin implementation of the 'decoupled_entity_reference' formatter.
 *
 * This formatter may be used when entity reference field do not need to have
 * its content expanded. This is useful to prevent the referenced entities to
 * invalidate the entity which references them.
 *
 * Of course, the referenced entity tags will not broadcast to the "parent"
 * entity.
 *
 * @FieldFormatter(
 *   id = "decoupled_entity_reference_id",
 *   label = @Translation("Entity reference ID decoupled formatter"),
 *   field_types = {
 *     "entity_reference",
 *     "entity_reference_revisions",
 *   }
 * )
 */
class EntityReferenceIdDecoupledFormatter extends DecoupledFormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElementsForDecoupled(FieldItemListInterface $items, $langCode) {
    $this->validateSettingsOnRender();

    $decoupledFieldKey = $this->getDecoupledFieldKey();

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

    /* @var \Drupal\Core\Entity\EntityInterface $entity */
    $entity = $item->entity;

    if (empty($entity)) {
      // This happens when the reference was deleted.
      throw new InvalidContentException('Reference was deleted.');
    }

    return $entity->id();
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
