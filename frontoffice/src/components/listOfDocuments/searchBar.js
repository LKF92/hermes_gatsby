import React, { useState, useEffect, useContext } from "react"
import { navigate } from "gatsby"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import SearchIcon from "../icons/searchIcon"
import CrossIcon from "../icons/crossIcon"

export default ({ setSearchValue, searchValue, locationSearchValue }) => {
  const { lang, wording } = useContext(GlobalContext)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (typeof window !== undefined) {
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      const searchParam = urlParams.get("search")
      // Initialize the list of document with the search value :
      // search value received from the searchbar (from the header)
      if (locationSearchValue) {
        setInputValue(locationSearchValue)
        setSearchValue(locationSearchValue)
      }
      // search value received from the params
      if (searchParam) {
        setInputValue(searchParam)
        setSearchValue(searchParam)
      }
    }
  }, [locationSearchValue])

  useEffect(() => {
    // Update the url when the user selects filters
    let pathname = window.location.pathname
    let searchParams = window.location.search
    let params = new URLSearchParams(searchParams)
    if (inputValue) {
      params.set("search", inputValue)
      navigate(`${pathname}?${params.toString()}`)
    } else {
      params.delete("search")
      navigate(`${pathname}?${params.toString()}`)
    }
  }, [inputValue])

  const launchSearch = e => {
    if (e.keyCode === 13) setSearchValue(inputValue)
  }

  return (
    <SearchBar
      position="relative"
      m="60px auto"
      width="100%"
      height="100%"
      className="isFromResultPage"
    >
      <Box
        className="searchSection"
        bgcolor="var(--floralWhite)"
        p={{
          xs: "20px 24px",
          sm: "20px 40px",
          md: "25px 40px",
        }}
      >
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Box
            component="input"
            border="none"
            bgcolor="inherit"
            width="100%"
            type="text"
            color="val(--black)"
            fontSize="14px"
            lineHeight="24px"
            height="auto"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={launchSearch}
            placeholder={wording(lang, "Research")}
            title={wording(lang, "SearchTitle")}
          />
          <Box className="searchIcon">
            {searchValue.length > 0 ? (
              <Box
                component="button"
                onClick={() => {
                  setInputValue("")
                  setSearchValue("")
                }}
              >
                <CrossIcon
                  width="18px"
                  height="18px"
                  color="black"
                  title={wording(lang, "HideSearchBar")}
                />
              </Box>
            ) : (
              <Box
                component="button"
                onClick={() => setSearchValue(inputValue)}
              >
                <SearchIcon
                  width="18px"
                  height="18px"
                  color="black"
                  title={wording(lang, "Research")}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </SearchBar>
  )
}

const SearchBar = styled(Box)`
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
