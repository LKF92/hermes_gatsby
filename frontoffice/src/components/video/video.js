import React from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"
import styled from "styled-components"
import { Box } from "@material-ui/core"

export default class VideoPlayer extends React.Component {
  state = {
    video: false,
  }

  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(
      this.videoNode,
      this.props,
      function onPlayerReady() {}
    )
    this.player.addClass("vjs-hermes")
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {
    return (
      <BlockVideo>
        <Box
          component={"div"}
          data-vjs-player
          onClick={() => {
            if (typeof window !== "undefined" && !this.state.video) {
              window.dataLayer.push({
                event: "interaction",
                e_category: "video",
                e_action: "lecture",
                e_label: this.props.data?.name,
              })
              this.setState({ video: true })
            }
          }}
        >
          <Box
            component={"video"}
            aria-label="video player"
            ref={node => (this.videoNode = node)}
            className="video-js vjs-default-skin vjs-big-play-centered"
          ></Box>
        </Box>
      </BlockVideo>
    )
  }
}

const BlockVideo = styled(Box)`
  .vjs-big-play-button {
    color: white;
    border: none;
    background: transparent;
  }
  .vjs-hermes {
    width: 100%;
  }
`
