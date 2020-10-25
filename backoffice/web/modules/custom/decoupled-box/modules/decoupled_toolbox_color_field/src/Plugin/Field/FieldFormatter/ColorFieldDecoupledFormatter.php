<?php

namespace Drupal\decoupled_toolbox_color_field\Plugin\Field\FieldFormatter;

use Drupal\color_field\Plugin\Field\FieldType\ColorFieldType;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\TypedData\Exception\MissingDataException;
use Drupal\decoupled_toolbox\Exception\InvalidContentException;
use Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter\GenericDecoupledFormatter;

/**
 * Plugin implementation of the 'decoupled_color_field' formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_color_field",
 *   label = @Translation("Color field decoupled formatter"),
 *   field_types = {
 *     "color_field_type",
 *   }
 * )
 */
class ColorFieldDecoupledFormatter extends GenericDecoupledFormatter {

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    if (!$item instanceof ColorFieldType) {
      throw new InvalidContentException($this->t('Not a valid color field item.'));
    }

    try {
      return $item->get('color')->getValue();
    }
    catch (MissingDataException $exception) {
      throw new InvalidContentException($this->t('Color value could not be retrieved.'));
    }
  }

}
