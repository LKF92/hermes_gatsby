import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useRef,
} from "react"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import LogoHermes from "../icons/logoHermes"
import SearchIcon from "../icons/searchIcon"
import MenuIcon from "../icons/menuIcon"
import PreHeader from "./preHeader"
import Menu from "./menu"
import MenuLvl2 from "./menuLvl2"
import CrossIcon from "../icons/crossIcon"
import MenuTabMob from "./menuTabMob"
import { useMenu } from "../../data/menu"
import { useMenuEn } from "../../data/menuEn"

export const HeaderContext = createContext()

export default ({ isNavbarFixed }) => {
  const { lang, wording } = useContext(GlobalContext)
  const [activeSubMenu, setActiveSubMenu] = useState(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [keyboardNav, setKeyboardNav] = useState("")
  const [showMenu, setShowMenu] = useState(false)

  // Detect if page research for hide loop of search
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const splitPathName = pathname.split("/")
  const isPageResearch = splitPathName.indexOf("research") < 0

  const menuData = lang === "fr" ? useMenu() : useMenuEn()

  // Move focus back to the menu burger icon when closing the mobile menu
  const focusRef = useRef()
  useEffect(() => {
    if (focusRef.current && showMenu === false) focusRef.current.focus()
  }, [showMenu])

  return (
    <HeaderContext.Provider
      value={{
        activeSubMenu,
        setActiveSubMenu,
        menuData,
        keyboardNav,
        setKeyboardNav,
        showMenu,
        setShowMenu,
        showSearchBar,
        setShowSearchBar,
        lang,
      }}
    >
      <PreHeader />
      <Header
        showMenu={showMenu}
        component="header"
        position={isNavbarFixed ? "sticky" : "static"}
        top={isNavbarFixed ? "-85px" : "0"}
      >
        <Box
          p={{ xs: "22px 30px", sm: "19px 69px", md: "0" }}
          height={{ xs: "70px", sm: "80px", md: "156px" }}
          bgcolor="var(--beige3)"
          display="flex"
          justifyContent="space-between"
          flexDirection={{ xs: "row", sm: "row", md: "column" }}
          alignItems="center"
        >
          <Box
            component="button"
            className="menuBurger"
            ref={focusRef}
            display={{ xs: "block", md: "none" }}
            aria-expanded={showMenu}
            aria-label="Main menu mobile"
            // prevent any clicks from inside the menu tabmob to fire the Onclick below
            disabled={showMenu}
            onClick={() => setShowMenu(!showMenu)}
          >
            <MenuIcon
              width="20"
              height="13"
              color="var(--black)"
              title={wording(lang, "MenuBurger")}
            />
            <Box component="span" className="visually-hidden">
              {wording(lang, "MenuBurger")}
            </Box>
          </Box>
          {/* TABLET & MOBILE MENU */}
          {showMenu && <MenuTabMob />}
          <Box component="h1" className="hermesLogo" mt={{ md: "30px" }}>
            <LogoHermes url={lang === "fr" ? "/" : "/en/"} />
          </Box>

          <Box
            className="searchTabMob"
            display={{ xs: "block", md: "none" }}
            disabled={showMenu}
          >
            {isPageResearch && (
              <>
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
                    <Box component="span" className="visually-hidden">
                      {wording(lang, "ShowSearchBar")}
                    </Box>
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
                      color="var(--black)"
                      title={wording(lang, "HideSearchBar")}
                    />
                    <Box component="span" className="visually-hidden">
                      {wording(lang, "HideSearchBar")}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
          {/* SKIPLINK for accessibility*/}
          <a
            id="skiplink"
            className="visually-hidden"
            href="#main-content"
            tabIndex={0}
          >
            Skip to main content
          </a>
          {/* DESKTOP MENU */}
          <Menu />
        </Box>
        {(activeSubMenu && <MenuLvl2 />) || (showSearchBar && <MenuLvl2 />)}
      </Header>
    </HeaderContext.Provider>
  )
}

const Header = styled(Box)`
  box-shadow: 0 1px 15px 0px #e9e6e6;
  #skiplink {
    &:focus {
      display: block;
    }
  }
`
