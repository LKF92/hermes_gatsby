<?php

namespace Drupal\he_paragraph_constraint\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Check the number of raws attached to this paragraph.
 *
 * @Constraint(
 *   id = "paragraph_governance_constraint",
 *   label = @Translation("Paragraph Governance.", context = "Validation"),
 *   type = "string"
 * )
 */
class ParagraphGovernanceConstraint extends Constraint {

  /**
   * Message shown when validation fails.
   *
   * @var string
   */
  public $message = "The number of raws in paragraph governance must be 1,2 or 4.";

}
