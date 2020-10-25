<?php

namespace Drupal\he_amazon_simple_storage_helper\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Database\Connection;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\datetime\Plugin\Field\FieldType\DateTimeItemInterface;
use Drupal\file\FileInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class DocumentFileAccessController.
 *
 * @package Drupal\he_amazon_simple_storage_helper\Controller
 */
class DocumentFileAccessController extends ControllerBase {

  /**
   * The uri scheme.
   */
  const URI_SCHEME = "public";

  /**
   * Denotes that the file is published.
   */
  const FILE_PUBLISHED = 1;

  /**
   * Denotes that it's not allowed to access file.
   */
  const ACCESS_NOT_ALLOWED = 0;

  /**
   * Denotes that it's allowed to access file.
   */
  const ACCESS_ALLOWED = 1;

  /**
   * The file storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $fileStorage;

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $database;

  /**
   * DocumentFileAccessController constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager service.
   * @param \Drupal\Core\Database\Connection $database
   *   The database service.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager, Connection $database) {
    $this->database = $database;
    $this->fileStorage = $entityTypeManager->getStorage("file");
    $this->nodeStorage = $entityTypeManager->getStorage("node");
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get("entity_type.manager"),
      $container->get("database")
    );
  }

  /**
   * Checks access to the PDF File.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The response.
   */
  public function access(Request $request) {
    if (empty($request->request->get("uri"))) {
      return new JsonResponse(
        ["error" => $this->t("uri parameter is missing or empty.")]);
    }

    // Retrieves uri from request.
    $uri = sprintf("%s://%s", self::URI_SCHEME, $request->request->get("uri"));

    /* @var \Drupal\file\FileInterface[] $entities */
    $entities = $this->fileStorage->loadByProperties(
      ["uri" => $uri, "status" => self::FILE_PUBLISHED]
    );

    if (empty($file = reset($entities))
      || !$file instanceof FileInterface) {
      return new JsonResponse([
        "error" => $this->t("uri does not exist."),
      ]);
    }

    // Create an object of type Select.
    $query = $this->database->select("file_usage", "f");
    $query->join("node__field_file_download", "n", "f.id = n.field_file_download_target_id");
    $query->fields("n", ["entity_id"]);

    // Add extra detail to this query object: a condition, fields and a range.
    /* @var \Drupal\file\FileInterface $file */
    $query->condition("f.fid", $file->id());
    $query->condition("f.module", "file");
    $query->condition("f.type", "node");

    /* @var \Drupal\node\NodeInterface $node */
    $node = $this->nodeStorage->load($query->execute()->fetchField());
    if (empty($node) || !$node instanceof NodeInterface
      || $node->getType() !== "document") {
      return new JsonResponse(
        ["error" => $this->t("uri is not attached to any document.")]);
    }

    // Current datetime.
    $currentDateTime = new DrupalDateTime();
    $currentDateTime->setTimezone(new \DateTimeZone(DateTimeItemInterface::STORAGE_TIMEZONE));

    // Document publication datetime.
    $published_at = $node->get("field_datetime_publication")->value;

    $access = $node->isPublished() && ((empty($published_at)
      || $published_at <= $currentDateTime->format(DateTimeItemInterface::DATETIME_STORAGE_FORMAT)))
      ? self::ACCESS_ALLOWED : self::ACCESS_NOT_ALLOWED;

    return new JsonResponse([
      $file->id() => [
        "fid" => $file->id(),
        "access" => $access,
      ],
    ]);
  }

}
