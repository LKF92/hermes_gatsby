<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;

/**
 * Decoupled formatter interface.
 */
interface DecoupledFormatterInterface {

  /**
   * Gets the cache tags of the rendered field.
   *
   * This should return cache tags especially on entity reference fields.
   *
   * @return array
   *   The cache tags.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\FieldNotYetProcessedException
   */
  public function getProcessedFieldCacheTags();

  /**
   * Builds decoupled output for a field.
   *
   * Call $this->validateSettingsOnRender() before processing the values to
   * validate the formatter settings.
   *
   * The processed field cache tags may be set from this function.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $items
   *   The field values to be rendered.
   * @param string $langCode
   *   The language that should be used to render the field.
   *
   * @return array
   *   An array structured as the following:
   *   - array values: array of the values ready for decoupled output.
   *   - array tags: array of cache tags which were retrieved from the items.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidContentException
   *   Error when processing a field value.
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidFormatterSettingsException
   *   Wrong settings on the formatter.
   * @throws \Drupal\decoupled_toolbox\Exception\UnexpectedFormatterException
   *   The formatter is not compatible with the field.
   */
  public function viewElementsForDecoupled(FieldItemListInterface $items, $langCode);

}
