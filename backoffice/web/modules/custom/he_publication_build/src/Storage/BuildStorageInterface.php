<?php

namespace Drupal\he_publication_build\Storage;

use Drupal\Core\Entity\ContentEntityStorageInterface;

/**
 * Defines an interface for build entity storage classes.
 */
interface BuildStorageInterface extends ContentEntityStorageInterface {

  /**
   * Loads all scheduled publication.
   *
   * @return \Drupal\he_publication_build\Entity\BuildInterface[]
   *   Build entities.
   */
  public function loadAllScheduledBuild();

  /**
   * Gets scheduled publication by time interval.
   *
   * @param int $interval
   *   The time interval bundle (in seconds).
   *
   * @return \Drupal\he_publication_build\Entity\BuildInterface[]
   *   Build entities.
   */
  public function getScheduledBuildByInterval($interval);

  /**
   * Gets scheduled publication by datetime.
   *
   * @param string $datetime
   *   Datetime storage format.
   *
   * @return \Drupal\he_publication_build\Entity\BuildInterface[]
   *   Build entities.
   */
  public function getScheduledBuildByDateTime($datetime);

}
