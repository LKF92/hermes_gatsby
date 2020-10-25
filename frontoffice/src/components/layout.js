import React, { useState, createContext } from "react"
import { wording } from "../data/wording.js"
import Header from "./header/index.js"
import Footer from "./footer"
import CookieConsentBanner from "./cookieConsent"
import CssBaseline from "@material-ui/core/CssBaseline"
import styled, { createGlobalStyle } from "styled-components"
import { Box } from "@material-ui/core"
import "../fonts/font.css"

export const GlobalContext = createContext()

export default ({ children, pageContext, lang }) => {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false)
  const [isKeyboardNav, setIsKeyboardNav] = useState(false)

  const handleScroll = e => {
    const currentScrollPosition = window.pageYOffset
    if (currentScrollPosition > 85) {
      setIsNavbarFixed(true)
    } else {
      setIsNavbarFixed(false)
    }
  }

  const detectKeyboardNavigation = e => {
    if ((e.shiftKey && e.keyCode === 9) || e.keyCode === 9) {
      setIsKeyboardNav(true)
    }
  }

  return (
    <GlobalContext.Provider
      value={{ isKeyboardNav, lang, pageContext, wording }}
    >
      <Box
        display="flex"
        flexDirection="column"
        onWheel={handleScroll}
        onMouseMove={() => setIsKeyboardNav(false)}
        onKeyDown={detectKeyboardNavigation}
        maxWidth="100vw"
      >
        <GlobalStyle isKeyboardNav={isKeyboardNav} />
        <Header isNavbarFixed={isNavbarFixed} />
        <Box
          component="main"
          id="main-content"
          tabIndex={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          overflow="hidden"
        >
          <Wrapper>{children}</Wrapper>
        </Box>
        <Footer />
        <CookieConsentBanner />
        <CssBaseline />
      </Box>
    </GlobalContext.Provider>
  )
}

const GlobalStyle = createGlobalStyle`
 body {
    --white: #FFFFFF; /* Third background  */
    --black: #444444; /* Primary dark : outline form fields, title,  */
    --darkGrey: #696969; /* Primary medium :  CVV, secondary content */
    --grey2: #727272;
    --inactive: #9B9B9B; /* Inactive CTA background / Outline */ 
    --grey: #e5e5e5;
    --beige: #939393; /* Outline, border, separation line, etc. #DDD3C6 => not WCAG AA compliant */
    --beige2: #faf6f0; /* duplicate with --floralWhite ??? */
    --beige3: #F6F1EB; /* Main background  */
    --beige4: #d5d5d5;
    --beige5: #faf8fa;
    --floralWhite: #FFFCF7; /* second background  */
    --green: #187F06;
    --red: #BC4525; /* orange :hover   */
    --red2: #B04123; 
    --error:#9D2A1E;
    --validation: #34784A;
    --orange: #D64C27; /* orange for text */ 
    --orange2: #D85322;
    /* --chip: #D14722;  non conforme WCAG AA*/
    --chip: #D50037;
    --transparentBlack: "rgb(93,90,86,0.8)";
    font-family : Helvetica, "Helvetica W01", Arial, sans-serif;

    box-sizing: content-box;    
    h1, h2, h3, h4 { 
      color: var(--black); 
      margin: 0;
      font-weight: normal
    }
    h1::first-letter, h2::first-letter, h3::first-letter, h4::first-letter{
      text-transform:capitalize;
    }

    .capitalize-lowercase{
      text-transform:lowercase;
      & ::first-letter{
        text-transform:capitalize;
      }
    }
    .uppercase {
    text-transform: uppercase;
  }

    button{
    display: inline-block;
    border: none;
    padding: 0;
    margin: 0;
    text-decoration: none;
    background: inherit;
    color: inherit; 
    cursor : pointer
    }
    
    header{
      z-index:1
    }
    p, figure {
      margin: 0
    }
    a {
      color: inherit;
      text-decoration: inherit; 
      cursor: pointer;
      :not(.nohover):hover{
        color: var(--red)
      }
    }
     a.nohover:hover{
        text-decoration: none;
      }

    ul{
    padding-inline-start: 0px;
    list-style: none;
  }

    main {
      z-index:0;
      background: var(--beige3);
    }
    section {
      @media (max-width: 960px){
      margin-bottom: 60px;
      }
      @media (min-width: 960px){
      margin-bottom: 100px;
      }
    }
  
  .centered{
    display: flex;
    justify-content: center;
    align-items: center
  }

  .visually-hidden { 
    position: absolute !important;
    height: 1px; 
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap; /* added line */
}
  
  .MuiMenu-list[aria-labelledby="SimpleSelectLabel"]{
    padding:0;
    .optionList {
      font-family: Helvetica, 'Helvetica W01', Arial, sans-serif;
      font-size: 10px !important;
      color: #727272; 
      letter-spacing: 0;
      text-align: center;
      padding:5px 0;
      margin: 0 auto;
       width: 15px;
      &.firstItem{
        border-bottom: 1px solid var(--grey); // #e5e5e5
      }
      &.Mui-selected, &:hover, &:focus{
        background-color: transparent;
      }
      &:focus{
        outline: -webkit-focus-ring-color auto 5px;
      }
    }
   }

  /* TABLET - MOBILE STYLES */
  @media (max-width: 960px){

    h1 {
      font-family: "Orator W01", Calibri, serif; 
      font-size:32px;
      line-height: 36px; 
    }
    h2 {
      font-family: "Orator W01", Calibri, serif;
      font-size:24px;
      line-height: 28px;
    }
    h3 {
      font-family: "Orator W01", Calibri, serif;
      font-size:18px;
      line-height: 24px;
    }
    h4 {
      font-family: "Orator W01", Calibri, serif;
      font-size:16px;
      line-height: 22px;
    }
    p, blockquote, ul, ol{
      font-family: "Courier New", Calibri, serif;
      font-size:14px;
      line-height: 24px;
    }
    .caption{
      font-family: "Courier New", Calibri, serif;
      font-size:14px;
      line-height: 16px; 
    }
  }
    
   @media (min-width: 960px){
      h1 {
        font-family: "Orator W01", Calibri, serif; 
        font-size:36px;
        line-height: 40px; 
      }
      h2 {
        font-family: "Orator W01", Calibri, serif;
        font-size:32px;
        line-height: 36px;
      }
      h3 {
        font-family: "Orator W01", Calibri, serif;
        font-size:22px;
        line-height: 28px;
      }
      h4 {
        font-family: "Orator W01", Calibri, serif;
        font-size:18px;
        line-height: 24px;
      }
      p, blockquote, ul, ol{
        font-family: "Courier New", Calibri, serif;
        font-size:16px;
        line-height: 26px;
      }
      .caption{
        font-family: "Courier New", Calibri, serif;
        font-size:14px;
        /* Difference maquettes vs librairy */
        line-height: 16px; 
      }
   }
   
   .wysiwyg{
     h2{
       margin-bottom: 30px;
     } 
     h3 {

       margin-top: 40px;
       margin-bottom: 26px;
     }
     h4 {
       margin-bottom: 20px;
     }
    a {
      text-decoration: underline;
    }
    ul,
    ol {
      list-style: initial;
      padding-left: 17px;
      list-style-position: outside;
      margin-bottom: 20px;
    }
    li {
    margin-bottom: 20px;
    }
    p{
      margin-bottom: 1em;
    }
   }  
   
   .light-background{
    margin-bottom: 70px
   }
    *:focus{
      outline-color: blue !important;
      outline-width: 5px !important;
    outline-style: ${({ isKeyboardNav }) =>
      isKeyboardNav ? "auto !important" : "none"};
   }
  }
`
const Wrapper = styled.div`
  width: calc(100% - 2 * 16px);
  margin: 0 16px;
  @media (min-width: 600px) {
    width: calc(100% - 2 * 69px);
    margin: 0 69px;
  }
  @media (min-width: 960px) {
    margin: 0 113px;
    width: calc(100% - 2 * 113px);
    max-width: 1140px;
  }
`
