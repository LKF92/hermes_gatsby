import React, { useContext } from "react"
import { Link } from "gatsby"
import { GlobalContext } from "../layout"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import LogoHermesMobile from "../../images/svg/logo-hermes_mobile.svg"
import LogoHermesTablet from "../../images/svg/logo-hermes_tablet.svg"
import LogoHermesDesktop from "../../images/svg/logo-hermes_desktop.svg"

export default ({ url }) => {
  const { lang, wording } = useContext(GlobalContext)
  return (
    <LogoHermes to={url} title={wording(lang, "LogoHermesTitle")}>
      <Box display={{ sm: "none" }}>
        <LogoHermesMobile />
      </Box>
      <Box display={{ xs: "none", sm: "block", md: "none" }}>
        <LogoHermesTablet />
      </Box>
      <Box display={{ xs: "none", md: "block" }}>
        <LogoHermesDesktop />
      </Box>
    </LogoHermes>
  )
}

const LogoHermes = styled(Link)`
  svg:hover {
    fill: var(--red);
  }
`
