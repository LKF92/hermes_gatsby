<?php

namespace Drupal\he_publication_build\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Site\Settings;
use Drupal\he_publication_build\Service\BuildRequest;
use Drupal\he_publication_build\Entity\Build;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Controller to handle Build status update.
 */
class BuildRollbackController extends ControllerBase {

  /**
   * AWS build enable.
   *
   * @var string
   */
  protected $awsBuildEnable;

  /**
   * {@inheritdoc}
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   *   Request stack service.
   */
  private $requestStack;

  /**
   * An instance of the entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * An instance of the Build service.
   *
   * @var \Drupal\he_publication_build\Service\BuildRequest
   */
  protected $buildService;

  /**
   * Constructor.
   *
   * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
   *   Request stack service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   An instance of the entity type manager.
   * @param \Drupal\he_publication_build\Service\BuildRequest $build_service
   *   An instance of the Build service.
   */
  public function __construct(RequestStack $request_stack, EntityTypeManagerInterface $entityTypeManager, BuildRequest $build_service) {
    $this->requestStack = $request_stack;
    $this->entityTypeManager = $entityTypeManager;
    $this->buildService = $build_service;
    $this->awsBuildEnable = Settings::get("aws_build_enable", NULL);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get("request_stack"),
      $container->get("entity_type.manager"),
      $container->get("build.request")
    );
  }

  /**
   * {@inheritdoc}
   */
  public function buildRollback() {
    if (!$this->awsBuildEnable) {
      return [
        "#type" => "markup",
        "#markup" => $this->t("Disabled"),
      ];
    }

    // Get Build id.
    $id = $this->requestStack->getCurrentRequest()->query->get("id");
    if (!filter_var($id, FILTER_VALIDATE_INT)) {
      return [
        "#type" => "markup",
        "#markup" => $this->t("Id is NaN"),
      ];
    }

    // Update Build entity.
    $build = Build::load($id);
    if (!$build) {
      return [
        "#type" => "markup",
        "#markup" => $this->t("Build with id @id not found.", ["@id" => $id]),
      ];
    }

    // Prepare and set aws build data.
    $aws_build_data = [
      "id" => $build->id(),
      "date" => $build->get("field_publication_date")->date->getTimestamp(),
      "isSchedule" => FALSE,
    ];

    // Start AWS building.
    $this->buildService->startBuild($aws_build_data);

    return [
      "#type" => "markup",
      "#markup" => $this->t("Build with id @id has been launched.", ["@id" => $build->id()]),
    ];
  }

}
