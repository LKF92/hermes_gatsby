<?php

// @codingStandardsIgnoreFile

/**
 * @file
 * Specific settings file for work environment.
 */

/**
 * Jenkins refresh gatsby job.
 */
$settings["jen_refresh_gatsby"] = "https://jen.tools.hermes.com/generic-webhook-trigger/invoke?token=Of808rLN5MwZdLA3";

/**
 * Gatsby preview server.
 */
$settings["preview_server_uri"] = "https://hecatefo.aws3.hermes.com/";

/**
 * Config splits.
 */
$config['config_split.config_split.prod']['status'] = TRUE;
$config['config_split.config_split.preprod']['status'] = FALSE;
$config['config_split.config_split.dev']['status'] = FALSE;

/**
 * Environment indicator.
 */
$config['environment_indicator.indicator']['bg_color'] = '#FAD201';
$config['environment_indicator.indicator']['fg_color'] = '#FFFFBB';
$config['environment_indicator.indicator']['name'] = 'Production (prod)';

/**
 * AWS settings.
 */
$settings['aws_build_enable'] = 1;
