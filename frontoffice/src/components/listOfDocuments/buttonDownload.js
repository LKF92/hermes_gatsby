import React, { useState, useContext } from "react"
import { GlobalContext } from "../layout"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import { DownloadIcon } from "./icons/button"

export default ({ event, nbrSelectedDocuments }) => {
  const { lang, wording } = useContext(GlobalContext)
  const [isHoveredBt, setIsHoveredBt] = useState(false)
  return (
    <Wrapper>
      <Box
        className="stikyDownload"
        right={{
          xs: "30px",
          sm: "91px",
          md: "110px ",
          lg: "132px ",
          xl: "532px ",
        }}
        top="70%"
        position="fixed"
        zIndex={10}
      >
        <Box
          component="button"
          width="50px"
          height="50px"
          display="flex"
          alignItems="center"
          position="relative"
          className="buttonDownload"
          bgcolor={isHoveredBt ? "var(--black)" : "var(--floralWhite)"}
          color={isHoveredBt ? "var(--white)" : "var(--darkGrey)"}
          justifyContent="center"
          onMouseEnter={() => setIsHoveredBt(true)}
          onMouseLeave={() => setIsHoveredBt(false)}
          onClick={event}
          borderRadius="100%"
          boxShadow={
            isHoveredBt
              ? "0 20px 80px 0 rgba(68,68,68,0.40)"
              : "0 10px 40px 0 rgba(68,68,68,0.20)"
          }
        >
          <DownloadIcon
            isHovere={isHoveredBt}
            title={wording(lang, "DownloadDocuments")}
          />
          <Box
            component="span"
            width="25px"
            height="25px"
            right="-9px"
            top="-9px"
            position="absolute"
            borderRadius="100%"
            bgcolor="var(--chip)"
            fontSize="12px"
            lineHeight="16px"
            color="var(--white)"
            fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
            letterSpacing="0"
            textAlign="center"
            justifyContent="center"
            display="flex"
            alignItems="center"
          >
            {nbrSelectedDocuments}
          </Box>
        </Box>
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  cursor: pointer;
  span {
    background: var(--chip);
  }
`
