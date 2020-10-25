<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\EntityReferenceItem;
use Drupal\decoupled_toolbox\Exception\InvalidContentException;
use Drupal\decoupled_toolbox\Exception\UnexpectedFormatterException;

/**
 * Plugin implementation of the 'decoupled_entity_reference' formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_file",
 *   label = @Translation("File decoupled formatter"),
 *   field_types = {
 *     "file",
 *     "image",
 *   }
 * )
 */
class FileDecoupledFormatter extends EntityReferenceDecoupledFormatter {

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    if (!$item instanceof EntityReferenceItem) {
      throw new UnexpectedFormatterException('Tried to render an entity field item, but the given object does not implement EntityReferenceItem.');
    }

    // $fieldValue is supposed to be an array containing at least the target_id
    // key and other values related to a file.
    $fieldValue = $item->getValue();

    if (empty($fieldValue)) {
      // This should never be possible.
      throw new InvalidContentException('Field value is empty.');
    }

    /* @var \Drupal\file\FileInterface $file */
    $file = $item->entity;

    if (empty($file)) {
      // This happens when the reference was deleted.
      throw new InvalidContentException('Reference was deleted.');
    }

    // URLs must be absolute because of decoupled.
    $url = $file->createFileUrl(FALSE);

    foreach ($file->getCacheTags() as $tag) {
      $this->addProcessedFieldCacheTag($tag);
    }

    return [
      'url' => $url,
    ];
  }

}
