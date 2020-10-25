import React, { useContext } from "react"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import MyLink from "../myLink"
import parse from "html-react-parser"
import { Link } from "gatsby"

export default ({ data, noMarginBottom }) => {
  const { lang, wording } = useContext(GlobalContext)
  const isBloc4 = data.teaser?.length > 2
  const isBloc2 = data.teaser?.length === 2

  return (
    <Box
      component="section"
      mb={noMarginBottom ? "0" : "100px"}
      display={"flex"}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {/* BLOCK TITLE + DESCRIPTION */}
      {data?.title && data?.text && (
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
                {data.title ? parse(data.title) : null}
              </Box>
              <Box component="p" mt={{ xs: "14px", md: "20px" }}>
                {data.text ? parse(data.text) : null}
              </Box>
            </Content>
          </Box>
        </Box>
      )}
      {/* BLOCK IMAGES */}
      <Block07
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        width={{ md: isBloc2 ? "750px" : "100%" }}
        m={0}
      >
        {data.teaser?.map(({ image, link, text, title }, index) => {
          const isDocument = link?.type === "document"
          return (
            <Box
              component={"div"}
              className={"gouvernance-item"}
              width={{
                xs: isBloc4 ? "50%" : "auto",
                sm: isBloc4 ? "50%" : "auto",
                md: isBloc4 ? "33%" : "auto",
                lg: isBloc4 ? "25%" : "auto",
              }}
              maxWidth={{
                xs: isBloc4 ? "155px" : isBloc2 ? "297px" : "247px",
                sm: "297px",
                md: isBloc4 ? "258px" : "356px",
              }}
              mr={isBloc2 && index === 0 ? "18px" : "auto"}
              ml={isBloc2 && index === 1 ? "18px" : "auto"}
            >
              <Block bgcolor="var(--beige3)" p={0} mb={"60px"}>
                <InnerContent
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {image && link && (
                      <Box
                        component="figure"
                        width={"100%"}
                        m="0"
                        mb={{
                          xs: isBloc4 ? "10px" : isBloc2 ? "32px" : "20px",
                          sm: isBloc4 ? "20px" : "32px",
                          md: "20px",
                        }}
                        height={{
                          xs: isBloc4 ? "206px" : isBloc2 ? "396px" : "330px",
                          sm: isBloc4 ? "344px" : "396px",
                          md: isBloc4 ? "344px" : "475px",
                        }}
                      >
                        {link?.attributes?.external || isDocument ? (
                          <a
                            href={link?.url}
                            target={link?.attributes?.attributes?.target}
                            rel="noreferrer"
                          >
                            <Box
                              component="img"
                              src={image?.url[0]?.url}
                              alt={image?.url[0]?.alt}
                              width={"100%"}
                              display={"bloc"}
                              height={"100%"}
                            />
                          </a>
                        ) : (
                          <Link
                            to={`${
                              lang === "en" && !link?.url?.includes("/en/")
                                ? "/en"
                                : ""
                            }${link?.url.toLowerCase()}/`}
                          >
                            <Box
                              component="img"
                              src={image?.url[0]?.url}
                              alt={image?.url[0]?.alt}
                              width={"100%"}
                              display={"bloc"}
                              height={"100%"}
                            />
                          </Link>
                        )}
                      </Box>
                    )}

                    <Box
                      component="h3"
                      margin="0"
                      textAlign="center"
                      fontSize={{ xs: "16px", sm: "22px", md: "22px" }}
                      lineHeight={{ xs: "22px", sm: "28px", md: "28px" }}
                      mb="12px"
                    >
                      {title ? parse(title) : null}
                    </Box>
                    <Box
                      component="p"
                      mb="12px"
                      textAlign="center"
                      fontSize={{ xs: "12px", sm: "14px", md: "14px" }}
                      lineHeight={{ xs: "16px", sm: "20px", md: "20px" }}
                    >
                      {text ? parse(text) : null}
                    </Box>
                  </Box>
                  {link?.url && (
                    <MyLink
                      classStyle="underlinedLink nohover"
                      url={link?.url}
                      text={link?.title || wording(lang, "findMore")}
                      external={link?.attributes?.external}
                      isDocument={isDocument}
                      target={link?.attributes?.attributes?.target}
                    />
                  )}
                </InnerContent>
              </Block>
            </Box>
          )
        })}
      </Block07>
    </Box>
  )
}

const Block07 = styled(Box)`
  justify-content: center;
  img {
    object-fit: cover;
  }
`
const Block = styled(Box)``
const InnerContent = styled(Box)``
const Content = styled(Box)``
