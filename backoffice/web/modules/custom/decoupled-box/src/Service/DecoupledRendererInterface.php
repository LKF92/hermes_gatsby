<?php

namespace Drupal\decoupled_toolbox\Service;

/**
 * Renders for decoupled.
 */
interface DecoupledRendererInterface {

  /**
   * Renders an entity given the type and ID.
   *
   * @param string $entityTypeId
   *   Entity type ID.
   * @param int $id
   *   Entity ID.
   * @param array $cacheTags
   *   Cache tags associated to the rendered entity and its descendants from
   *   fields.
   *
   * @return array
   *   The rendered content as array, ready for serialization.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\CouldNotRetrieveContentException
   *   When the content entity could not be retrieved, or the entity storage was
   *   unresponsive.
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidContentException
   *   Entity is not from an authorized content entity.
   * @throws \Drupal\decoupled_toolbox\Exception\UnavailableDecoupledViewDisplayException
   *   The decoupled view display is not available on the given entity.
   */
  public function renderByEntityTypeAndId($entityTypeId, $id, array &$cacheTags);

}
