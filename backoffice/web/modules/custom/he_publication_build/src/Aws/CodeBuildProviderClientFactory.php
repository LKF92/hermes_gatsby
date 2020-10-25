<?php

namespace Drupal\he_publication_build\Aws;

use Aws\CodeBuild\CodeBuildClient;
use Drupal\Core\Site\Settings;

/**
 * Factory to construct code build client.
 *
 * @package Drupal\he_publication_build\Aws
 */
class CodeBuildProviderClientFactory {

  /**
   * Creates a new client.
   *
   * @param \Drupal\Core\Site\Settings $settings
   *   The settings.
   *
   * @return \Aws\CodeBuild\CodeBuildClient
   *   The created client.
   */
  public static function create(Settings $settings) {
    return new CodeBuildClient([
      "version" => "2016-10-06",
      "region" => $settings->get("aws_region"),
      "credentials" => [
        "key" => $settings->get("aws_access_key_id"),
        "secret" => $settings->get("aws_secret_access_key"),
      ],
    ]);
  }

}
