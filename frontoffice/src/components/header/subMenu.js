import React, { useContext } from "react"
import { HeaderContext } from "./index.js"
import { Box, Container } from "@material-ui/core"
import SubSection from "./subSection"
import parse from "html-react-parser"

export default function SubMenu({ menuToDisplay }) {
  const { setActiveSubMenu, menuData, lang } = useContext(HeaderContext)

  const listItems = menuData.filter(item => {
    // We get all the list items parents ids
    const parentID = item[lang]?.parent
      ? item[lang]?.parent.split(":")[1]
      : null
    return parentID === menuToDisplay.uuid && item[lang].status
  })

  return (
    <Box
      onMouseEnter={() => {
        setActiveSubMenu(menuToDisplay.uuid)
      }}
      onMouseLeave={() => {
        setActiveSubMenu(null)
      }}
      position="absolute"
      zIndex={10}
      bgcolor="var(--beige2)"
      height="fit-content"
      width="100%"
      padding="45px 113px"
      display="flex"
    >
      <Container>
        <Box display="flex">
          <Box width="423px" borderRight="1px solid var(--grey)">
            <Box
              margin="0 0 19px"
              color="var(--red)"
              mt="-10px"
              component="h2"
              fontSize="36px"
              fontFamily="Orator W01"
              lineHeight="40px"
            >
              {menuToDisplay[lang]?.title
                ? parse(menuToDisplay[lang].title)
                : ""}
            </Box>
            <Box component="p" width="356px" ml="7px">
              {menuToDisplay[lang]?.text ? parse(menuToDisplay[lang].text) : ""}
            </Box>
          </Box>
          <Box component="ul" role="menu" pl="60px">
            {listItems.map((item, index) => {
              return (
                <Box component="li" role="menuitem" mb="30px" key={index}>
                  <SubSection
                    key={index}
                    index={index}
                    text={item[lang].title}
                    link={item[lang].link}
                    listLength={listItems.length}
                  />
                </Box>
              )
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
