import React, { useState, useContext, useEffect, useRef } from "react"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import { navigate } from "gatsby"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import { GlobalContext } from "../layout"
import Cookie from "js-cookie"

export default ({ lang }) => {
  const { pageContext } = useContext(GlobalContext)
  const [toggleSelect, setToggleSelect] = useState("")
  const [language, setLanguage] = useState(lang)

  useEffect(() => {
    const userLang = (navigator.language || navigator.userLanguage).slice(0, 2)
    const userLangCookie = Cookie.get("userLangCookie")
    if (userLangCookie === undefined && userLang !== "fr") {
      Cookie.set("userLangCookie", userLang)
      setLanguage("en")
      toggleClass("en")
    }
  }, [])

  const toggleClass = value => {
    const toLang = value.toLowerCase()
    navigate(
      pageContext
        ? pageContext[toLang]
          ? `/${toLang}${pageContext[toLang].alias}/`
          : `/${toLang === "fr" ? "" : "en/"}`
        : `/${toLang === "fr" ? "" : "en/"}`
    )
  }

  const handleChange = e => {
    if (e.target.innerHTML.toLowerCase() !== language) {
      setLanguage(e.target.innerHTML)
      toggleClass(e.target.innerHTML)
      setToggleSelect(false)
    } else {
      setToggleSelect(false)
    }
  }
  const handleKeyDown = e => {
    if (e.keyCode === 32 || e.keyCode === 13) {
      if (e.target.innerHTML.toLowerCase() !== language) {
        setLanguage(e.target.innerHTML)
        toggleClass(e.target.innerHTML)
        setToggleSelect(false)
      } else {
        setToggleSelect(false)
      }
    }
  }

  const firstOptionRef = useRef()
  const selectRef = useRef()
  useEffect(() => {
    if (toggleSelect === true) firstOptionRef.current.focus()
    if (toggleSelect === false) selectRef.current.focus()
  }, [toggleSelect])

  return (
    <Wrapper>
      {/* DESKTOP */}
      <Box
        display={{ xs: "none", sm: "none", md: "block" }}
        fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
        bgcolor="var(--white)"
        m="0"
      >
        <Select toggleSelect={toggleSelect} width="40px" position="relative">
          <Box
            component="button"
            ref={selectRef}
            pl="15px"
            boxSizing="border-box"
            onClick={() => setToggleSelect(!toggleSelect)}
            fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
            fontSize="10px"
            aria-expanded={toggleSelect === true ? true : false}
          >
            <span className="visually-hidden">
              {language === "fr" ? "Sélecteur de langue" : "Language selector"}
            </span>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box>{language === "fr" ? "FR" : "EN"} </Box>
              <Box className="dropDownIcon" zIndex={10}>
                <ArrowDropDownIcon />
              </Box>
            </Box>
          </Box>
          <Box
            className="select-box"
            width="100%"
            position="absolute"
            top={0}
            boxShadow="5px 5px 5px  var(--grey)"
            component="ul"
            bgcolor="var(--white)"
            fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
            fontSize="10px"
          >
            <Box
              className="option"
              component="li"
              width="fit-content"
              borderBottom="1px solid var(--grey)"
              tabIndex={toggleSelect ? 0 : -1}
              ref={firstOptionRef}
              onClick={e => handleChange(e)}
              onKeyDown={e => handleKeyDown(e)}
              aria-current={true}
              aria-label={language === "fr" ? "Français" : "English"}
            >
              {language === "fr" ? "FR" : "EN"}
            </Box>

            <Box
              className="option"
              component="li"
              width="fit-content"
              tabIndex={toggleSelect ? 0 : -1}
              onClick={e => handleChange(e)}
              onKeyDown={e => handleKeyDown(e)}
              aria-current={false}
              aria-label={language === "fr" ? "English" : "Français"}
            >
              {language === "fr" ? "EN" : "FR"}
            </Box>
          </Box>
        </Select>
      </Box>
      {/* TABLET MOBILE */}
      <Box
        className="select-lang-mobile"
        display={{ xs: "block", sm: "block", md: "none" }}
        bgcolor="var(--floralWhite)"
        p="21px 0"
      >
        <Box
          component="ul"
          display="flex"
          justifyContent="center"
          p={0}
          m={0}
          paddingBottom="5px"
        >
          <Box component="li" display="flex" mr="40px">
            <Box
              component="button"
              className={`selectMob ${language === "fr" ? "selected" : ""}`}
              value="fr"
              aria-current={language === "fr" ? "true" : "false"}
              aria-label="Français"
              to={"/fr"}
              onClick={() => toggleClass("fr")}
            >
              FR
            </Box>
          </Box>

          <Box component="li" display="flex">
            <Box
              component="button"
              className={`selectMob ${language === "en" ? "selected" : ""}`}
              value="en"
              aria-current={language === "en" ? "true" : "false"}
              aria-label="English"
              to={"/en"}
              onClick={() => toggleClass("en")}
            >
              EN
            </Box>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  )
}

const Select = styled(Box)`
  .dropDownIcon {
    transition: transform 0.3s ease-out;
    transform: ${({ toggleSelect }) => (toggleSelect ? "rotate(180deg)" : "")};
  }
  .select-box {
    overflow: hidden;
    border: 2px solid white;
    border-top: 0;
    border-radius: 3px;
    padding-inline-start: 13px;
    .option {
      cursor: pointer;
      &:hover {
        font-weight: bold;
      }
    }
    transition: max-height 500ms ease-out, box-shadow 300ms ease-out;
    box-shadow: ${({ toggleSelect }) =>
      toggleSelect ? "4px 4px 10px var(--grey)" : "none"};
    max-height: ${({ toggleSelect }) => (toggleSelect ? "100px" : "25px")};
    z-index: ${({ toggleSelect }) => (toggleSelect ? 1 : -1)};
  }
`
const Wrapper = styled(Box)`
  ul {
    list-style: none;
  }
  .selected {
    color: var(--orange);
    border-bottom: 1px solid var(--red);
  }

  .selectMob {
    font-family: Helvetica, "Helvetica W01", Arial, sans-serif;
    font-size: 12px;
    letter-spacing: 0.6px;
    text-align: center;
    line-height: 18px;
    color: var(--darkGrey);

    &.selected {
      color: var(--red);
    }
  }
`
