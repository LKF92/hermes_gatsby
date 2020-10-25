<?php

namespace Drupal\he_back_office\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates the PageTypeConstraintValidator constraint.
 *
 * @package Drupal\he_back_office\Plugin\Validation\Constraint
 */
class PageTypeConstraintValidator extends ConstraintValidator {

  /**
   * {@inheritdoc}
   */
  public function validate($items, Constraint $constraint) {
    /** @var \Drupal\node\NodeInterface $node */
    $node = $this->context->getRoot()->getValue();

    $type = $node->get("field_page_type")->value;
    if ($type === "content") {
      return TRUE;
    }

    $query = \Drupal::entityTypeManager()
      ->getStorage("node")->getQuery()
      ->condition("field_page_type", $type);
    if (!$node->isNew()) {
      $query->condition("nid", $node->id(), "<>");
    }

    if ($query->count()->execute()) {
      $this->context->addViolation($constraint->message, [
        "%type" => $type,
      ]);
    }
  }

}
