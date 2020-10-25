<?php

namespace Drupal\decoupled_toolbox\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\decoupled_toolbox\Exception\FieldNotYetProcessedException;
use Drupal\decoupled_toolbox\Exception\InvalidFormatterSettingsException;

/**
 * Abstract of a decoupled formatter.
 */
abstract class DecoupledFormatterBase extends FormatterBase implements DecoupledFormatterInterface {

  const SETTINGS__DECOUPLED_FIELD_KEY = 'decoupled_field_key';

  /**
   * Indicates if this formatter has processed a field.
   *
   * @var bool
   */
  private $hasProcessedField = FALSE;

  /**
   * Formatted field value.
   *
   * @var array
   */
  private $processedFieldValue;

  /**
   * Cache tags array for the processed field.
   *
   * @var array
   */
  private $processedFieldCacheTags;

  /**
   * Adds a cache tag associated to this field formatter.
   *
   * Call this when the field formatter has processed content which needs cache
   * tag for invalidation.
   *
   * @param string $tag
   *   The cache tag to add for the processed field.
   */
  protected function addProcessedFieldCacheTag($tag) {
    $this->processedFieldCacheTags[] = $tag;
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      self::SETTINGS__DECOUPLED_FIELD_KEY => '',
    ] + parent::defaultSettings();
  }

  /**
   * Shortcut to get decoupled_field_id value.
   *
   * @return string
   *   The decoupled_field_id value.
   */
  protected function getDecoupledFieldKey() {
    return $this->settings[self::SETTINGS__DECOUPLED_FIELD_KEY];
  }

  /**
   * {@inheritdoc}
   */
  public function getProcessedFieldCacheTags() {
    if (!$this->hasProcessedField()) {
      throw new FieldNotYetProcessedException();
    }

    if (empty($this->processedFieldCacheTags)) {
      // This may happen if the child formatter has not set any cache tags.
      return [];
    }

    return $this->processedFieldCacheTags;
  }

  /**
   * Gets the settings summary array.
   *
   * @return \Drupal\Core\StringTranslation\TranslatableMarkup[]
   *   Array of markup.
   */
  protected function getSettingsSummary() {
    $settings = $this->getSettings();

    if (!empty($settings[self::SETTINGS__DECOUPLED_FIELD_KEY])) {
      return [
        $this->t('Decoupled field ID: <strong>@id</strong>', ['@id' => $settings[self::SETTINGS__DECOUPLED_FIELD_KEY]]),
      ];
    }

    return [
      $this->t('⚠️ Decoupled field ID: <em>️undefined</em>'),
    ];
  }

  /**
   * Tells if this formatter has processed a field or not.
   *
   * @return bool
   *   TRUE if field has been processed. FALSE otherwise.
   */
  protected function hasProcessedField() {
    return $this->hasProcessedField;
  }

  /**
   * Checks whether a FieldItemList instance comes from a multi-valued field.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $items
   *   The FieldItemList instance to test.
   *
   * @return bool
   *   TRUE if multi-valued, FALSE if single valued.
   */
  protected function isMultivaluedFieldItemList(FieldItemListInterface $items) {
    return $items->getFieldDefinition()->getFieldStorageDefinition()->isMultiple();
  }

  /**
   * Sets the processed field value on this formatter instance.
   *
   * @param array $value
   *   The processed field value which can be used by the decoupled renderer.
   */
  protected function setProcessedFieldValue(array $value) {
    $this->processedFieldValue = $value;
    $this->hasProcessedField = TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $formState) {
    $form[self::SETTINGS__DECOUPLED_FIELD_KEY] = [
      '#default_value' => $this->getSetting(self::SETTINGS__DECOUPLED_FIELD_KEY),
      '#description' => $this->t('This value replaces the Drupal field ID by a suitable key for the decoupled display. Usage of non-ASCII-alphanumeric, hyphen and underscore characters is strongly discouraged.'),
      '#required' => TRUE,
      '#title' => $this->t('Decoupled field key'),
      '#type' => 'textfield',
    ];
    return $form + parent::settingsForm($form, $formState);
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    return $this->getSettingsSummary() + parent::settingsSummary();
  }

  /**
   * Validates the formatter settings when building the output.
   *
   * Override this in inheriting classes if the formatter needs to validate
   * other settings.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidFormatterSettingsException
   *   The formatter settings are invalid.
   */
  protected function validateSettingsOnRender() {
    $settings = $this->getSettings();

    if (empty($settings[self::SETTINGS__DECOUPLED_FIELD_KEY])) {
      throw new InvalidFormatterSettingsException();
    }

    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    // Return an empty array because we are not using the default render stack.
    return [];
  }

  /**
   * Processes a single field item.
   *
   * @param \Drupal\Core\Field\FieldItemInterface $item
   *   One field item.
   *
   * @return string
   *   The formatted value as string.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidContentException
   *   An error occurred about the content of the field.
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidFormatterSettingsException
   *   The formatter settings are invalid.
   * @throws \Drupal\decoupled_toolbox\Exception\UnexpectedFormatterException
   *   The formatter is not compatible with the field.
   */
  abstract protected function viewFieldItem(FieldItemInterface $item);

  /**
   * Processes field with cardinality > 1.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $items
   *   Items to format.
   *
   * @return array
   *   The formatted items as an array.
   *
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidContentException
   *   An error occurred about the content of the field.
   * @throws \Drupal\decoupled_toolbox\Exception\InvalidFormatterSettingsException
   *   The formatter settings are invalid.
   * @throws \Drupal\decoupled_toolbox\Exception\UnexpectedFormatterException
   *   The formatter is not compatible with the field.
   */
  abstract protected function viewMultivaluedFieldItemList(FieldItemListInterface $items);

}
