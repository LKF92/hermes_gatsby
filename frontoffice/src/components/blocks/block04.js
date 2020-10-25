import React, { useContext } from "react"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import ButtonCTA from "../buttonCTA"
import MyLink from "../myLink"
import parse from "html-react-parser"
import { useDocuments } from "../../data/documents"
import moment from "moment-timezone"
import "moment/locale/fr"

export default ({ data }) => {
  const { lang } = useContext(GlobalContext)
  const { background, wallpaper, text, title, date, document_id, link } = data

  const allDocuments = useDocuments()
  const newDate = moment
    .utc(date)
    .tz("Europe/Paris")
    .locale(lang === "fr" ? "fr" : "en")
    .format(lang === "fr" ? "DD MMMM YYYY" : "MMMM DD, YYYY")

  let documentB04
  for (const document of allDocuments) {
    if (document.id === document_id) {
      documentB04 = document[lang]
    }
  }

  return (
    <Block04
      component="section"
      mr={{ xs: "-16px", sm: "-69px", md: "-113px" }}
      ml={{ xs: "-16px", sm: "-69px", md: "-113px" }}
      p={{ xs: "40px 20px", sm: "60px 69px", md: "40px 113px" }}
      position="relative"
    >
      {background?.url[0]?.url && (
        <img
          src={background ? background?.url[0]?.url : null}
          alt={background?.url[0]?.alt}
          css={`
            bottom: 0;
            display: block;
            height: 425px;
            left: 0;
            object-fit: cover;
            position: absolute;
            width: 100%;
            @media (max-width: 959px) {
              height: 170px;
            }
            @media (max-width: 559px) {
              height: 70px;
            }
          `}
        />
      )}
      <Box
        height={{ xs: "auto", sm: "auto", md: "770px" }}
        bgcolor="rgba(255,255,255, 0)"
        position="relative"
        display={{ xs: "flex" }}
        flexDirection={"column"}
      >
        <Image
          height={{ xs: "140px", sm: "262px", md: "475px" }}
          width="100%"
          position={{ xs: "relative", sm: "relative", md: "absolute" }}
          order={2}
          bottom={{ xs: 0, sm: 0, md: "initial" }}
          top={{ xs: "initial", sm: "initial", md: 0 }}
          mt={{
            xs: "30px",
            sm: "60px",
            md: "0",
          }}
        >
          <img src={wallpaper?.url[0]?.url} alt={wallpaper?.url[0]?.alt} />
        </Image>
        <Content
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          bottom={{ xs: "initial", sm: "initial", md: 0 }}
          top={{ xs: 0, sm: 0, md: "initial" }}
          right="0"
          left="0"
          m={{
            md: "0 98px",
          }}
          p={{
            sm: "0 75px",
            md: "50px 98px ",
          }}
          bgcolor={{ md: "var(--white)" }}
          position={{ xs: "relative", sm: "relative", md: "absolute" }}
          order={1}
          minHeight={{ md: "250px" }}
        >
          <Box
            component="h2"
            fontSize={{ xs: "32px", md: "40px" }}
            lineHeight={{ xs: "36px", md: "46px" }}
            maxWidth="470px"
            mb={{ xs: "16px", md: "15px" }}
          >
            {title ? parse(title) : null}
          </Box>
          {newDate && (
            <Box
              component="p"
              fontSize={{ xs: "12px", md: "14px" }}
              lineHeight={{ xs: "16px", md: "20px" }}
              mb={{ xs: "16px", md: "20px" }}
            >
              {newDate}
            </Box>
          )}
          {data?.text && (
            <Box
              component="p"
              fontSize={{ xs: "16px", md: "18px" }}
              lineHeight={{ xs: "26px", md: "26px" }}
              mb={{ xs: "30px" }}
            >
              {text ? parse(text) : null}
            </Box>
          )}
          {document_id && (
            <Box width={{ xs: "287px", md: "356px" }} mb="30px">
              <ButtonCTA type="download" file={documentB04?.document} />
            </Box>
          )}
          {link && (
            <MyLink
              classStyle="underlinedLink nohover"
              url={link?.url}
              text={link?.title}
              external={link?.attributes?.external}
              target={link?.attributes?.attributes?.target}
              type="B04"
            />
          )}
        </Content>
      </Box>
    </Block04>
  )
}

const Block04 = styled(Box)`
  @media (min-width: 600px) {
    background-size: 100% 28%;
  }
  @media (min-width: 960px) {
    background-size: 100% 50%;
  }
`
const Image = styled(Box)`
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`
const Content = styled(Box)``
