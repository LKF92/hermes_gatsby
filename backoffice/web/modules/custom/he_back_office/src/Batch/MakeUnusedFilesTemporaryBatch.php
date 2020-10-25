<?php

namespace Drupal\he_back_office\Batch;

/**
 * Class MakeUnusedFilesTemporaryBatch.
 */
class MakeUnusedFilesTemporaryBatch {

  /**
   * {@inheritdoc}
   */
  public function process($file) {
    /** @var \Drupal\file\FileInterface $file */
    // Simulate long process by waiting 100 microseconds.
    usleep(100);
    // If there are no more remaining usages of this file, mark it as temporary,
    // which result in a delete through system_cron().
    $usage = \Drupal::service("file.usage")->listUsage($file);
    if (empty($usage)) {
      $file->setTemporary();
      $file->save();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function finished($success, array $results, array $operations) {
    $messenger = \Drupal::messenger();
    if ($success) {
      $messenger->addMessage(t("Operation successfully completed."));
    }
    else {
      $messenger->addError(t("Finished with an error."));
    }
  }

}
