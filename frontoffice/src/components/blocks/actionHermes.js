import React, { useContext } from "react"
import { GlobalContext } from "../layout"
import Iframe from "react-iframe"
import { Box } from "@material-ui/core"
import styled from "styled-components"

export default () => {
  const { lang, wording } = useContext(GlobalContext)
  const externalUrl =
    "https://gateway.euronext.com/front-customer/corporate/page?reference=eab805a0ebb55fd3b0ffc21c463b4e68aabaac13c983aec8c45d219413705dbc&authKey=f982e466d6713ef624b9dc6c4a1d0e38865ba9bb7117dac05ef605515541b65c&lang=fr"
  return (
    <Wrapper>
      <Iframe
        title={wording(lang, "titleActionHermes")}
        url={externalUrl}
        frameBorder="0"
        id="actionHermes"
        position="relative"
        overflow="hidden"
        scrolling="no"
      />
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;

  background: #ffffff;
  #actionHermes {
    padding: 10px;
    width: calc(640px - 2 * 16px);
    height: 105.625rem;
    @media (min-width: 600px) {
      width: calc(960px - 2 * 69px);
      height: 125rem;
    }
    @media (min-width: 960px) {
      width: 100%;
      max-width: 1140px;
      height: 100rem;
    }
  }
`
