<?php

namespace Drupal\he_publication_build\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;

/**
 * Provides an interface defining a build entity type.
 */
interface BuildInterface extends ContentEntityInterface, EntityChangedInterface {

  /**
   * Denotes that the build has to be done.
   */
  const TO_DO = 0;

  /**
   * Denotes that the build is built.
   */
  const BUILT = 1;

  /**
   * Denotes that the build is scheduled & waiting to live.
   */
  const SCHEDULED_WAITING_TO_LIVE = 2;

  /**
   * Denotes that the build is scheduled in live.
   */
  const SCHEDULED_IN_LIVE = 3;

  /**
   * Denotes that the build is in live.
   */
  const CURRENT_LIVE = 4;

  /**
   * Denotes that the build is done.
   */
  const DONE = 5;

  /**
   * Denotes that the build has error.
   */
  const ERROR = -1;

  /**
   * Gets the build title.
   *
   * @return string
   *   Title of the build.
   */
  public function getTitle();

  /**
   * Sets the build title.
   *
   * @param string $title
   *   The build title.
   *
   * @return \Drupal\he_publication_build\Entity\BuildInterface
   *   The called build entity.
   */
  public function setTitle($title);

  /**
   * Gets the build creation timestamp.
   *
   * @return int
   *   Creation timestamp of the build.
   */
  public function getCreatedTime();

  /**
   * Sets the build creation timestamp.
   *
   * @param int $timestamp
   *   The build creation timestamp.
   *
   * @return \Drupal\he_publication_build\Entity\BuildInterface
   *   The called build entity.
   */
  public function setCreatedTime($timestamp);

}
