import React, { useContext, useState } from "react"
import { GlobalContext } from "../layout"
import { HeaderContext } from "./index.js"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import MenuItem from "./menuItem"
import SearchIcon from "../icons/searchIcon"
import CrossIcon from "../icons/crossIcon"

export default function () {
  const { lang, wording } = useContext(GlobalContext)
  const { menuData, showSearchBar, setShowSearchBar } = useContext(
    HeaderContext
  )

  // Detect if page research for hide loop of search
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const splitPathName = pathname.split("/")
  const isPageResearch = splitPathName.indexOf("research") < 0

  return (
    <Menu
      component="nav"
      role="navigation"
      display={{ xs: "none", md: "block" }}
    >
      <Box
        component="ul"
        margin="0"
        fontFamily="Orator W01"
        color="var(--black)"
        fontSize="16px"
        lineHeight="20px"
        letterSpacing="-1px"
        width="fit-content"
        role="menu"
        justifyContent="space-between"
        alignItems="center"
        display={{ xs: "none", md: "flex" }}
      >
        {/* If the object's parent is null, then it is a menu item */}
        {menuData.map((menuItem, index) =>
          menuItem[lang]?.parent === null ? (
            <MenuItem
              menuItem={{ ...menuItem[lang], uuid: menuItem.uuid }}
              key={index}
              index={index}
            />
          ) : null
        )}

        {isPageResearch && (
          <Box boxSizing="border-box" height="51px">
            {showSearchBar === false ? (
              <Box
                component="button"
                aria-expanded="false"
                onClick={() => setShowSearchBar(true)}
              >
                <SearchIcon
                  width="18px"
                  height="18px"
                  color="var(--black)"
                  title={wording(lang, "ShowSearchBar")}
                />
              </Box>
            ) : (
              <Box
                component="button"
                aria-expanded="true"
                onClick={() => setShowSearchBar(false)}
              >
                <CrossIcon
                  width="18px"
                  height="18px"
                  color="var(--red)"
                  title={wording(lang, "HideSearchBar")}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Menu>
  )
}

const Menu = styled(Box)``
