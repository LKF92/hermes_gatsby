import React from "react"
import { Box } from "@material-ui/core"
import Video from "../video/video"

export default function Bloc02({ data: { audio_video } }) {
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    fluid: true,
    poster:
      audio_video && audio_video?.thumbnail
        ? audio_video?.thumbnail[0].url
        : null,
    sources: [
      {
        src: audio_video?.url?.url,
      },
    ],
  }
  return (
    <Box component="section">
      <Video {...videoJsOptions} data={audio_video} />
    </Box>
  )
}
