<?php

/**
 * @file
 * global.inc
 */

use Drupal\Core\Site\Settings;
use Drupal\he_publication_build\Entity\BuildInterface;

/**
 * Checks build process status.
 *
 * @return bool
 *   TRUE if enabled.
 */
function _is_build_feature_enabled() {
  return Settings::get("aws_build_enable", FALSE);
}

/**
 * Generates ssg preview uri.
 *
 * @param \Drupal\he_publication_build\Entity\BuildInterface $build
 *   A build entity.
 *
 * @return string|false
 *   The ssg preview uri or FALSE.
 */
function _generate_ssg_preview_uri(BuildInterface $build) {
  $ssg_domain = Settings::get("ssg_domain", NULL);
  if (empty($ssg_domain)) {
    return FALSE;
  }

  // Checks build status.
  $notAuthorizedStatus = [BuildInterface::TO_DO, BuildInterface::ERROR];
  if (in_array($build->get("field_status")->value, $notAuthorizedStatus)) {
    return FALSE;
  }

  return sprintf("https://prev-%d-%d.%s",
    $build->id(),
    $build->get("field_publication_date")->date->getTimeStamp(),
    $ssg_domain
  );
}
