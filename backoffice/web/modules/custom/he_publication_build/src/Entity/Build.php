<?php

namespace Drupal\he_publication_build\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Defines the build entity class.
 *
 * @ContentEntityType(
 *   id = "build",
 *   label = @Translation("Build"),
 *   label_collection = @Translation("Builds"),
 *   handlers = {
 *     "storage" = "Drupal\he_publication_build\Storage\BuildStorage",
 *     "view_builder" = "Drupal\he_publication_build\BuildViewBuilder",
 *     "list_builder" = "Drupal\he_publication_build\BuildListBuilder",
 *     "views_data" = "Drupal\views\EntityViewsData",
 *     "form" = {
 *       "add" = "Drupal\he_publication_build\Form\BuildForm",
 *       "edit" = "Drupal\he_publication_build\Form\BuildForm",
 *       "delete" = "Drupal\Core\Entity\ContentEntityDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\Core\Entity\Routing\AdminHtmlRouteProvider",
 *     }
 *   },
 *   base_table = "build",
 *   admin_permission = "administer build",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "title",
 *     "uuid" = "uuid"
 *   },
 *   links = {
 *     "add-form" = "/admin/content/build/add",
 *     "canonical" = "/build/{build}",
 *     "edit-form" = "/admin/content/build/{build}/edit",
 *     "delete-form" = "/admin/content/build/{build}/delete",
 *     "collection" = "/admin/content/build"
 *   },
 *   field_ui_base_route = "entity.build.settings"
 * )
 */
class Build extends ContentEntityBase implements BuildInterface {

  use EntityChangedTrait;

  /**
   * {@inheritdoc}
   */
  public function getTitle() {
    return $this->get("title")->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setTitle($title) {
    $this->set("title", $title);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime() {
    return $this->get("created")->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCreatedTime($timestamp) {
    $this->set("created", $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields["title"] = BaseFieldDefinition::create("string")
      ->setLabel(t("Title"))
      ->setDescription(t("The title of the build entity."))
      ->setRequired(TRUE)
      ->setSetting("max_length", 255)
      ->setDisplayOptions("form", [
        "type" => "string_textfield",
        "weight" => -5,
      ])
      ->setDisplayConfigurable("form", TRUE)
      ->setDisplayOptions("view", [
        "label" => "hidden",
        "type" => "string",
        "weight" => -5,
      ])
      ->setDisplayConfigurable("view", TRUE);

    $fields["created"] = BaseFieldDefinition::create("created")
      ->setLabel(t("Authored on"))
      ->setDescription(t("The time that the build was created."))
      ->setDisplayOptions("view", [
        "label" => "above",
        "type" => "timestamp",
        "weight" => 20,
      ])
      ->setDisplayConfigurable("form", TRUE)
      ->setDisplayOptions("form", [
        "type" => "datetime_timestamp",
        "weight" => 20,
      ])
      ->setDisplayConfigurable("view", TRUE);

    $fields["changed"] = BaseFieldDefinition::create("changed")
      ->setLabel(t("Changed"))
      ->setDescription(t("The time that the build was last edited."));

    return $fields;
  }

}
