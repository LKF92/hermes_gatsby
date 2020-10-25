<?php

namespace Drupal\he_publication_build\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Site\Settings;
use Drupal\datetime\Plugin\Field\FieldType\DateTimeItemInterface;
use Drupal\he_publication_build\Entity\BuildInterface;
use Drupal\he_publication_build\Entity\Build;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller to handle scheduled build.
 */
class BuildScheduledController extends ControllerBase {

  /**
   * AWS building time.
   *
   * @var int
   */
  protected $awsBuildingTime;

  /**
   * Build storage instance.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $buildStorage;

  /**
   * BuildScheduledController constructor.
   *
   * @param \Drupal\Core\Entity\EntityStorageInterface $entityStorage
   *   The build storage class.
   */
  public function __construct(EntityStorageInterface $entityStorage) {
    $this->awsBuildingTime = Settings::get("aws_new_build_interval_time");
    $this->buildStorage = $entityStorage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get("entity_type.manager")->getStorage("build")
    );
  }

  /**
   * {@inheritdoc}
   */
  public function buildScheduled() {
    $scheduled = FALSE;

    if (filter_var($this->awsBuildingTime, FILTER_VALIDATE_INT)) {
      // Current datetime.
      $currentDateTime = new DrupalDateTime();
      $currentDateTime->setTimezone(new \DateTimeZone(DateTimeItemInterface::STORAGE_TIMEZONE));

      // Building datetime.
      $buildingDateTime = new DrupalDateTime(sprintf("+%d sec", $this->awsBuildingTime));
      $buildingDateTime->setTimezone(new \DateTimeZone(DateTimeItemInterface::STORAGE_TIMEZONE));

      $query = $this->buildStorage->getQuery();
      $buildIds = $query->condition("field_status", BuildInterface::SCHEDULED_WAITING_TO_LIVE)
        ->condition("field_publication_date", $currentDateTime->format(DateTimeItemInterface::DATETIME_STORAGE_FORMAT), ">=")
        ->condition("field_publication_date", $buildingDateTime->format(DateTimeItemInterface::DATETIME_STORAGE_FORMAT), "<=")
        ->condition("field_is_schedule", TRUE)
        ->execute();

      if (_is_not_empty($buildIds)) {
        /** @var \Drupal\he_publication_build\Entity\Build $item */
        foreach (Build::loadMultiple($buildIds) as $item) {
          $scheduled[] = [
            "id" => $item->id(),
            "date" => $item->get("field_publication_date")->date->getTimestamp(),
            "status" => $item->get("field_status")->value,
          ];
        }
      }
    }

    return new JsonResponse(["scheduled" => $scheduled]);
  }

}
