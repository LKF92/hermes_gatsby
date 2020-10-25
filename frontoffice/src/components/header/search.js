import React, { useContext, useState, useRef, useEffect } from "react"
import { GlobalContext } from "../layout"
import { HeaderContext } from "./index"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import SearchIcon from "../icons/searchIcon"
import { navigate } from "gatsby"

// The props 'value' and 'setValue' are for the searchbar from the result page
export default () => {
  const { lang, wording } = useContext(GlobalContext)
  const { setShowSearchBar } = useContext(HeaderContext)
  const inputRef = useRef()
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = () => {
    navigate(
      `/${[lang]}/${
        lang === "fr" ? "recherche" : "search"
      }?search=${searchValue}`,
      { state: { searchValue } }
    )
    setShowSearchBar(false)
  }
  const handleEnterKey = e => {
    // trigger the search when user types Enter key
    if (e.keyCode === 13) {
      // If the searchbar is from the menu, we want to navigate to the result page
      navigate(
        `/${[lang]}/${
          lang === "fr" ? "recherche" : "search"
        }?search=${searchValue}`,
        { state: { searchValue } }
      )
      setShowSearchBar(false)
    }
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <Box>
      <Search position="absolute" m="0 auto" width="100%" height="100%">
        <Box
          className="searchSection"
          bgcolor="var(--floralWhite)"
          p={{
            xs: "16px 30px",
            sm: "16px 68px",
            md: "25px 211px",
          }}
        >
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Box
              component="input"
              ref={inputRef}
              border="none"
              bgcolor="inherit"
              width="100%"
              type="text"
              placeholder={wording(lang, "Research")}
              title={wording(lang, "SearchTitle")}
              color={"val(--black)"}
              fontSize={"14px"}
              lineHeight={"24px"}
              height="26px"
              onKeyDown={handleEnterKey}
              onChange={e => setSearchValue(e.target.value)}
              value={searchValue}
            />

            <Box className="searchIcon">
              <Box component="button" onClick={handleSearch}>
                <SearchIcon
                  width="18px"
                  height="18px"
                  color="black"
                  title={wording(lang, "Research")}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Search>
      <Overlay height="10000px" width="100%"></Overlay>
    </Box>
  )
}

const Search = styled(Box)`
  z-index: 15;
  input {
    text-indent: 19px;
    outline: none;
    border-left: 1px solid var(--beige);
    color: var(--dark);
  }

  &.isFromResultPage {
    input {
      text-indent: 0;
      border-left: none;
    }
    input:focus {
      border-left: none;
    }
  }

  input:focus {
    border-left: 1px solid var(--red);
  }
  .searchIcon {
    cursor: pointer;
    margin-left: 13px;
  }
  .searchIcon:hover {
    svg > path {
      fill: var(--red);
    }
  }
`
const Overlay = styled(Box)`
  background: rgba(93, 90, 86, 0.7);
  position: absolute;
  z-index: 10;
`
