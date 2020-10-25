<?php

/**
 * @file
 * alters.inc
 */

use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Entity\EntityInterface;
use Drupal\he_publication_build\Entity\BuildInterface;

/**
 * Implements hook_entity_insert().
 */
function he_publication_build_entity_insert(EntityInterface $entity) {
  _he_publication_build_filter_request($entity, "insert");
}

/**
 * Implements hook_entity_update().
 */
function he_publication_build_entity_update(EntityInterface $entity) {
  _he_publication_build_filter_request($entity, "update");
}

/**
 * Implements hook_entity_delete().
 */
function he_publication_build_entity_delete(EntityInterface $entity) {
  _he_publication_build_filter_request($entity, "delete");
}

/**
 * Centralize hook entity process.
 */
function _he_publication_build_filter_request(EntityInterface $entity, $hook) {
  // Checks build process status.
  if (_is_build_feature_enabled() === FALSE) {
    return FALSE;
  }

  /** @var Drupal\he_publication_build\Service\BuildHelper $build_helper */
  $build_helper = \Drupal::service("build.helper");
  if ($build_helper->isContentAllowRequest($entity, $hook) === FALSE) {
    return FALSE;
  }

  /** @var \Drupal\he_publication_build\Storage\BuildStorageInterface $build_storage */
  $build_storage = \Drupal::entityTypeManager()->getStorage("build");
  if ($build_helper->isSchedule($entity)) {
    // Scheduled publication.
    $publication_date = $entity->get("field_datetime_publication")->value;
    $entities = $build_storage->getScheduledBuildByDateTime($publication_date);
    if (_is_not_empty($entities)) {
      $build = array_shift($entities);
    }
    else {
      $build_data = [
        "title" => "Scheduled publication >> " . $publication_date,
        "field_publication_date" => $publication_date,
        "field_is_schedule" => TRUE,
      ];
      $build = $build_storage->create($build_data);
    }
    $build->set("field_status", BuildInterface::TO_DO);
    $build->get("field_document")->appendItem($entity->id());
    $build->save();
  }
  else {
    // Immediate publication.
    $current_date = new DrupalDateTime("now", "UTC");
    $build_data = [
      "title" => "Immediate publication >> " . $current_date->format("Y-m-d\TH:i:s"),
      "field_publication_date" => $current_date->format("Y-m-d\TH:i:s"),
      "field_is_schedule" => FALSE,
    ];
    $build = $build_storage->create($build_data);
  }

  // Prepare and set aws build data.
  $aws_builds_data[] = [
    "id" => $build->id(),
    "date" => $build->get("field_publication_date")->date->getTimeStamp(),
    "isSchedule" => (int) $build->get("field_is_schedule")->value,
  ];

  // Rebuild scheduled build.
  $entities = $build_storage->loadAllScheduledBuild();
  if (_is_not_empty($entities)) {
    /** @var \Drupal\he_publication_build\Entity\Build $item */
    foreach ($entities as $item) {
      $aws_builds_data[] = [
        "id" => $item->id(),
        "date" => $item->get("field_publication_date")->date->getTimeStamp(),
        "isSchedule" => (int) $item->get("field_is_schedule")->value,
      ];
    }
  }

  /** @var \Drupal\he_publication_build\Service\BuildRequest $build_request */
  $build_request = \Drupal::service("build.request");
  // Start AWS building.
  foreach ($aws_builds_data as $aws_build_data) {
    $build_request->startBuild($aws_build_data);
  }
}
