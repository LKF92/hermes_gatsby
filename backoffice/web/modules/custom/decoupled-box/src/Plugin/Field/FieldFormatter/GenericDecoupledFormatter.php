<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\TypedData\Exception\MissingDataException;

/**
 * Plugin implementation of the 'decoupled_generic' formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_generic",
 *   label = @Translation("Generic decoupled formatter"),
 *   field_types = {
 *     "changed",
 *     "created",
 *     "comment",
 *     "daterange",
 *     "datetime",
 *     "decimal",
 *     "email",
 *     "file_uri",
 *     "float",
 *     "integer",
 *     "language",
 *     "list_float",
 *     "list_integer",
 *     "list_string",
 *     "map",
 *     "password",
 *     "string",
 *     "string_long",
 *     "timestamp",
 *     "telephone",
 *     "text",
 *     "text_long",
 *     "text_with_summary",
 *     "uri",
 *     "uuid",
 *   }
 * )
 */
class GenericDecoupledFormatter extends DecoupledFormatterBase {

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
    // The text value has no text format assigned to it, so the user input
    // should equal the output, including newlines.
    return nl2br(_decoupled_toolbox_html_escape($item->value));
  }

  /**
   * {@inheritdoc}
   */
  protected function viewMultivaluedFieldItemList(FieldItemListInterface $items) {
    $data = [];

    foreach ($items as $delta => $item) {
      $data[$delta] = $this->viewFieldItem($item);
    }

    return $data;
  }

}
