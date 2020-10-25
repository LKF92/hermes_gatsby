import React, { useContext } from "react"
import { GlobalContext } from "./layout"
import AddEvent from "./addEvent/index.js"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import Download from "./icons/download"
import Calendar from "./icons/calendar"

export default function ({ type, file, eventDetails }) {
  const { lang, wording } = useContext(GlobalContext)
  const downloadButtonText = `${wording(lang, "Download")} ${
    file?.filetype || file?.filesize ? "(" : ""
  }${file?.filetype ? file?.filetype + ", " : ""}${
    file?.filesize ? file?.filesize : ""
  }${file?.filetype || file?.filesize ? ")" : ""}`

  if (type === "calendar") {
    return (
      <AddEvent eventDetails={eventDetails}>
        <ButtonCTA
          className="nohover"
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50px"
          width="100%"
          border="1px solid var(--beige)"
          bgcolor="white"
          borderRadius="5px"
        >
          <Box component="div" mr="10px">
            <Calendar />
          </Box>
          <Box
            component="div"
            fontFamily="Courier New"
            fontSize="13px"
            lineHeight="15px"
            letterSpacing="0.6"
          >
            {wording(lang, "AddCalendar")}
          </Box>
        </ButtonCTA>
      </AddEvent>
    )
  } else if (type === "document" || type === "download") {
    return (
      <ButtonCTA
        component="a"
        target="_blank"
        rel="noreferrer"
        className="nohover"
        href={file?.file?.url}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50px"
        width="100%"
        border="1px solid var(--beige)"
        bgcolor="white"
        borderRadius="5px"
      >
        <Box component="div" mr="10px">
          <Download />
        </Box>
        <Box
          component="div"
          fontFamily="Courier New"
          fontSize="13px"
          lineHeight="15px"
          letterSpacing="0.6"
        >
          {/* TODO a */}
          <Box
            component={"span"}
            maxWidth={{ xs: "202px", sm: "202px", md: "80%" }}
            className="buttonText"
          >
            {downloadButtonText}
          </Box>
        </Box>
      </ButtonCTA>
    )
  }
}

const ButtonCTA = styled(Box)`
  padding: 10px 10px;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;
  :hover {
    text-decoration: underline;
  }
`
