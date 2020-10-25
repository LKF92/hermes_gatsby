<?php

namespace Drupal\decoupled_toolbox\Service;

/**
 * Interface EntityViewDisplayManagerInterface.
 */
interface EntityViewDisplayManagerInterface {

  const ENTITY_DECOUPLED_VIEW_MODE_ID = 'decoupled';
  const ENTITY_DECOUPLED_VIEW_MODE_NAME = 'Decoupled';

  /**
   * Call this whenever an entity bundle is created.
   *
   * @param string $entityTypeId
   *   Entity type id.
   * @param string $bundleId
   *   Bundle name.
   */
  public function onBundleCreate($entityTypeId, $bundleId);

  /**
   * Creates entities' decoupled view displays for authorised entities.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\DecoupledSetupFailureException
   *   When a view mode or display preparation failed, such as creation.
   */
  public function prepareDecoupledDisplayForAllEntityTypes();

}
