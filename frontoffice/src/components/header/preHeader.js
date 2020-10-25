import React, { useContext } from "react"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import { Link } from "gatsby"
import { Box } from "@material-ui/core"
import SelectsLang from "./selectsLang"
import ExchangeRate from "../exchangeRate"
import Shop from "../../images/svg/shop.svg"

export default ({ isKeyboardNav }) => {
  const { lang, wording } = useContext(GlobalContext)

  const menu = {
    fr: [
      {
        label: "contact",
        url: "/fr/contact/",
        aria: "Page de Contact",
      },
      {
        label: "FAQ",
        url: "/fr/questions-frequentes/",
        aria: "Questions Fréquentes",
      },
    ],
    en: [
      {
        label: "contact",
        url: "/en/contact/",
        aria: "Contact Page",
      },
      {
        label: "FAQ",
        url: "/en/frequently-asked-questions/",
        aria: "Frequently Asked Questions",
      },
    ],
  }

  return (
    <Wrapper
      component="aside"
      bgcolor="white"
      display={{ xs: "none", md: "flex" }}
      alignItems="center"
      justifyContent="center"
      height="44px"
      position="relative"
      zIndex={20}
    >
      <PreHeader width="1140px" justifyContent="space-between">
        <Box
          color="var(--grey2)"
          component="div"
          display="flex"
          width="100%"
          justifyContent="space-between"
          fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
        >
          <Box
            component="div"
            display="flex"
            alignItems="center"
            fontSize="11px"
            className="leftPane"
          >
            <Box
              mr="9px"
              className={"sharePrice"}
              fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
            >
              <Link to={`/${lang}/l-action-hermes/`}>
                {wording(lang, "SharePrice")}
              </Link>
            </Box>
            <ExchangeRate />
          </Box>
          <Box
            className="rightPane"
            display="flex"
            alignItems="center"
            fontSize="10px"
          >
            <Box
              component="ul"
              display="flex"
              alignItems="center"
              mr="9px"
              fontFamily='Helvetica, "Helvetica W01", Arial, sans-serif'
              fontSize="10px"
            >
              <Box
                component="li"
                borderRight="solid 1px var(--grey)"
                pr="15px"
                color="var(--grey2)"
              >
                <a
                  className="homeURL"
                  href="https://www.hermes.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box className="shop" display="flex" alignItems="center">
                    <Shop color={"var(--grey2)"} />
                    <Box className="homepage-link" ml="7px">
                      Hermes.com
                    </Box>
                  </Box>
                </a>
              </Box>
              {lang &&
                menu[lang].map((item, index) => {
                  return (
                    <>
                      <Box
                        key={index}
                        borderRight="solid 1px var(--grey)"
                        component="li"
                        pl="15px"
                        pr="15px"
                      >
                        <Box
                          component={Link}
                          to={item.url}
                          aria-label={item.aria}
                        >
                          {item.label}
                        </Box>
                      </Box>
                    </>
                  )
                })}
              <Box
                component="li"
                className="language"
                display="flex"
                alignItems="center"
                height="15px"
              >
                <SelectsLang lang={lang} isKeyboardNav={isKeyboardNav} />
              </Box>
            </Box>
          </Box>
        </Box>
      </PreHeader>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  li {
    list-style-image: none;
    list-style-type: none;
  }
  .rightPane {
    text-transform: capitalize;
  }
  .shop:hover {
    svg path {
      fill: var(--red);
    }
  }
  .sharePrice {
    cursor: pointer;
  }

  .homepage-link {
    text-transform: none;
  }
`
const PreHeader = styled(Box)`
  margin: 0 16px;
  @media (min-width: 600px) {
    margin: 0 69px;
  }
  @media (min-width: 960px) {
    margin: 0 113px;
  }
`
