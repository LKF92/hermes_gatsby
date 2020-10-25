<?php

namespace Drupal\he_media_library_extend_scene7\Plugin\media\Source;

use Drupal\media\MediaSourceBase;

/**
 * Media source wrapping around a remote audio url.
 *
 * @MediaSource(
 *   id = "remote_audio_scene7",
 *   label = @Translation("Remote audio Scene7"),
 *   description = @Translation("Use remote audio for reusable media."),
 *   allowed_field_types = {"link"},
 *   default_thumbnail_filename = "audio.png"
 * )
 */
class RemoteAudioScene7 extends MediaSourceBase {

  /**
   * {@inheritdoc}
   */
  public function getMetadataAttributes() {
    return [];
  }

}
