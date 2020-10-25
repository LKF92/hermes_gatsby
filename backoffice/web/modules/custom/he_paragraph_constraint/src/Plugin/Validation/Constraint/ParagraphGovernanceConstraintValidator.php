<?php

namespace Drupal\he_paragraph_constraint\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates the ParagraphGovernanceConstraint constraint.
 *
 * @package Drupal\he_paragraph_constraint\Plugin\Validation\Constraint
 */
class ParagraphGovernanceConstraintValidator extends ConstraintValidator {

  /**
   * {@inheritdoc}
   */
  public function validate($items, Constraint $constraint) {
    /** @var \Drupal\Core\Entity\ContentEntityInterface $entity */
    $entity = $this->context->getRoot()->getValue();

    if (_is_field_not_empty($entity, "field_image_teaser")) {
      $authorized_number = [1, 2, 4];

      if (!in_array($entity->get("field_image_teaser")
        ->count(), $authorized_number)) {
        $this->context->addViolation($constraint->message);
      }
    }
  }

}
