import React, { useRef, useContext, useEffect } from "react"
import { Link } from "gatsby"
import { HeaderContext } from "./index.js"
import { Box } from "@material-ui/core"
import styled from "styled-components"

export default ({ menuItem }) => {
  const {
    keyboardNav,
    setKeyboardNav,
    setActiveSubMenu,
    activeSubMenu,
    lang,
  } = useContext(HeaderContext)
  const itemRef = useRef()
  const { uuid, link, title } = menuItem

  // ACCESSIBILITY : KEYBOARD NAVIGATION
  const handleKeyPress = e => {
    if (activeSubMenu === null) {
      // Press Enter to display the subMenu
      if (e.keyCode === 13) {
        e.preventDefault()
        setActiveSubMenu(uuid)
      }
      // If the subMenu is displayed,
      // Move the focus to the subMenu when using Enter/Space/Down arrow key
    } else if (activeSubMenu === uuid) {
      if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 40) {
        e.preventDefault()
        setKeyboardNav("enterSubmenu")
      } else if (e.keyCode === 9) {
        setActiveSubMenu(null)
        // Dismiss subMenu with escape key
      } else if (e.keyCode === 27) {
        setKeyboardNav("exitSubmenu")
      }
    }
  }

  // Move the focus BACK to the menu after quitting the submenu
  // See component SubSection.js for more info
  useEffect(() => {
    if (keyboardNav === "exitSubmenu" && activeSubMenu === uuid) {
      itemRef.current.focus()
      setActiveSubMenu(null)
    }
  }, [activeSubMenu, keyboardNav])

  // Reset the keyboardNav state so that when the user changes menu item,
  // he doesn't automatically jump to the next menu item's subMenu
  useEffect(() => {
    setKeyboardNav("")
  }, [activeSubMenu])

  return (
    <MenuItem>
      {/* If there's a link, there is no submenu to show on hover */}
      {link?.url ? (
        <Box boxSizing="border-box" p="0 19px" role="menuitem">
          {link?.attributes?.external ? (
            <a
              className="MenuItemLink"
              href={link?.url}
              target="_blank"
              rel="noreferrer"
              ref={itemRef}
            >
              {title}
            </a>
          ) : (
            <Link
              className="MenuItemLink"
              to={`${link?.url.toLowerCase()}/`}
              ref={itemRef}
            >
              {title}
            </Link>
          )}
        </Box>
      ) : (
        // No link = we display the corresponding subMenu
        <Box
          onMouseEnter={e => {
            setActiveSubMenu(uuid)
          }}
          onMouseLeave={() => {
            setActiveSubMenu(null)
          }}
          boxSizing="border-box"
          height="51px"
          p="0 19px"
          role="menuitem"
        >
          <a
            className="MenuItemLink"
            href=""
            onClick={e => e.preventDefault()}
            aria-expanded={uuid === activeSubMenu}
            aria-haspopup={true}
            ref={itemRef}
            onKeyDown={handleKeyPress}
          >
            {title}
          </a>
        </Box>
      )}
    </MenuItem>
  )
}

const MenuItem = styled(Box)`
  .MenuItemLink {
    display: inline-block;
    height: 51px;
    position: relative;
    &:hover {
      border-bottom: 3px solid var(--red);
    }
  }
`
