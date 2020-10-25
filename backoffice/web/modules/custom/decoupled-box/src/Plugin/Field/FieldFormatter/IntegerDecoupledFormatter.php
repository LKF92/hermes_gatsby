<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;

/**
 * Plugin implementation of the 'decoupled_integer' formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_integer",
 *   label = @Translation("Integer decoupled formatter"),
 *   field_types = {
 *     "integer",
 *   }
 * )
 */
class IntegerDecoupledFormatter extends GenericDecoupledFormatter {

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    // The item is an IntegerItem.
    // It should be safe to serve the cast raw value.
    return (int) $item->value;
  }

}
