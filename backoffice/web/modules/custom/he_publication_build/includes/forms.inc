<?php

/**
 * @file
 * forms.inc
 */

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Entity\EntityFormInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\Url;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\ContentEntityFormInterface;
use Drupal\Core\Site\Settings;

/**
 * Implements hook_entity_operation().
 */
function he_publication_build_entity_operation_alter(array &$operations, EntityInterface $entity) {
  // Make sure we are modifying only build entity.
  if ($entity->getEntityTypeId() !== "build") {
    return FALSE;
  }

  /** @var \Drupal\he_publication_build\Entity\BuildInterface $entity */
  if (filter_var($ssg_preview_uri = _generate_ssg_preview_uri($entity),
    FILTER_VALIDATE_URL)) {
    $operations["ssg_preview"] = [
      "title" => new TranslatableMarkup("Preview"),
      "weight" => 100,
      "url" => Url::fromUri(
        $ssg_preview_uri,
        ["attributes" => ["target" => "_blank"]]
      ),
    ];
  }
}

/**
 * Implements hook_form_BASE_FORM_ID_alter().
 */
function he_publication_build_form_build_form_alter(&$form, FormStateInterface $form_state, $form_id) {
  if ($form_id !== "build_edit_form") {
    return FALSE;
  }

  if ($form_state->getFormObject() instanceof EntityFormInterface) {
    /** @var \Drupal\he_publication_build\Entity\BuildInterface $build */
    $build = $form_state->getformObject()->getEntity();
    if (filter_var($ssg_preview_uri = _generate_ssg_preview_uri($build),
      FILTER_VALIDATE_URL)) {
      $form["actions"]["ssg_preview"] = [
        "#type" => "link",
        "#title" => new TranslatableMarkup("Preview"),
        "#access" => TRUE,
        "#attributes" => [
          "class" => ["button"],
        ],
        "#weight" => 5,
        "#button_type" => "primary",
        "#url" => Url::fromUri(
          $ssg_preview_uri,
          ["attributes" => ["target" => "_blank"]]
        ),
      ];
    }
  }
}

/**
 * Implements hook_form_alter().
 */
function he_publication_build_form_alter(&$form, FormStateInterface $form_state, $form_id) {
  // Checks build process status.
  if (_is_build_feature_enabled() === FALSE) {
    return FALSE;
  }

  // Checks that current form is a instance of entity form class.
  $form_object = $form_state->getFormObject();
  if (!$form_object instanceof ContentEntityFormInterface
    || !$form_object->getEntity() instanceof ContentEntityInterface) {
    return FALSE;
  }

  $entity = $form_object->getEntity();
  /** @var \Drupal\he_publication_build\Service\BuildHelper $build_helper */
  $build_helper = \Drupal::service("build.helper");
  // Defines hook operation.
  $hook = $entity->isNew() ? "insert" : "update";
  if ($build_helper->isContentAllowRequest($entity, $hook) === FALSE) {
    return FALSE;
  }

  /** @var \Drupal\he_publication_build\Storage\BuildStorageInterface $build_storage */
  $build_storage = \Drupal::entityTypeManager()->getStorage("build");
  $interval = Settings::get("aws_update_build_interval_time");
  if (_is_not_empty($build_storage->getScheduledBuildByInterval($interval))) {
    // Disable submit buttons.
    $form["actions"]["submit"]["#access"] = FALSE;
    $form["actions"]["delete"]["#access"] = FALSE;
    $form["actions"]["ssr_preview"]["#access"] = TRUE;

    \Drupal::messenger()
      ->addWarning(t("It is not possible to make a contribution within 15 minutes before the scheduled time of a document publication."));
  }
}
