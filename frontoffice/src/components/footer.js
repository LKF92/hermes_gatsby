import React, { useContext } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { GlobalContext } from "./layout"
import { Box } from "@material-ui/core"
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "./icons/footerIcons"
import HermesLogo from "../images/svg/logo-hermes.svg"
import { useFooter } from "../data/footer"
import { useFooterEn } from "../data/footerEn"
import parse from "html-react-parser"

export default () => {
  const { lang, wording } = useContext(GlobalContext)
  const footerData = lang === "fr" ? useFooter() : useFooterEn()
  const titlesList = footerData.filter(node => node[lang]?.parent === null)

  return (
    <Footer
      component="footer"
      bgcolor="var(--floralWhite)"
      color="var(--darkGrey)"
      fontSize="16px"
      lineHeight="26px"
      p={{ xs: "60px 20px", sm: "60px 69px", md: "100px 113px 70px" }}
    >
      {/* Level 2 */}
      <Box
        maxWidth="1140px"
        margin="auto"
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        p={{ xs: "0 0 20px", sm: "0 0 72px", md: "0 98px 70px" }}
      >
        {titlesList.map((title, index) => {
          const listItems = footerData.filter(node => {
            // We get the parent's uuid of each list items
            const parentID = node[lang]?.parent
              ? node[lang]?.parent.split(":")[1]
              : null
            return parentID === title.uuid
          })
          return (
            <Box
              flexDirection="column"
              key={index}
              mb={{ xs: "40px", sm: "0" }}
            >
              <Box
                component="h4"
                aria-level="3"
                textAlign={{ xs: "center", sm: "left" }}
                mb="20px"
              >
                {title[lang]?.title ? parse(title[lang].title) : ""}
              </Box>
              <Box component="ul" m="0" p="0">
                {listItems.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      component="li"
                      pr={{ xs: "15px", sm: "20px" }}
                      textAlign={{ xs: "center", sm: "left" }}
                      mb="20px"
                      color="inherit"
                      fontFamily="Courier New"
                      fontSize="13px"
                      lineHeight="15px"
                    >
                      {item[lang]?.link?.attributes?.external ? (
                        <a
                          href={item[lang]?.link?.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item[lang]?.title ? parse(item[lang]?.title) : null}
                        </a>
                      ) : (
                        <Box>
                          <Link to={`${item[lang]?.link?.url.toLowerCase()}/`}>
                            {item[lang]?.title
                              ? parse(item[lang]?.title)
                              : null}
                          </Link>
                        </Box>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )
        })}
      </Box>
      <Box
        maxWidth="1140px"
        margin="auto"
        border="1px solid var(--beige)"
        borderBottom={0}
        component="hr"
        title="End of the Footer Navigation menu"
        mb="40px"
      />
      {/* Level 3 */}
      <Box
        maxWidth="1140px"
        margin="auto"
        alignItems="center"
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
        fontSize="12px"
        justifyContent="space-between"
        lineHeight="16px"
      >
        <Box mb={{ xs: "30px", md: "0" }} order={{ xs: 2, md: 1 }}>
          {wording(lang, "copywrite")}
        </Box>
        <Box order={{ xs: 3, md: 2 }}>
          <Link
            to={lang === "fr" ? "/" : "/en/"}
            title={wording(lang, "titleLogoFooter")}
            className="logo"
          >
            <HermesLogo />
          </Link>
        </Box>
        <Box
          alignItems="center"
          display="flex"
          mb={{ xs: "30px", md: "0" }}
          order={{ xs: 1, md: 3 }}
        >
          <Box component="span" ml="10px" mr="10px">
            <FacebookIcon href="https://www.facebook.com/hermes/" />
          </Box>
          <Box component="span" ml="10px" mr="10px">
            <InstagramIcon href="https://instagram.com/hermes/" />
          </Box>
          <Box component="span" ml="10px" mr="10px">
            <TwitterIcon href="https://twitter.com/hermes_paris" />
          </Box>
          <Box component="span" ml="10px" mr="10px">
            <YoutubeIcon href="https://www.youtube.com/user/hermes" />
          </Box>
          <Box component="span" ml="10px" mr="10px">
            <LinkedinIcon href="https://www.linkedin.com/company/hermes-group/" />
          </Box>
        </Box>
      </Box>
    </Footer>
  )
}

const Footer = styled(Box)`
  li {
    list-style-type: none;
    list-style-image: none;
  }
  svg:hover > path {
    fill: var(--red);
  }
`
