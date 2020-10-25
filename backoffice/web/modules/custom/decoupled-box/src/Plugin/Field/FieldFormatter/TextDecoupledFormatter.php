<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\TypedData\Exception\MissingDataException;
use Drupal\decoupled_toolbox\Exception\InvalidContentException;

/**
 * Plugin implementation of the 'decoupled_text' formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_text",
 *   label = @Translation("Text decoupled formatter"),
 *   field_types = {
 *     "text",
 *     "text_long",
 *     "text_with_summary",
 *   }
 * )
 */
class TextDecoupledFormatter extends GenericDecoupledFormatter {

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    try {
      // "processed" is a computed property of TextItemBase.
      /* @var \Drupal\text\Plugin\Field\FieldType\TextItemBase $item */
      $properties = $item->getProperties(TRUE);
    }
    catch (MissingDataException $exception) {
      throw new InvalidContentException($this->t('Field value is empty.'));
    }

    /* @var \Drupal\text\TextProcessed $processed */
    $processed = $properties['processed'];

    foreach ($processed->getCacheTags() as $cacheTag) {
      // Cache tag coming from the text filter or an embed media.
      $this->addProcessedFieldCacheTag($cacheTag);
    }

    $processedText = $processed->getValue();

    return $processedText;
  }

}
