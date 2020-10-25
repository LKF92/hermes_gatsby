import React, { useContext } from "react"
import { GlobalContext } from "../components/layout"
import Cross from "../images/svg/cross.svg"
import { Link } from "gatsby"
import CookieConsent from "react-cookie-consent"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import { useTermsOfServices } from "../data/termsOfServices"

export default () => {
  const { lang, wording } = useContext(GlobalContext)
  const termsOfServices = useTermsOfServices().allPage.nodes[0]
  const termsOfServicesURL =
    termsOfServices[lang].length > 0
      ? JSON.parse(termsOfServices[lang]).alias
      : ""
  return (
    <Wrapper>
      <CookieConsent
        disableStyles
        role="banner"
        buttonText={<Cross />}
        buttonId={"cookieContentClose"}
        buttonClasses={"cookie-content-close"}
        style={{
          display: "flex",
          padding: "10px 0",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component={"div"}
          className="cookie-banner"
          display="flex"
          flexDirection={"row"}
          alignItems="center"
          p={"0 10%"}
          textAlign="center"
        >
          <Box
            component={"p"}
            fontFamily="Helvetica W01, Helvetica, Microsoft YaHei, 微软雅黑, SimHei, 黑体,
      PingFang SC, 萍方, Noto Sans, sans-serif"
            lineHeight={"157.14286%"}
            fontSize={"81.25%  "}
            color={"var(--black)"}
          >
            {wording(lang, "bannerText")}
            <Link
              to={`/${lang}${termsOfServicesURL}`}
              dangerouslySetInnerHTML={{
                __html: wording(lang, "clickHer"),
              }}
            />
            .
          </Box>
        </Box>
      </CookieConsent>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  bottom: 0;
  position: sticky;
  background: var(--beige5);
  z-index: 100;
  padding: 0 16px;
  @media (min-width: 600px) {
    padding: 0 69px;
  }
  @media (min-width: 960px) {
    padding: 0 113px;
  }
`
