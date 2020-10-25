<?php

namespace Drupal\he_media_library_extend_scene7\Plugin\MediaLibrarySource;

use Drupal;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Utility\Token;
use Drupal\media_library_extend\Plugin\MediaLibrarySource\MediaLibrarySourceBase;
use GuzzleHttp\Client;
use Symfony\Component\DependencyInjection\ContainerInterface;
use SoapClient;
use SoapHeader;
use SoapFault;

/**
 * Provides a media library pane to pull audio from DAM Adobe Scene7.
 *
 * @MediaLibrarySource(
 *   id = "scene7_audio",
 *   label = @Translation("Audio Scene7"),
 *   source_types = {
 *     "remote_audio_scene7",
 *   },
 *   default_thumbnail_filename = "audio.png"
 * )
 */
class Scene7Audio extends MediaLibrarySourceBase {

  /**
   * The http client.
   *
   * @var \GuzzleHttp\Client
   */
  protected $httpClient;

  /**
   * Company name for webservice auth.
   *
   * @var string
   */
  protected $companyName;

  /**
   * Username (email) for webservice auth.
   *
   * @var string
   */
  protected $username;

  /**
   * Password for webservice auth.
   *
   * @var string
   */
  protected $password;

  /**
   * Application version for webservice auth.
   *
   * @var string
   */
  protected $appVersion;

  /**
   * Company handle for webservice auth.
   *
   * @var string
   */
  protected $companyhandle;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
      $container->get('token'),
      $container->get('http_client')
    );
  }

  /**
   * Constructs a new LoremPicsum object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Utility\Token $token
   *   The token service.
   * @param \GuzzleHttp\Client $http_client
   *   The HTTP client.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager, Token $token, Client $http_client) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $entity_type_manager, $token);
    $this->httpClient = $http_client;
    $this->companyName = $this->configuration['appName'];
    $this->username = $this->configuration['user'];
    $this->password = $this->configuration['password'];
    $this->appVersion = $this->configuration['appVersion'];
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'urlApi' => 'http://www.scene7.com/IpsApi/xsd/2014-04-03',
      'user' => '',
      'password' => '',
      'appName' => 'hermes-digital',
      'appVersion' => '1.0',
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);

    $form['urlApi'] = [
      '#title' => $this->t('Url api'),
      '#description' => $this->t('https://docs.adobe.com/content/help/en/dynamic-media-developer-resources/image-production-api/c-wsdl-versions.html'),
      '#type' => 'url',
      '#default_value' => $this->configuration['urlApi'],
      '#required' => TRUE,
    ];

    $form['user'] = [
      '#title' => $this->t('User'),
      '#description' => $this->t('Valid IPS user email.'),
      '#type' => 'email',
      '#default_value' => $this->configuration['user'],
      '#required' => TRUE,
    ];

    $form['password'] = [
      '#title' => $this->t('Password'),
      '#description' => $this->t('Password for user account.'),
      '#type' => 'password',
      '#default_value' => $this->configuration['password'],
      '#required' => TRUE,
    ];

    $form['appName'] = [
      '#title' => $this->t("Nom de l'application"),
      '#description' => $this->t('Calling application name. This parameter is optional, but it is recommended that you include it in all requests.'),
      '#type' => 'textfield',
      '#default_value' => $this->configuration['appName'],
      '#required' => TRUE,
    ];

    $form['appVersion'] = [
      '#title' => $this->t("Version de l'application."),
      '#description' => $this->t('Calling application version.'),
      '#type' => 'textfield',
      '#default_value' => $this->configuration['appVersion'],
      '#required' => TRUE,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function getCount() {
    $assets = $this->queryResults();
    return $assets->totalRows;
  }

  /**
   * {@inheritdoc}
   */
  public function getResults() {
    $assets = $this->queryResults();

    // When only one result, it is not an array.
    $media_assets[] = $assets->assetArray->items;

    // More than one result = array.
    if (is_array($assets->assetArray->items)) {
      $media_assets = [];

      foreach ($assets->assetArray->items as $asset) {
        $media_assets[] = $asset;
      }
    }

    // Default thumbnail.
    $default_thumbnail_filename = $this->pluginDefinition['default_thumbnail_filename'];
    $default_thumbnail_uri = Drupal::config('media.settings')->get('icon_base_uri') . '/' . $default_thumbnail_filename;

    // Map Scene7 data with Drupal media data panel.
    $results = [];
    foreach ($media_assets as $media) {
      $results[] = [
        'id' => $media->assetHandle,
        'label' => $media->name,
        'preview' => [
          '#type' => 'html_tag',
          '#tag' => 'img',
          '#attributes' => [
            'src' => file_create_url($default_thumbnail_uri),
            'alt' => $media->name,
            'title' => $media->name,
          ],
        ],
      ];
    }

    return $results;
  }

  /**
   * Query the youtube for current results and cache them.
   *
   * @return array
   *   The current set of result data.
   */
  protected function queryResults() {
    $client = $this->getClient();

    $options = [
      'recordsPerPage' => $this->configuration['items_per_page'],
      // $page start at 0 on Drupal, need to add 1 for Scene7 param.
      'resultsPage' => $this->getValue('page') + 1,
    ];

    $params = [
      'companyHandle' => $this->companyhandle,
      'folder' => 'hermesdigital/hecate/audio',
      'includeSubfolders' => TRUE,
      'assetTypeArray' => [
        'items' => ['Audio'],
      ],
    ] + $options;

    return $client->searchAssets($params);
  }

  /**
   * Get Soap client connected.
   */
  protected function getClient() {
    try {
      $options = [
        'exceptions' => TRUE,
        'trace' => 1,
        'connection_timeout' => 5,
      ];

      $ns = 'http://www.scene7.com/IpsApi/xsd/2014-04-03';
      $client = new SoapClient('https://s7sps3apissl.scene7.com/scene7/webservice/IpsApi-2014-04-03.wsdl', $options);
      $auth = (object) [
        'user' => $this->username,
        'password' => $this->password,
        'appName' => $this->companyName,
        'appVersion' => $this->appVersion,
      ];

      $header = new SoapHeader($ns, 'authHeader', $auth, FALSE);
      $client->__setSoapHeaders([$header]);

      $this->companyhandle = $client->getCompanyInfo(['companyName' => $this->companyName])->companyInfo->companyHandle;

      return $client;
    }
    catch (SoapFault $ex) {
      $this->hermesScene7SoapError($ex, $client);
    }

    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getEntityId($selected_id) {
    $client = $this->getClient();

    $params = [
      'companyHandle' => $this->companyhandle,
      'assetHandleArray' => [$selected_id],
    ];

    $media_assets = $client->getAssets($params);

    if (!isset($media_assets->assetArray->items)) {
      return NULL;
    }

    $media_assets = $media_assets->assetArray->items;

    $media_url = 'https://assets.hermes.com/is/content/hermesdigital/hecate/audio/' . $media_assets->fileName;

    $entity = $this->createEntityStub($media_assets->name);

    // Attach file url to media entity.
    $source_field = $this->getSourceField();
    $entity->{$source_field} = $media_url;
    $entity->save();

    return $entity->id();
  }

  /**
   * This function save SOAP error information into watchdog.
   */
  public function hermesScene7SoapError($ex, $client) {
    $message = "<pre>\n";
    if ($client) {
      $message .= "Request :\n" . htmlspecialchars($client->__getLastRequest()) . "\n";
    }
    if (isset($ex->faultcode)) {
      $message .= var_export($ex->faultcode, TRUE) . "\n";
    }
    if (isset($ex->faultstring)) {
      $message .= var_export($ex->faultstring, TRUE) . "\n";
    }
    if (isset($ex->faultactor)) {
      $message .= var_export($ex->faultactor, TRUE) . "\n";
    }
    if (isset($ex->detail)) {
      $message .= var_export($ex->detail, TRUE) . "\n";
    }
    if (isset($ex->_name)) {
      $message .= var_export($ex->_name, TRUE) . "\n";
    }
    if (isset($ex->headerfault)) {
      $message .= var_export($ex->headerfault, TRUE) . "\n";
    }
    $message .= "</pre>";

    Drupal::logger('he_media_library_extend_scene7')->error($message);
  }

}
