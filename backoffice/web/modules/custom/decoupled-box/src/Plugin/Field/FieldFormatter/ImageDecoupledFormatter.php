<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\EntityReferenceItem;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Url;
use Drupal\decoupled_toolbox\Exception\InvalidContentException;
use Drupal\decoupled_toolbox\Exception\InvalidFormatterSettingsException;
use Drupal\decoupled_toolbox\Exception\UnexpectedFormatterException;
use Drupal\decoupled_toolbox\Service\DecoupledRendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation of the 'decoupled_entity_reference' formatter.
 *
 * Inspired by ImageFormatter.
 *
 * @FieldFormatter(
 *   id = "decoupled_image",
 *   label = @Translation("Image decoupled formatter"),
 *   field_types = {
 *     "image",
 *   }
 * )
 */
class ImageDecoupledFormatter extends FileDecoupledFormatter {

  const SETTINGS__IMAGE_STYLE = 'image_style';

  /**
   * The current user.
   *
   * Used for administration permissions.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The image style entity storage.
   *
   * @var \Drupal\Core\Config\Entity\ConfigEntityStorageInterface
   */
  protected $imageStyleStorage;

  /**
   * Constructs an ImageFormatter object.
   *
   * @param string $plugin_id
   *   The plugin_id for the formatter.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Field\FieldDefinitionInterface $field_definition
   *   The definition of the field to which the formatter is associated.
   * @param array $settings
   *   The formatter settings.
   * @param string $label
   *   The formatter label display setting.
   * @param string $view_mode
   *   The view mode.
   * @param array $third_party_settings
   *   Any third party settings settings.
   * @param \Drupal\decoupled_toolbox\Service\DecoupledRendererInterface $decoupledRenderer
   *   Decoupled renderer service.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\Core\Entity\EntityStorageInterface $image_style_storage
   *   The image style storage.
   */
  public function __construct(
    $plugin_id,
    $plugin_definition,
    FieldDefinitionInterface $field_definition,
    array $settings,
    $label,
    $view_mode,
    array $third_party_settings,
    DecoupledRendererInterface $decoupledRenderer,
    AccountInterface $current_user,
    EntityStorageInterface $image_style_storage) {
    parent::__construct(
      $plugin_id,
      $plugin_definition,
      $field_definition,
      $settings,
      $label,
      $view_mode,
      $third_party_settings,
      $decoupledRenderer);
    $this->currentUser = $current_user;
    $this->imageStyleStorage = $image_style_storage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    /* @var \Drupal\decoupled_toolbox\Service\DecoupledRendererInterface $decoupledRenderer */
    $decoupledRenderer = $container->get('decoupled.renderer');

    /* @var \Drupal\Core\Session\AccountInterface $currentUser */
    $currentUser = $container->get('current_user');

    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['label'],
      $configuration['view_mode'],
      $configuration['third_party_settings'],
      $decoupledRenderer,
      $currentUser,
      $container->get('entity_type.manager')->getStorage('image_style')
    );
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return parent::defaultSettings() + [
      static::SETTINGS__IMAGE_STYLE => '',
    ];
  }

  /**
   * Gets the available image styles, for options select.
   *
   * @return array
   *   Array of image styles.
   */
  private function getImageStyleList() {
    return image_style_options(FALSE);
  }

  /**
   * Gets the settings summary array.
   *
   * @return \Drupal\Core\StringTranslation\TranslatableMarkup[]
   *   Array of markup.
   */
  protected function getSettingsSummary() {
    // Get the current list of enabled image styles.
    $imageStyles = $this->getImageStyleList();

    // Unset possible 'No defined styles' option.
    unset($imageStyles['']);

    // Styles could be lost because of enabled/disabled modules that defines
    // their styles in code.
    $imageStyleSetting = $this->getSetting(static::SETTINGS__IMAGE_STYLE);

    if (!empty($imageStyles[$imageStyleSetting])) {
      return array_merge(
        parent::getSettingsSummary(),
        [
          $this->t('Image style: <strong>@style</strong>', ['@style' => $imageStyles[$imageStyleSetting]]),
        ]
      );
    }

    return array_merge(
      parent::getSettingsSummary(),
      [
        $this->t('Image style: <strong>Original image</strong>'),
      ]
    );
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $formState) {
    $description_link = Link::fromTextAndUrl(
      $this->t('Configure Image Styles'),
      Url::fromRoute('entity.image_style.collection')
    );

    $form['image_style'] = [
      '#default_value' => $this->getSetting('image_style'),
      '#description' => $description_link->toRenderable() + [
        '#access' => $this->currentUser->hasPermission('administer image styles'),
      ],
      '#empty_option' => $this->t('None (original image)'),
      '#options' => $this->getImageStyleList(),
      '#title' => $this->t('Image style'),
      '#type' => 'select',
      '#weight' => -10,
    ];

    return parent::settingsForm($form, $formState) + $form;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    return parent::settingsSummary() + $this->getSettingsSummary();
  }

  /**
   * {@inheritdoc}
   */
  protected function viewFieldItem(FieldItemInterface $item) {
    if (!$item instanceof EntityReferenceItem) {
      throw new UnexpectedFormatterException('Tried to render an entity field item, but the given object does not implement EntityReferenceItem.');
    }

    // $fieldValue is supposed to be an array containing at least the target_id
    // key and other values related to an image (width, height, alt, title).
    $fieldValue = $item->getValue();

    if (empty($fieldValue)) {
      // This should never be possible.
      throw new InvalidContentException('Field value is empty.');
    }

    /* @var \Drupal\file\FileInterface $file */
    $file = $item->entity;

    if (empty($file)) {
      // This happens when the reference was deleted.
      throw new InvalidContentException('Reference was deleted.');
    }

    $imageStyleSettings = $this->getSetting('image_style');

    if (!empty($imageStyleSettings)) {
      /* @var \Drupal\image\ImageStyleInterface $imageStyle */
      $imageStyle = $this->imageStyleStorage->load($imageStyleSettings);

      if (empty($imageStyle)) {
        throw new InvalidFormatterSettingsException($this->t('Could not find the image style: @style.', ['@style' => $imageStyleSettings]));
      }

      // Get the URL of the formatted image.
      $url = $imageStyle->buildUrl($file->getFileUri());

      foreach ($file->getCacheTags() as $tag) {
        $this->addProcessedFieldCacheTag($tag);
      }

      return [
        [
          'image_style' => $imageStyleSettings,
          'url' => $url,
        ],
      ];
    }

    // Use original image.
    // URLs must be absolute because of decoupled.
    $url = $file->createFileUrl(FALSE);

    foreach ($file->getCacheTags() as $tag) {
      $this->addProcessedFieldCacheTag($tag);
    }

    return [
      [
        'image_style' => NULL,
        'url' => $url,
        'alt' => $item->alt,
      ],
    ];
  }

}
