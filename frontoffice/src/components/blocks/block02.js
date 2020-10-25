import React from "react"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import MyLink from "../myLink"
import parse from "html-react-parser"

export default function ({ data }) {
  // alignment refers to the position of the image
  const { title, text, image, link, alignment, caption } = data

  return (
    <Bloc02 component="section" className="wysiwyg">
      <Box
        m="auto"
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        flexWrap={{ sm: "wrap" }}
        justifyContent={{ sm: "space-between" }}
      >
        {/* TITLE MOBILE/TABLET */}
        {title && (
          <Box
            display={{ md: "none" }}
            component="h2"
            textAlign="center"
            flex={{ xs: "1 1 100%", sm: "1 1 100%" }}
            m={{ xs: "0 0 30px", sm: "0 0 40px" }}
          >
            {title ? parse(title) : ""}
          </Box>
        )}

        <FlexBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent={{ sm: "space-between" }}
          width="100%"
        >
          <Figure
            order={{ xs: 0, sm: alignment === "left" ? 0 : 1 }}
            width={{ xs: "100%", sm: "50%" }}
            component="figure"
            m={{ xs: "0 0 20px 0", sm: "0" }}
          >
            <img src={image?.url[0]?.url} alt={image?.url[0]?.alt} />
            {caption && (
              <Box component="figcaption" className="caption">
                {caption ? parse(caption) : null}
              </Box>
            )}
          </Figure>
          <Box
            width={{ sm: "50%" }}
            boxSizing="border-box"
            pr={alignment === "right" ? { sm: "40px", md: "80px" } : {}}
            pl={alignment === "left" ? { sm: "40px", md: "80px" } : {}}
            textAlign={alignment === "right" ? "left" : "right"}
          >
            {title && (
              <Box
                display={{ xs: "none", md: "block" }}
                component="h2"
                mb="30px"
              >
                {title ? parse(title) : ""}
              </Box>
            )}
            <Box
              component="p"
              overflow="hidden"
              maxWidth="100%"
              textAlign={{ xs: "left", md: "inherit" }}
            >
              <div
                css={`
                  display: inline-block;
                  li {
                    list-style-position: inside;
                  }
                `}
              >
                {text ? parse(text) : null}
              </div>

              {link && (
                <MyLink
                  classStyle="underlinedLink nohover"
                  url={link?.url}
                  text={link?.title}
                  external={link?.attributes?.external}
                  target={link?.attributes?.attributes?.target}
                />
              )}
            </Box>
          </Box>
        </FlexBox>
      </Box>
    </Bloc02>
  )
}
const Figure = styled(Box)`
  img {
    object-fit: cover;
    width: 100%;
  }
`
const FlexBox = styled(Box)``
const Bloc02 = styled(Box)``
