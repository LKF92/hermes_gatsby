<?php

namespace Drupal\he_publication_build\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Check (publication datetime) > (current datetime + build time).
 *
 * @Constraint(
 *   id = "document_build_publication_delay_constraint",
 *   label = @Translation("Document Build Publication Delay.", context =
 *   "Validation"), type = "string"
 * )
 */
class DocumentPublicationBuildDelayConstraint extends Constraint {

  /**
   * Message shown when validation fails.
   *
   * @var string
   */
  public $message = "It is not possible to schedule a document publication within one hour of another scheduled document publication.";

}
