<?php

// @codingStandardsIgnoreFile

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * @file
 * Specific settings file for work environment.
 */

/**
 * Assertions.
 *
 * The Drupal project primarily uses runtime assertions to enforce the
 * expectations of the API by failing when incorrect calls are made by code
 * under development.
 *
 * @see http://php.net/assert
 * @see https://www.drupal.org/node/2492225
 *
 * If you are using PHP 7.0 it is strongly recommended that you set
 * zend.assertions=1 in the PHP.ini file (It cannot be changed from .htaccess
 * or runtime) on development machines and to 0 in production.
 *
 * @see https://wiki.php.net/rfc/expectations
 */
//assert_options(ASSERT_ACTIVE, TRUE);
//\Drupal\Component\Assertion\Handle::register();

/**
 * Enable local development services.
 */
//$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

/**
 * Show all error messages, with backtrace information.
 *
 * In case the error level could not be fetched from the database, as for
 * example the database connection failed, we rely only on this value.
 */
//$config['system.logging']['error_level'] = 'verbose';

/**
 * Config splits.
 */
$config['config_split.config_split.prod']['status'] = FALSE;
$config['config_split.config_split.preprod']['status'] = FALSE;
$config['config_split.config_split.dev']['status'] = TRUE;

/**
 * Environment indicator.
 */
$config['environment_indicator.indicator']['bg_color'] = '#0A4B51';
$config['environment_indicator.indicator']['fg_color'] = '#FFFFBB';
$config['environment_indicator.indicator']['name'] = 'Dev';

/**
 * AWS settings.
 */
$settings['aws_build_enable'] = 0;
