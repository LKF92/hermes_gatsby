<?php

namespace Drupal\he_media_library_extend_scene7\Plugin\media\Source;

use Drupal\media\MediaSourceBase;

/**
 * Media source wrapping around a remote video url.
 *
 * @MediaSource(
 *   id = "remote_video_scene7",
 *   label = @Translation("Remote video Scene7"),
 *   description = @Translation("Use remote video for reusable media."),
 *   allowed_field_types = {"link"},
 *   default_thumbnail_filename = "video.png"
 * )
 */
class RemoteVideoScene7 extends MediaSourceBase {

  /**
   * {@inheritdoc}
   */
  public function getMetadataAttributes() {
    return [];
  }

}
