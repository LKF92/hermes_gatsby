<?php

/**
 * @file
 * Primary module hooks for Publication Build module.
 */

use Drupal\Core\Entity\EntityTypeInterface;

/**
 * Implements hook_entity_bundle_field_info_alter().
 */
function he_publication_build_entity_bundle_field_info_alter(array &$fields, EntityTypeInterface $entity_type, $bundle) {
  if (_is_build_feature_enabled()) {
    // Check if publication time is greater than build time.
    if ($entity_type->id() === "node" && $bundle === "document" && isset($fields["field_datetime_publication"])) {
      $fields["field_datetime_publication"]->addConstraint("document_build_publication_delay_constraint", []);
    }
  }
}
