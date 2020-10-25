<?php

namespace Drupal\decoupled_toolbox_redirect\Plugin\Field;

use Drupal\Core\Field\FieldItemList;
use Drupal\Core\TypedData\ComputedItemListTrait;

/**
 * Class RedirectSourcePathFieldItemList.
 *
 * @package Drupal\decoupled_toolbox_redirect\Plugin\Field
 */
class RedirectSourcePathFieldItemList extends FieldItemList {

  use ComputedItemListTrait;

  /**
   * {@inheritdoc}
   */
  protected function computeValue() {
    /* @var \Drupal\node\NodeInterface $node */
    $node = $this->getEntity();

    $destinationUri = [
      sprintf('internal:/node/%d', $node->id()),
      sprintf('entity:node/%d', $node->id()),
    ];

    // Finds redirects based on the destination URI and language.
    $storage = \Drupal::entityTypeManager()->getStorage('redirect');
    $ids = $storage->getQuery()
      ->condition('redirect_redirect.uri', $destinationUri, 'IN')
      ->condition('language', $this->getLangcode())
      ->execute();
    $redirects = $storage->loadMultiple($ids);

    $delta = 0;
    /* @var \Drupal\redirect\Entity\Redirect[] $redirects */
    foreach ($redirects as $redirect) {
      $this->list[$delta] = $this->createItem($delta, $redirect->getSourcePathWithQuery());
      $delta++;
    }
  }

}
