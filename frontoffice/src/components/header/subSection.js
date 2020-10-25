import React, { useEffect, useRef, useContext } from "react"
import { HeaderContext } from "./index"
import ListItem from "../listItem"

export default function ({ text, link, index, listLength }) {
  const {
    keyboardNav,
    setKeyboardNav,
    activeSubMenu,
    setActiveSubMenu,
  } = useContext(HeaderContext)

  const listRef = useRef()

  // ACCESSIBILITY : KEYBOARD NAVIGATION
  // Focus the first item in the list of link
  useEffect(() => {
    if (keyboardNav === "enterSubmenu") {
      setActiveSubMenu(activeSubMenu)
      if (index === 0) {
        listRef.current.focus()
      }
    }
  }, [keyboardNav])

  // Focus back to the menu items and hide subMenu
  const handleKeyboardNav = event => {
    // Shift + Tab from first list item
    if (index === 0) {
      if (event.shiftKey && event.keyCode === 9) {
        setKeyboardNav("exitSubmenu")
      }
      // Tab from last list item
    } else if (index === listLength - 1) {
      if (event.keyCode === 9) {
        setKeyboardNav("exitSubmenu")
      }
    }
    // Dismiss subMenu with escape key
    if (event.keyCode === 27) {
      setKeyboardNav("exitSubmenu")
    }
  }

  return (
    <ListItem
      text={text}
      url={link?.url}
      listRef={listRef}
      isDocument={link?.type === "document"}
      handleKeyboardNav={handleKeyboardNav}
      external={link?.attributes?.external}
      target={link?.attributes?.attributes?.target || "_blank"}
    />
  )
}
