<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;

/**
 * Plugin implementation of the "decoupled_boolean" formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_boolean",
 *   label = @Translation("Boolean decoupled formatter."),
 *   field_types = {
 *     "boolean",
 *   }
 * )
 */
class BooleanDecoupledFormatter extends GenericDecoupledFormatter {

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    // Convert Integer 1/0 to Boolean true/false.
    return filter_var($item->value, FILTER_VALIDATE_BOOLEAN);
  }

}
