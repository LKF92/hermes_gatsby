<?php

namespace Drupal\he_publication_build\Storage;

use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Entity\Sql\SqlContentEntityStorage;
use Drupal\datetime\Plugin\Field\FieldType\DateTimeItemInterface;
use Drupal\he_publication_build\Entity\BuildInterface;

/**
 * Defines the storage handler class for builds.
 *
 * This extends the base storage class, adding required special handling for
 * build entities.
 */
class BuildStorage extends SqlContentEntityStorage implements BuildStorageInterface {

  /**
   * {@inheritdoc}
   */
  public function create(array $values = []) {
    $build = parent::create($values);
    $build->save();

    return $build;
  }

  /**
   * {@inheritdoc}
   */
  public function getScheduledBuildByInterval($interval) {
    // Current datetime.
    $currentDateTime = new DrupalDateTime();
    $currentDateTime->setTimezone(new \DateTimeZone(DateTimeItemInterface::STORAGE_TIMEZONE));
    // Building interval.
    $buildingDateTimeInterval =
      new DrupalDateTime(sprintf("+%d sec", $interval));
    $buildingDateTimeInterval->setTimezone(new \DateTimeZone(DateTimeItemInterface::STORAGE_TIMEZONE));

    $query = $this->getQuery()
      ->condition(
        "field_status",
        [BuildInterface::BUILT, BuildInterface::SCHEDULED_WAITING_TO_LIVE],
        "IN"
      )
      ->condition("field_publication_date", $currentDateTime->format(DateTimeItemInterface::DATETIME_STORAGE_FORMAT), ">=")
      ->condition("field_publication_date", $buildingDateTimeInterval->format(DateTimeItemInterface::DATETIME_STORAGE_FORMAT), "<=")
      ->condition("field_is_schedule", TRUE);

    $entity_ids = $query->execute();

    return $this->loadMultiple($entity_ids);
  }

  /**
   * {@inheritdoc}
   */
  public function getScheduledBuildByDateTime($datetime) {
    $query = $this->getQuery()
      ->condition("field_status", [
        BuildInterface::BUILT,
        BuildInterface::SCHEDULED_WAITING_TO_LIVE,
      ], "IN")
      ->condition("field_publication_date", $datetime)
      ->condition("field_is_schedule", TRUE);

    $entity_ids = $query->execute();

    return $this->loadMultiple($entity_ids);
  }

  /**
   * {@inheritdoc}
   */
  public function loadAllScheduledBuild() {
    $query = $this->getQuery()
      ->condition("field_status", [
        BuildInterface::BUILT,
        BuildInterface::SCHEDULED_WAITING_TO_LIVE,
      ], "IN")
      ->condition("field_is_schedule", TRUE);

    $entity_ids = $query->execute();

    return $this->loadMultiple($entity_ids);
  }

}
