<?php

// @codingStandardsIgnoreFile

/**
 * @file
 * Specific settings file for work environment.
 */

/**
 * Jenkins refresh gatsby job.
 */
$settings["jen_refresh_gatsby"] = "https://jen.tools.hermes.com/generic-webhook-trigger/invoke?token=6VKNn172R7EIL3RN";

/**
 * Gatsby Preview Server.
 */
$settings["preview_server_uri"] = "https://hecate-ssr.ppr-aws2.hermes.com/";

/**
 * Config splits.
 */
$config['config_split.config_split.prod']['status'] = FALSE;
$config['config_split.config_split.preprod']['status'] = TRUE;
$config['config_split.config_split.dev']['status'] = FALSE;

/**
 * Environment indicator.
 */
$config['environment_indicator.indicator']['bg_color'] = '#FAD201';
$config['environment_indicator.indicator']['fg_color'] = '#FFFFBB';
$config['environment_indicator.indicator']['name'] = 'Préproduction (preprod)';

/**
 * AWS settings.
 */
$settings['aws_build_enable'] = 1;

/**
 * Settings for s3fs module.
 */
# $settings["s3fs.access_key"] = "";
# $settings["s3fs.secret_key"] = "";
# $config["s3fs.settings"]["bucket"] = "";
# $config["s3fs.settings"]["region"] = "";
