<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;

/**
 * Plugin implementation of the 'decoupled_float' formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_float",
 *   label = @Translation("Float decoupled formatter"),
 *   field_types = {
 *     "decimal",
 *     "float",
 *   }
 * )
 */
class FloatDecoupledFormatter extends GenericDecoupledFormatter {

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    // The item is either a DecimalItem or a FloatItem.
    // It should be safe to serve the cast raw value.
    return (float) $item->value;
  }

}
