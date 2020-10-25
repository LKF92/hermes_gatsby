<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\TypedData\Exception\MissingDataException;
use Drupal\decoupled_toolbox\Exception\InvalidContentException;

/**
 * Plugin implementation of the "decoupled_path" formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_path",
 *   label = @Translation("Path alias decoupled formatter."),
 *   field_types = {
 *     "path",
 *   }
 * )
 */
class PathDecoupledFormatter extends GenericDecoupledFormatter {

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    try {
      /* @var \Drupal\path\Plugin\Field\FieldType\PathItem $item */
      return $item->get("alias")->getValue();
    }
    catch (MissingDataException $exception) {
      throw new InvalidContentException($this->t("Path alias could not be retrieved."));
    }
  }

}
