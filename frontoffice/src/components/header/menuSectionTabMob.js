import React, { useState, useContext } from "react"
import { GlobalContext } from "../layout"
import { Link } from "gatsby"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import SubSection from "./subSection"
import MinusIcon from "../icons/minusIcon"
import PlusIcon from "../icons/plusIcon"
import { HeaderContext } from "./index.js"

export default function ({ section }) {
  const { lang, wording } = useContext(GlobalContext)
  const { menuData } = useContext(HeaderContext)
  const [isMenuUnfolded, setIsMenuUnfolded] = useState(false)

  const listItems = menuData.filter(item => {
    // We get all the list items parents ids
    const parentID = item[lang]?.parent
      ? item[lang]?.parent.split(":")[1]
      : null
    return parentID === section.uuid
  })
  return (
    <MenuSectionTabMob isMenuUnfolded={isMenuUnfolded} width="100%" mt="30px">
      {/* if there's a url, then we either display an internal/external link */}
      {section?.link?.url ? (
        <>
          {section?.link?.attributes?.external ? (
            <Box
              component="a"
              href={section?.link?.url}
              display="flex"
              target="_blank"
              rel="noreferrer"
            >
              <Box fontSize="18px" fontFamily="Orator W01" lineHeight="22px">
                {section?.title}
              </Box>
            </Box>
          ) : (
            <Link
              to={`${
                lang === "en" && !section?.link?.url?.includes("/en/")
                  ? "/en"
                  : ""
              }${section?.link?.url}`}
            >
              <Box display="flex">
                <Box fontSize="18px" fontFamily="Orator W01" lineHeight="22px">
                  {section?.title}
                </Box>
              </Box>
            </Link>
          )}
        </>
      ) : (
        // If there's no link, we display a button to toggle the section with links
        <Box
          component="button"
          aria-expanded={isMenuUnfolded}
          width="100%"
          onClick={() => setIsMenuUnfolded(!isMenuUnfolded)}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box fontSize="18px" fontFamily="Orator W01" lineHeight="22px">
            {section.title}
          </Box>
          {isMenuUnfolded ? (
            <Box className="centered">
              <MinusIcon title={wording(lang, "MenuClose")} />
              <Box component="span" className="visually-hidden">
                {wording(lang, "MenuClose")}
              </Box>
            </Box>
          ) : (
            <Box className="centered">
              <PlusIcon title={wording(lang, "ShowMenu")} />
              <Box component="span" className="visually-hidden">
                {wording(lang, "ShowMenu")}
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Box
        className="subSection"
        data-hidden={!isMenuUnfolded}
        hidden={!isMenuUnfolded}
        component="ul"
      >
        {listItems.map((item, index) => {
          return (
            <Box mt="24px" key={index} component="li">
              <SubSection
                key={index}
                text={item[lang]?.title}
                link={item[lang]?.link}
              />
            </Box>
          )
        })}
      </Box>
    </MenuSectionTabMob>
  )
}

const MenuSectionTabMob = styled(Box)`
  pointer-events: default;
  transition: 0.5s ease-in-out;
  .subSection {
    overflow: hidden;
    max-height: ${({ isMenuUnfolded }) => (isMenuUnfolded ? "1000px" : 0)};
    transition: max-height 0.6s ease-in-out;
  }
`
