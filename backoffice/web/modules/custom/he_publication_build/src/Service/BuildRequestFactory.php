<?php

namespace Drupal\he_publication_build\Service;

use Aws\CodeBuild\CodeBuildClient;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\Core\Site\Settings;

/**
 * Constructs build.request service.
 *
 * @package Drupal\he_publication_build\Service
 */
class BuildRequestFactory {

  /**
   * {@inheritdoc}
   */
  public static function create(Settings $settings, CodeBuildClient $codeBuildClient, LoggerChannelInterface $loggerChannel) {
    return new BuildRequest(
      $codeBuildClient,
      $settings->get("aws_project_name"),
      $loggerChannel
    );
  }

}
