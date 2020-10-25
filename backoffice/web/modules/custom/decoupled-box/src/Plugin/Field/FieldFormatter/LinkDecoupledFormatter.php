<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;

/**
 * Plugin implementation of the "decoupled_link" formatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_link",
 *   label = @Translation("Link decoupled formatter"),
 *   field_types = {
 *     "link",
 *   }
 * )
 */
class LinkDecoupledFormatter extends GenericDecoupledFormatter {

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    /* @var \Drupal\link\LinkItemInterface $item */
    $language = \Drupal::languageManager()->getLanguage($item->getLangcode());
    $item->set("options",
      array_merge($item->get("options")->getValue(), [
        "language" => $language,
      ])
    );

    /* @var \Drupal\Core\Url $url */
    // Object that holds information about a URL.
    $url = $item->getUrl();

    // getOptions() may return an empty array.
    $options = $url->getOptions();

    return [
      "url" => $url->toString(),
      "title" => $item->get("title")->getValue(),
      // Certain attributes like class can be arrays.
      // Check for that and implode them.
      "attributes" => empty($options) ? NULL : $options,
    ];
  }

}
