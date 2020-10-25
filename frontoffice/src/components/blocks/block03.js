import React from "react"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import parse from "html-react-parser"

export default ({ data, noMarginBottom }) => {
  const { alignment, image, text, caption } = data

  const getlayout = (alignment, image, text) => {
    if (image && !text) return "image"
    if (text && !image) return "text"
    if (text && image && alignment === "left") return "image + text"
    if (text && image && alignment === "right") return "text + image"
    if (text && image && alignment === "center") return "text + image center"
  }
  const elementsToDisplay = getlayout(
    alignment !== null ? alignment : "",
    image,
    text
  )

  if (elementsToDisplay && elementsToDisplay === "image") {
    return (
      <Box
        component="section"
        mb={noMarginBottom ? "0" : "100px"}
        className="wysiwyg"
      >
        <Box
          width="100%"
          display="flex"
          boxSizing="border-box"
          p={{ md: noMarginBottom ? "70px 98px 0px" : "70px 98px 100px" }}
          bgcolor={{ md: "var(--floralWhite)" }}
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="center"
          flexWrap={{ sm: "wrap", md: "nowrap" }}
        >
          <Figure
            elementsToDisplay={elementsToDisplay}
            component="figure"
            flex={1}
            mt={{
              xs: "0",
              sm: "6px",
              md: "12px",
            }}
          >
            <img src={image?.url[0]?.url} alt={image?.url[0]?.alt} />
            {caption && (
              <Box component="figcaption" className="caption">
                {caption ? parse(caption) : ""}
              </Box>
            )}
          </Figure>
        </Box>
      </Box>
    )
  } else if (elementsToDisplay && elementsToDisplay === "text") {
    return (
      <Box
        component="section"
        mb={noMarginBottom ? "0" : "100px"}
        className="wysiwyg"
      >
        <Box
          width="100%"
          display="flex"
          boxSizing="border-box"
          p={{ md: noMarginBottom ? "70px 98px 0px" : "70px 98px 100px" }}
          bgcolor={{ md: "var(--floralWhite)" }}
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="center"
          flexWrap={{ sm: "wrap", md: "nowrap" }}
        >
          <Content width="100%">{text ? parse(text) : null}</Content>
        </Box>
      </Box>
    )
  } else if (elementsToDisplay && elementsToDisplay === "text + image") {
    return (
      <Box
        component="section"
        mb={noMarginBottom ? "0" : "100px"}
        className="wysiwyg"
      >
        <Box
          width="100%"
          display="flex"
          boxSizing="border-box"
          p={{ md: noMarginBottom ? "70px 98px 0px" : "70px 98px 100px" }}
          bgcolor={{ md: "var(--floralWhite)" }}
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="center"
          flexWrap={{ sm: "wrap", md: "nowrap" }}
        >
          <Content
            mr={{
              sm: "18px",
              md: "28px",
            }}
            flex={1}
          >
            <Box component="p" textAlign="left">
              {text ? <div dangerouslySetInnerHTML={{ __html: text }} /> : null}
            </Box>
          </Content>
          <Figure
            component="figure"
            marginBottom={{ sm: "30px", md: "0" }}
            ml={{
              md: "28px",
            }}
            width={{ xs: "100%", sm: "100%", md: "33.333%" }}
          >
            <img src={image?.url[0]?.url} alt={image?.url[0]?.alt} />
            {caption && (
              <Box component="figcaption" className="caption">
                {caption ? parse(caption) : ""}
              </Box>
            )}
          </Figure>
        </Box>
      </Box>
    )
  } else if (elementsToDisplay && elementsToDisplay === "image + text") {
    return (
      <Box
        component="section"
        mb={noMarginBottom ? "0" : "100px"}
        className="wysiwyg"
      >
        <Box
          width="100%"
          display="flex"
          boxSizing="border-box"
          p={{ md: noMarginBottom ? "70px 98px 0px" : "70px 98px 100px" }}
          bgcolor={{ md: "var(--floralWhite)" }}
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="center"
          flexWrap={{ sm: "wrap", md: "nowrap" }}
        >
          <Figure
            component="figure"
            mr={{
              md: "28px",
            }}
            width={{ xs: "100%", sm: "100%", md: "33.333%" }}
          >
            <img src={image?.url[0]?.url} alt={image?.url[0]?.alt} />
            {caption && (
              <Box component="figcaption" className="caption">
                {caption ? parse(caption) : ""}
              </Box>
            )}
          </Figure>
          <Content
            flex={1}
            ml={{
              sm: "18px",
              md: "28px",
            }}
          >
            <Box component="p" textAlign="left">
              {text ? <div dangerouslySetInnerHTML={{ __html: text }} /> : null}
            </Box>
          </Content>
        </Box>
      </Box>
    )
  } else if (elementsToDisplay && elementsToDisplay === "text + image center") {
    return (
      <Box
        component="section"
        mb={noMarginBottom ? "0" : "100px"}
        className="wysiwyg"
      >
        <Box
          width="100%"
          boxSizing="border-box"
          p={{ md: noMarginBottom ? "70px 98px 0px" : "70px 98px 100px" }}
          bgcolor={{ md: "var(--floralWhite)" }}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Content>
            <Box component="p" textAlign="left">
              {text ? <div dangerouslySetInnerHTML={{ __html: text }} /> : null}
            </Box>
          </Content>
          <Figure
            elementsToDisplay={elementsToDisplay}
            component="figure"
            width="100%"
            height={{ xs: "190px", sm: "355px", md: "530px" }}
            flex={1}
            mt={{
              xs: "40px",
              sm: "30px",
              md: "60px",
            }}
          >
            <img src={image?.url[0]?.url} alt={image?.url[0]?.alt} />
            {caption && (
              <Box component="figcaption" className="caption">
                {caption ? parse(caption) : ""}
              </Box>
            )}
          </Figure>
        </Box>
      </Box>
    )
  } else {
    return null
  }
}

const Figure = styled(Box)`
  img {
    object-fit: contain;
    object-position: top;
    width: 100%;
  }
`
const Content = styled(Box)`
  a {
    text-decoration: underline;
  }
  p h3 {
    margin-top: 0;
  }
`
