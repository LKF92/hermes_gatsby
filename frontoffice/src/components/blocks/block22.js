import React from "react"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import parse from "html-react-parser"

export default function Block22({ data: { title, text } }) {
  return (
    <Box mb={{ xs: "40px", md: "60px" }} p={0}>
      <Box
        width="100%"
        display={"flex"}
        justifyContent="center"
        alignItems="center"
      >
        <Content
          maxWidth={{ xs: "335px", sm: "480px", md: "748px" }}
          display={"flex"}
          width="100%"
          justifyContent="center"
          flexDirection={"column"}
          textAlign={"center"}
        >
          <Box
            component="h2"
            fontSize={{ xs: "24px", md: "32px" }}
            lineHeight={{ xs: "28px", md: "36px" }}
          >
            {title ? parse(title) : null}
          </Box>
          <Box component="p" mt={{ xs: "14px", md: "20px" }}>
            {text ? parse(text) : null}
          </Box>
        </Content>
      </Box>
    </Box>
  )
}

const Content = styled(Box)``
