<?php

namespace Drupal\he_publication_build\Service;

use Aws\CodeBuild\CodeBuildClient;
use Drupal\Core\Logger\LoggerChannelInterface;

/**
 * Handle build request.
 */
class BuildRequest {

  /**
   * A logger instance.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected $logger;

  /**
   * AWS project name. It may vary between environments.
   *
   * @var string
   */
  protected $awsProjectName;

  /**
   * AWS Code Build client.
   *
   * @var \Aws\CodeBuild\CodeBuildClient
   */
  protected $codeBuildClient;

  /**
   * {@inheritdoc}
   */
  public function __construct(CodeBuildClient $codeBuildClient, $awsProjectName, LoggerChannelInterface $loggerChannel) {
    $this->codeBuildClient = $codeBuildClient;
    $this->awsProjectName = $awsProjectName;
    $this->logger = $loggerChannel;
  }

  /**
   * Starts AWS Code Build.
   *
   * @param array $aws_build_data
   *   The build data.
   *
   * @return \Aws\Result
   *   Aws result.
   */
  public function startBuild(array $aws_build_data) {
    $args = [
      "projectName" => $this->awsProjectName,
      "environmentVariablesOverride" => [
        [
          "name" => "id",
          "type" => "PLAINTEXT",
          "value" => strval($aws_build_data["id"]),
        ],
        [
          "name" => "date",
          "type" => "PLAINTEXT",
          "value" => strval($aws_build_data["date"]),
        ],
        [
          "name" => "isSchedule",
          "type" => "PLAINTEXT",
          "value" => strval($aws_build_data["isSchedule"]),
        ],
      ],
    ];

    return $this->codeBuildClient->startBuild($args);
  }

}
