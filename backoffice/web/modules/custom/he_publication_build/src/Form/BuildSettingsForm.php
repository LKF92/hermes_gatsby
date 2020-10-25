<?php

namespace Drupal\he_publication_build\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configuration form for a build entity type.
 */
class BuildSettingsForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return "build_settings";
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form["settings"] = [
      "#markup" => $this->t("Settings form for a build entity type."),
    ];

    $form["actions"] = [
      "#type" => "actions",
    ];

    $form["actions"]["submit"] = [
      "#type" => "submit",
      "#value" => $this->t("Save"),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->messenger()->addStatus($this->t("The configuration has been updated."));
  }

}
