import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import ExternalLink from "../../images/svg/arrow.svg"
import parse from "html-react-parser"

export default function ({ data }) {
  return (
    <Block16
      component="section"
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      mb={{ xs: "30px", md: "64px" }}
    >
      {data?.link_rse?.map(({ link, image }, index) => {
        if (link?.attributes?.external) {
          return (
            <Box
              component="a"
              height="fit-content"
              target={link?.attributes?.attributes?.target}
              href={link?.url}
              rel="noreferrer"
              className="gouvernance-item"
              width={{
                xs: "297px",
                sm: "297px",
                md: "356px",
              }}
              maxWidth={{
                xs: "297px",
                sm: "297px",
                md: "356px",
              }}
              mb={{
                xs: "30px",
                md: "36px",
              }}
              mr={{
                xs: 0,
                sm: "18px",
                md: "18px",
              }}
              bgcolor="var(--floralWhite)"
              display="flex"
              flexDirection="column"
              alignItems="stretch"
              aria-label={link?.title || "undefined"}
            >
              {image && (
                <Box
                  component="figure"
                  display="flex"
                  m="0"
                  height={{ xs: "168px", sm: "168px", md: "200px" }}
                >
                  <Box
                    component="img"
                    src={image?.url[0].url}
                    alt={image?.url[0]?.alt}
                    width={"100%"}
                    display={"bloc"}
                    height={"auto"}
                  />
                </Box>
              )}
              <Box
                width={"100%"}
                p={{ xs: "22px 24px", sm: "22px 24px", md: "20px 30px" }}
                display="flex"
                height="90px"
                boxSizing="border-box"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box
                  component="h3"
                  margin="0"
                  fontSize={{ xs: "16px", sm: "16px", md: "18px" }}
                  lineHeight={{ xs: "22px", sm: "22px", md: "24px" }}
                  textAlign={"left"}
                  letterSpacing={0}
                  maxWidth={{
                    xs: "203px",
                    sm: "203px",
                    md: "250px",
                  }}
                >
                  {link ? parse(link.title) : ""}
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={"24px"}
                  width={"24px"}
                  border="1px solid var(--beige)"
                  borderRadius="100%"
                >
                  <Box
                    component={"span"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ExternalLink />
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        } else {
          return (
            <Link
              to={`${link?.url}/`}
              target={link?.attributes?.attributes?.target}
            >
              <Box
                className={"gouvernance-item"}
                height="fit-content"
                width={{
                  xs: "297px",
                  sm: "297px",
                  md: "356px",
                }}
                maxWidth={{
                  xs: "297px",
                  sm: "297px",
                  md: "356px",
                }}
                mb={{
                  xs: "30px",
                  md: "36px",
                }}
                mr={{
                  xs: 0,
                  sm: "18px",
                  md: "18px",
                }}
                bgcolor="var(--floralWhite)"
                display="flex"
                flexDirection="column"
                alignItems="stretch"
                aria-label={link?.title || "undefined"}
              >
                {image && (
                  <Box
                    component="figure"
                    display="flex"
                    m="0"
                    height={{ xs: "168px", sm: "168px", md: "200px" }}
                  >
                    <Box
                      component="img"
                      src={image?.url[0].url}
                      alt={image?.url[0]?.alt}
                      width="100%"
                      display="bloc"
                      height="auto"
                    />
                  </Box>
                )}
                <Box
                  width={"100%"}
                  p={{ xs: "22px 24px", sm: "22px 24px", md: "20px 30px" }}
                  display="flex"
                  height="90px"
                  boxSizing="border-box"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    component="h3"
                    margin="0"
                    fontSize={{ xs: "16px", sm: "16px", md: "18px" }}
                    lineHeight={{ xs: "22px", sm: "22px", md: "24px" }}
                    textAlign={"left"}
                    letterSpacing={0}
                    maxWidth={{
                      xs: "203px",
                      sm: "203px",
                      md: "250px",
                    }}
                  >
                    {link ? parse(link.title) : ""}
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="24px"
                    width="24px"
                    border="1px solid var(--beige)"
                    borderRadius="100%"
                  >
                    <Box
                      component="span"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ExternalLink />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Link>
          )
        }
      })}
    </Block16>
  )
}

const Block16 = styled(Box)`
  img {
    object-fit: cover;
    object-position: center;
  }
`
