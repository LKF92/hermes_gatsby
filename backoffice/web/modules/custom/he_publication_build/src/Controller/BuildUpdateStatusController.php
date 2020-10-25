<?php

namespace Drupal\he_publication_build\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Site\Settings;
use Drupal\he_publication_build\Entity\Build;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Controller to handle Build status update.
 */
class BuildUpdateStatusController extends ControllerBase {

  /**
   * AWS build enable.
   *
   * @var string
   */
  protected $awsBuildEnable;

  /**
   * An instance of the entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   An instance of the entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager) {
    $this->entityTypeManager = $entityTypeManager;
    $this->awsBuildEnable = Settings::get("aws_build_enable", NULL);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get("entity_type.manager")
    );
  }

  /**
   * {@inheritdoc}
   */
  public function updateStatus(Request $request) {
    if (!$this->awsBuildEnable) {
      return new JsonResponse(
        ["error" => $this->t("aws build is disabled.")]
      );
    }

    // Get Build identifier.
    $identifier = $request->query->get("id");
    if (!filter_var($identifier, FILTER_VALIDATE_INT)) {
      return new JsonResponse(
        ["error" => $this->t("build identifier is missing or incorrect.")]
      );
    }

    // Get Build status.
    $status = $request->query->get("status");
    if (!filter_var($status, FILTER_VALIDATE_INT)) {
      return new JsonResponse(
        ["error" => $this->t("build status is missing or incorrect.")]
      );
    }

    // Only one build can have Current live status 4.
    if ($status == Build::CURRENT_LIVE) {
      $query = $this->entityTypeManager->getStorage("build")
        ->getQuery();
      $bids = $query->condition("field_status", Build::CURRENT_LIVE)
        ->execute();

      if (!empty($bids)) {
        foreach ($bids as $bid) {
          /** @var \Drupal\he_publication_build\Entity\Build $build */
          $build = Build::load($bid);
          $build->set("field_status", Build::DONE);
          $build->save();
        }
      };
    }

    // Update Build entity.
    $build = Build::load($identifier);
    if (!$build) {
      return new JsonResponse(
        ["error" => $this->t("build with id @id not found.", ["@id" => $identifier])]
      );
    }

    $build->set("field_status", $status);
    $build->save();

    return new JsonResponse(
      ["info" => $this->t("build with id @id has been updated.", ["@id" => $identifier])]
    );
  }

}
