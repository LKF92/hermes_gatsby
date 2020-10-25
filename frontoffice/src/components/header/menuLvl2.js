import React, { useContext } from "react"
import SubMenu from "./subMenu"
import Search from "./search"
import { HeaderContext } from "./index.js"

export default function MenuLvl2() {
  const { menuData, activeSubMenu, showSearchBar } = useContext(HeaderContext)

  const menuToDisplay = menuData.filter(
    subMenu => subMenu.uuid === activeSubMenu
  )[0]

  return (
    <>
      {showSearchBar && <Search idInput="searchMenuLvl2" />}
      {activeSubMenu && <SubMenu menuToDisplay={menuToDisplay} />}
    </>
  )
}
