import React, { useContext, useEffect, useRef } from "react"
import { Link } from "gatsby"
import { HeaderContext } from "./index.js"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import CrossIcon from "../icons/crossIcon"
import MenuSectionTabMob from "./menuSectionTabMob"
import ExchangeRate from "../exchangeRate"
import SelectsLang from "./selectsLang"
import Shop from "../../images/svg/shop.svg"

export default function () {
  const { menuData, showMenu, setShowMenu } = useContext(HeaderContext)
  const { lang, wording } = useContext(GlobalContext)
  const refFocus = useRef(null)

  useEffect(() => {
    if (refFocus.current) refFocus.current.focus()
  }, [])

  return (
    <Modal
      position="fixed"
      top={0}
      left={0}
      zIndex={50}
      width="100vw"
      minHeight="100vh"
      height="100%"
      overflow="scroll"
      bgcolor="rgb(93,90,86, 0.8)"
      display="flex"
      flexDirection="column"
    >
      <MenuTabMob
        aria-label="Main menu mobile"
        role="navigation"
        fontFamily="Orator W01"
        color="var(--black)"
        bgcolor="white"
        fontSize="18px"
        lineHeight="22px"
        width={{ xs: "100%", sm: "477px" }}
        boxSizing="border-box"
        padding={{ xs: "20px 30px 60px 30px", sm: "20px 70px 60px 70px" }}
      >
        <Box display="flex" alignItems="center">
          <Box
            component="button"
            className="centered"
            mr="15px"
            onClick={() => setShowMenu(!showMenu)}
            ref={refFocus}
          >
            <CrossIcon
              width={16}
              height={15}
              color="black"
              title={wording(lang, "MenuClose")}
            />
          </Box>
          <Box component="h2" fontSize="22px" lineHeight="28px">
            Menu
          </Box>
        </Box>
        {menuData.map((section, index) => {
          // If the object has no parent, then it is a menu section
          if (section[lang]?.parent === null) {
            return (
              <MenuSectionTabMob
                key={index}
                section={{ ...section[lang], uuid: section.uuid }}
              />
            )
          } else {
            return null
          }
        })}
      </MenuTabMob>
      <Langue
        height={{ xs: "62px" }}
        bgcolor="var(--floralWhite)"
        width={{ xs: "100%", sm: "477px" }}
        boxSizing="border-box"
        p={{ xs: "0 0px", sm: "0 70px" }}
      >
        <SelectsLang lang={lang} id="language switch mobile" />
      </Langue>
      <Footer
        height="100%"
        bgcolor="var(--beige3)"
        p={{ xs: "0 0 50px", sm: "0 70px 50px" }}
        width={{ xs: "100%", sm: "477px" }}
        boxSizing="border-box"
      >
        <Box
          className="links"
          p="30px 0"
          borderBottom="1px solid var(--grey)"
          mb="21px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <p>
            {/* TODO */}
            <Link
              to={`/${lang}/contact`}
              aria-label={lang === "fr" ? "Page de Contact" : "Contact Page"}
            >
              Contact
            </Link>
          </p>
          <p>
            <Link
              to={`/${lang}/${
                lang === "fr"
                  ? "questions-frequentes"
                  : "frequently-asked-questions"
              }`}
              aria-label={
                lang === "fr"
                  ? "Questions Fréquentes"
                  : "Frequently Asked Questions"
              }
            >
              FAQ
            </Link>
          </p>
          <p>
            <a
              href="https://www.hermes.com"
              target="_blank"
              rel="noreferrer"
              aria-label="to Hermès shop website"
            >
              <Box display="flex" alignItems="center" width="100%">
                <Shop />
                <Box className="homepage-link" ml="8px">
                  Hermes.com
                </Box>
              </Box>
            </a>
          </p>
        </Box>
        <ExchangeRate />
      </Footer>
    </Modal>
  )
}

const MenuTabMob = styled(Box)`
  z-index: 100;
  pointer-events: default;
`

const Langue = styled(Box)``
const Footer = styled(Box)`
  .homepage-link {
    text-transform: none;
  }
  .links {
    > p {
      text-align: center;
    }
  }
`
const Modal = styled(Box)`
  transition: all 1s ease-in-out;
`
