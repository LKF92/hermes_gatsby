import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import BulletPoint from "../images/svg/arrow.svg"
import { Box } from "@material-ui/core"
import parse from "html-react-parser"

export default function ({
  text,
  url,
  handleKeyboardNav,
  listRef,
  external,
  lowercase,
  target,
  listitem,
  isDocument,
}) {
  if (external || isDocument) {
    return (
      <ListItem
        className={lowercase ? "capitalize-lowercase" : "uppercase"}
        component="a"
        href={url}
        rel="noreferrer"
        target={target}
        ref={listRef}
        role={listitem ? "listitem" : ""}
        onKeyDown={handleKeyboardNav ? handleKeyboardNav : null}
        display="flex"
        alignItems="top"
      >
        <Box width="5px" className="centered">
          <BulletPoint />
        </Box>
        <Box
          component="p"
          fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
          color={lowercase ? "var(--grey2)" : "var(--black)"}
          fontSize={lowercase ? "14px" : "12px"}
          lineHeight={lowercase ? "20px" : "16px"}
          letterSpacing={lowercase ? "0px" : "1px"}
          textAlign="left"
          maxWidth={{ xs: "260px", md: "100%" }}
          ml="20px"
        >
          {text && parse(text)}
        </Box>
      </ListItem>
    )
  } else {
    return (
      <ListItem
        className={lowercase ? "capitalize-lowercase" : "uppercase"}
        display="flex"
        alignItems="center"
      >
        <Box width="5px" className="centered">
          <BulletPoint />
        </Box>
        <Box
          component="p"
          fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
          color={lowercase ? "var(--grey2)" : "var(--black)"}
          fontSize={lowercase ? "14px" : "12px"}
          lineHeight={lowercase ? "20px" : "16px"}
          letterSpacing={lowercase ? "0px" : "1px"}
          textAlign="left"
          maxWidth={{ xs: "260px", md: "100%" }}
          ml="20px"
        >
          <Link
            to={`${url?.toLowerCase()}/`}
            ref={listRef}
            onKeyDown={handleKeyboardNav ? handleKeyboardNav : null}
            role={listitem ? "listitem" : ""}
          >
            {text && parse(text)}
          </Link>
        </Box>
      </ListItem>
    )
  }
}

const ListItem = styled(Box)`
  :hover {
    transition: 0.25s ease-in-out;
    margin-left: 7px;
    svg path {
      stroke: var(--red);
    }
    p {
      color: var(--red);
    }
  }
`
