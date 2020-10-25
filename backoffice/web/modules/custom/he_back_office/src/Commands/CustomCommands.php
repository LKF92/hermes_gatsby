<?php

namespace Drupal\he_back_office\Commands;

use Drush\Commands\DrushCommands;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;

/**
 * A command file.
 *
 * @package Drupal\he_back_office\Commands
 */
class CustomCommands extends DrushCommands {

  /**
   * Entity type service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  private $entityTypeManager;

  /**
   * Logger service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  private $loggerChannelFactory;

  /**
   * Constructs a new CustomCommands object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   Entity type service.
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $loggerChannelFactory
   *   Logger service.
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager, LoggerChannelFactoryInterface $loggerChannelFactory) {
    $this->entityTypeManager = $entityTypeManager;
    $this->loggerChannelFactory = $loggerChannelFactory;
  }

  /**
   * Make unused managed files temporary.
   *
   * @command he_back_office:make-unused-files-temporary
   * @aliases make-unused-managed-files-temporary
   */
  public function makeUnusedFilesTemporary() {
    // 1. Log the start of the script.
    $this->loggerChannelFactory->get("he_back_office")
      ->info("Make unused managed files temporary operation start");
    $this->logger()->notice("Batch operations start.");

    // 2. Retrieve all permanent files.
    $files = [];
    try {
      $files = $this->entityTypeManager->getStorage("file")
        ->loadByProperties(["status" => FILE_STATUS_PERMANENT]);
    }
    catch (\Exception $e) {
      $this->output()->writeln($e);
      $this->loggerChannelFactory->get("he_back_office")
        ->warning("Error found @e", ["@e" => $e]);
    }

    // 3. Create the operations array for the batch.
    $operations = [];
    if (_is_not_empty($files)) {
      foreach ($files as $file) {
        // Prepare the operation. Here we could do other operations on files.
        $this->output()->writeln("Processing filename: " . $file->label());
        $operations[] = [
          "\Drupal\he_back_office\Batch\MakeUnusedFilesTemporaryBatch::process",
          [$file],
        ];
      }
    }
    else {
      $this->logger()
        ->warning("No permanent file found.");
    }

    // 4. Create the batch.
    $batch = [
      "title" => t("Make unused managed files temporary"),
      "operations" => $operations,
      "finished" => "\Drupal\he_back_office\Batch\MakeUnusedFilesTemporaryBatch::Finished",
    ];
    // 5. Add batch operations as new batch sets.
    batch_set($batch);

    // 7. Process the batch sets.
    drush_backend_batch_process();

    // 8. Show some information.
    $this->logger()->notice("Batch operations end.");

    // 9. Log some information.
    $this->loggerChannelFactory->get("he_back_office")
      ->info("Process batch operations end.");
  }

}
