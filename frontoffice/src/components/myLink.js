import React, { useContext } from "react"
import { Link } from "gatsby"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import { GlobalContext } from "./layout"
import parse from "html-react-parser"

export default function ({
  url,
  text,
  external,
  target,
  aria,
  classStyle,
  isDocument,
}) {
  const { wording, lang } = useContext(GlobalContext)

  // Check if url exists to avoid empty links
  if (url) {
    if (external || isDocument) {
      return (
        <ExternalLink
          component="a"
          href={url}
          target={target}
          rel="noreferrer"
          className={classStyle}
        >
          {text ? (
            parse(text)
          ) : aria ? (
            <>
              {wording(lang, "findMore")}
              <span className="visually-hidden"> {aria}</span>
            </>
          ) : (
            wording(lang, "findMore")
          )}
        </ExternalLink>
      )
    } else {
      return (
        <MyLink
          component={Link}
          to={url}
          target={target}
          className={classStyle}
        >
          {text ? (
            parse(text)
          ) : aria ? (
            <>
              {wording(lang, "findMore")}
              <span className="visually-hidden"> {aria}</span>
            </>
          ) : (
            wording(lang, "findMore")
          )}
        </MyLink>
      )
    }
  }
  return null
}

const ExternalLink = styled(Box)`
  &.underlinedLink {
    text-decoration: underline !important;
    font-family: "Courier New" !important;
    font-size: 13px !important;
    line-height: 15px !important;
    letter-spacing: 0.6px !important;
    :hover {
      text-decoration: none !important;
    }
  }
`
const MyLink = styled(Box)`
  &.underlinedLink {
    text-decoration: underline !important;
    font-family: "Courier New" !important;
    font-size: 13px !important;
    line-height: 15px !important;
    letter-spacing: 0.6px !important;
    :hover {
      text-decoration: none !important;
    }
  }
`
