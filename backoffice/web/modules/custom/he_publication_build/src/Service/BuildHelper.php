<?php

namespace Drupal\he_publication_build\Service;

use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Site\Settings;
use Drupal\menu_link_content\MenuLinkContentInterface;
use Drupal\node\NodeInterface;

/**
 * Build helper functions.
 *
 * @package Drupal\he_publication_build\Service
 */
class BuildHelper {

  /**
   * The build storage.
   *
   * @var \Drupal\he_publication_build\Storage\BuildStorageInterface
   */
  protected $buildStorage;

  /**
   * {@inheritdoc}
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager) {
    $this->buildStorage = $entityTypeManager->getStorage("build");
  }

  /**
   * Checks if content update require a build request.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param string $hook
   *   The entity hook.
   *
   * @return bool
   *   Weather or not the content update is allowed to request a build.
   */
  public function isContentAllowRequest(EntityInterface $entity, $hook) {
    // Filter by entity type.
    $is_node = $entity instanceof NodeInterface;
    $is_menu_link_content = $entity instanceof MenuLinkContentInterface;

    if ($is_node === FALSE
      && $is_menu_link_content === FALSE) {
      return FALSE;
    }

    // Filter by entity bundle.
    $bundles_filter = [
      "main",
      "footer",
      "main-en",
      "footer-en",
      "agenda",
      "document",
      "letter_to_shareholders",
      "page",
      "page_rse",
    ];

    if (in_array($entity->bundle(), $bundles_filter) === FALSE) {
      return FALSE;
    }

    // Filter new content unpublished.
    if ($is_node && ($hook === "insert")
      && $entity->isPublished() === FALSE) {
      return FALSE;
    }

    // Filter by moderation state.
    if ($entity->bundle() == "page_rse") {
      /** @var \Drupal\node\NodeInterface $entity */
      $lang_code = $entity->language()->getId();
      $entity_translation = $entity->getTranslation($lang_code);

      if (in_array($entity_translation->moderation_state->value,
        ["draft", "review"])) {
        return FALSE;
      }
    }

    return TRUE;
  }

  /**
   * Checks if content update require a scheduled build request.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   *
   * @return bool
   *   Weather or not this content update require a schedules build request.
   *
   * @throws \Exception
   */
  public function isSchedule(EntityInterface $entity) {
    $is_node = $entity instanceof NodeInterface;
    if ($is_node === FALSE) {
      return FALSE;
    }

    /** @var \Drupal\node\NodeInterface $entity */
    $is_document = ($entity->bundle() == "document");
    if ($is_document === FALSE) {
      return FALSE;
    }

    if ($entity->hasField("field_datetime_publication") === FALSE
      || $entity->get("field_datetime_publication")->isEmpty()) {
      return FALSE;
    }

    $publication_date = $entity->get("field_datetime_publication")->date->getTimestamp();
    $current_date = new DrupalDateTime("now", "UTC");
    if ($publication_date < $current_date->getTimestamp()) {
      return FALSE;
    }

    return TRUE;
  }

  /**
   * Check (publication datetime) > (current datetime + build time).
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   *
   * @return bool
   *   Weather or not this content update require a schedule build request.
   *
   * @throws \Exception
   */
  public function isScheduleBuildDelayValidate(EntityInterface $entity) {
    $publication_date = $entity->get("field_datetime_publication")->date->getTimestamp();
    // Gets builds by datetime publication.
    $entities = $this->buildStorage->getScheduledBuildByDateTime($publication_date);
    if (_is_not_empty($entities)) {
      return TRUE;
    }

    // Current datetime.
    $current_date = new DrupalDateTime("now", "UTC");
    // Determine the building date.
    $build_date = $current_date->getTimestamp() + Settings::get("aws_new_build_interval_time");
    // Check if publication date is greater than building date.
    if ($publication_date > $build_date) {
      return TRUE;
    }

    return FALSE;
  }

}
