<?php

namespace Drupal\he_publication_build\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates the DocumentPublicationBuildDelay constraint.
 *
 * @package Drupal\he_publication_build\Plugin\Validation\Constraint
 */
class DocumentPublicationBuildDelayConstraintValidator extends ConstraintValidator {

  /**
   * {@inheritdoc}
   */
  public function validate($items, Constraint $constraint) {
    /** @var \Drupal\Core\Entity\ContentEntityInterface $entity */
    $entity = $this->context->getRoot()->getValue();

    /** @var \Drupal\he_publication_build\Service\BuildHelper $build_helper */
    $build_helper = \Drupal::service("build.helper");

    if ($build_helper->isSchedule($entity)
      && $build_helper->isScheduleBuildDelayValidate($entity) === FALSE) {
      $this->context->addViolation($constraint->message);
    }
  }

}
