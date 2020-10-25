import React, { useState, useContext } from "react"
import { GlobalContext } from "../layout"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import { AddIcon } from "./icons/button"

export default ({ event }) => {
  const { lang, wording } = useContext(GlobalContext)
  const [isHoveredBt, setIsHoveredBt] = useState(false)
  return (
    <Wrapper>
      <Box
        component="button"
        display="flex"
        alignItems="center"
        className="button"
        borderRadius="2px"
        border={` 1px solid  ${
          isHoveredBt ? "var(--floralWhite)" : "var(--beige)"
        }`}
        bgcolor={isHoveredBt ? "var(--black)" : "var(--floralWhite)"}
        p="10px"
        minWidth={{ xs: "287px", sm: "287px", md: "300px" }}
        fontSize={{ xs: "14px", sm: "14px", md: "14px" }}
        lineHeight={{ xs: "20px", sm: "20px", md: "20px" }}
        color={isHoveredBt ? "var(--white)" : "var(--darkGrey)"}
        fontFamily="Courier New"
        letterSpacing={0}
        justifyContent="center"
        onMouseEnter={() => setIsHoveredBt(true)}
        onMouseLeave={() => setIsHoveredBt(false)}
        onClick={event}
        onKeyPress={event}
      >
        <Box component="div" height="20px" mr="10px">
          <AddIcon isHovere={isHoveredBt} title={wording(lang, "BtSeeMore")} />
        </Box>
        <Box component="label">{wording(lang, "BtSeeMore")}</Box>
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  cursor: pointer;
  label {
    cursor: pointer;
  }
`
