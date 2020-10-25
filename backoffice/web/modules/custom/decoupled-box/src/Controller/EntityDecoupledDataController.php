<?php

namespace Drupal\decoupled_toolbox\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Entity\Query\QueryException;
use Drupal\decoupled_toolbox\Exception\CouldNotRetrieveContentException;
use Drupal\decoupled_toolbox\Exception\UnavailableDecoupledViewDisplayException;
use Drupal\decoupled_toolbox\Service\DecoupledRendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Exception\InvalidParameterException;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;

/**
 * Controller for entity decoupled data.
 */
class EntityDecoupledDataController extends ControllerBase {

  /**
   * Decoupled renderer service.
   *
   * @var \Drupal\decoupled_toolbox\Service\DecoupledRendererInterface
   */
  private $decoupledRenderer;

  /**
   * Entity type bundle info service.
   *
   * @var \Drupal\Core\Entity\EntityTypeBundleInfoInterface
   */
  private $entityTypeBundleInfo;

  /**
   * EntityDecoupledDataController constructor.
   *
   * @param \Drupal\decoupled_toolbox\Service\DecoupledRendererInterface $decoupledRenderer
   *   The decoupled renderer service.
   * @param \Drupal\Core\Entity\EntityTypeBundleInfoInterface $entityTypeBundleInfo
   *   Entity type bundle info service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   Entity type manager service.
   */
  public function __construct(
    DecoupledRendererInterface $decoupledRenderer,
    EntityTypeBundleInfoInterface $entityTypeBundleInfo,
    EntityTypeManagerInterface $entityTypeManager) {
    $this->decoupledRenderer = $decoupledRenderer;
    $this->entityTypeBundleInfo = $entityTypeBundleInfo;
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    /* @var DecoupledRendererInterface $decoupledRenderer */
    $decoupledRenderer = $container->get('decoupled.renderer');
    /* @var \Drupal\Core\Entity\EntityTypeBundleInfoInterface $entityTypeBundleInfo */
    $entityTypeBundleInfo = $container->get('entity_type.bundle.info');
    /* @var \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager */
    $entityTypeManager = $container->get('entity_type.manager');

    return new static(
      $decoupledRenderer,
      $entityTypeBundleInfo,
      $entityTypeManager
    );
  }

  /**
   * Called by the route decoupled_toolbox.entity_decoupled_data.collection.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   Symfony request object.
   * @param string $type
   *   Entity type ID.
   * @param string $bundle
   *   Bundle of the entities to work on.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   JSON response containing entities' values, or standard Response on
   *   errors.
   */
  public function collection(Request $request, $type, $bundle) {
    switch ($request->getMethod()) {
      case Request::METHOD_GET:
        try {
          return $this->getCollection($request, $type, $bundle);
        }
        catch (InvalidParameterException $exception) {
          return new Response(NULL, Response::HTTP_BAD_REQUEST);
        }
        catch (CouldNotRetrieveContentException $exception) {
          return new Response(NULL, Response::HTTP_NOT_FOUND);
        }
        catch (UnavailableDecoupledViewDisplayException $exception) {
          return new Response(NULL, Response::HTTP_NOT_IMPLEMENTED);
        }
        catch (\Exception $exception) {
          return new Response(NULL, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Should never happen, because methods are filtered on the routing side.
    throw new MethodNotAllowedException([Request::METHOD_GET]);
  }

  /**
   * Gets a collection of entity decoupled data.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   Symfony request object.
   * @param string $type
   *   Entity type ID.
   * @param string $bundle
   *   Bundle of the entities to work on.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   JSON response containing the entity decoupled data.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\CouldNotRetrieveContentException
   *   Content not found or storage error.
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidContentException
   *   Not a valid content entity.
   * @throws \Drupal\decoupled_toolbox\Exception\UnavailableDecoupledViewDisplayException
   *   Entity type is not suitable for decoupled rendering.
   */
  private function getCollection(Request $request, $type, $bundle) {
    $offset = $request->query->get('offset');
    if ($offset === NULL) {
      throw new InvalidParameterException('offset parameter is undefined.');
    }
    if (!$this->validateQueryParameterAsZeroAndPositiveInteger($offset)) {
      throw new InvalidParameterException('Invalid offset parameter.');
    }

    $limit = $request->query->get('limit');
    if ($limit === NULL) {
      throw new InvalidParameterException('limit parameter is undefined.');
    }
    if (!$this->validateQueryParameterAsPositiveInteger($limit)) {
      throw new InvalidParameterException('Invalid limit parameter.');
    }

    // Make sure the entity type and bundle exist.
    $bundleInfo = $this->entityTypeBundleInfo->getBundleInfo($type);

    if (empty($bundleInfo[$bundle])) {
      throw new InvalidParameterException('Invalid entity type or bundle.');
    }

    // If bundle info was found, we assume the entity type exists.
    try {
      $entityStorage = $this->entityTypeManager()->getStorage($type);
    }
    catch (\Exception $exception) {
      // Something really wrong with the database occurred because valid
      // entities must have a storage. Do not process anymore.
      throw new CouldNotRetrieveContentException();
    }

    try {
      $query = $entityStorage->getQuery()
        ->condition('type', $bundle)
        ->range($offset, $limit);

      $ids = $query->execute();
    }
    catch (QueryException $exception) {
      try {
        // Try using 'bundle' instead of 'type'.
        $query = $entityStorage->getQuery()
          ->condition('bundle', $bundle)
          ->range($offset, $limit);

        $ids = $query->execute();
      }
      catch (QueryException $exception) {
        try {
          // Try using 'vid' instead of 'bundle'.
          $query = $entityStorage->getQuery()
            ->condition('vid', $bundle)
            ->range($offset, $limit);

          $ids = $query->execute();
        }
        catch (QueryException $exception) {
          // This may happen for bundleless content entity.
          // TODO: if there is a way, check if the entity has bundles before the
          // try catch block.
          // Try to load without any condition.
          $query = $entityStorage->getQuery()
            ->range($offset, $limit);

          $ids = $query->execute();
        }
      }
    }

    $rendered = [];
    foreach ($ids as $id) {
      // Use $cacheTags parameter if the response needs to be cached.
      $rendered[] = $this->decoupledRenderer->renderByEntityTypeAndId($type, $id, $cacheTags);
    }

    return new JsonResponse($rendered);
  }

  /**
   * Validates query parameters as ID such as entity IDs.
   *
   * @param mixed $parameter
   *   Parameter to test.
   *
   * @return bool
   *   TRUE if valid ID, FALSE otherwise.
   */
  private function validateQueryParameterAsPositiveInteger($parameter) {
    return filter_var($parameter, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) !== FALSE;
  }

  /**
   * Validates query parameters as ID such as entity IDs.
   *
   * @param mixed $parameter
   *   Parameter to test.
   *
   * @return bool
   *   TRUE if valid ID, FALSE otherwise.
   */
  private function validateQueryParameterAsZeroAndPositiveInteger($parameter) {
    return filter_var($parameter, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]) !== FALSE;
  }

}
