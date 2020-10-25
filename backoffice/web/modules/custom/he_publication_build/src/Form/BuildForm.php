<?php

namespace Drupal\he_publication_build\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for the build entity edit forms.
 */
class BuildForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {

    $entity = $this->getEntity();
    $result = $entity->save();
    $link = $entity->toLink($this->t("View"))->toRenderable();

    $message_arguments = ["%label" => $this->entity->label()];
    $logger_arguments = $message_arguments + ["link" => render($link)];

    if ($result == SAVED_NEW) {
      $this->messenger()->addStatus($this->t("New build %label has been created.", $message_arguments));
      $this->logger("he_publication_build")->notice("Created new build %label", $logger_arguments);
    }
    else {
      $this->messenger()->addStatus($this->t("The build %label has been updated.", $message_arguments));
      $this->logger("he_publication_build")->notice("Updated new build %label.", $logger_arguments);
    }

    $form_state->setRedirect("entity.build.canonical", ["build" => $entity->id()]);
  }

}
