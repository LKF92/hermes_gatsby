<?php

namespace Drupal\he_back_office\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Require unique values for page type field.
 *
 * @Constraint(
 *   id = "page_type_constraint",
 *   label = @Translation("Page type constraint.", context = "Validation"),
 *   type = "string"
 * )
 */
class PageTypeConstraint extends Constraint {

  /**
   * Message shown when validation fails.
   *
   * @var string
   */
  public $message = "They must be only one node as %type.";

}
