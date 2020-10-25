import React, { useContext } from "react"
import { GlobalContext } from "./layout"
import RowLeft from "../images/svg/arrow.svg"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import { Link } from "gatsby"
import parse from "html-react-parser"

export default ({ crumbLabel }) => {
  const { lang, wording } = useContext(GlobalContext)

  return (
    <Wrapper>
      <Box
        display="flex"
        p="20px 0"
        fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
        fontSize="11px"
        color="var(--black)"
        letterSpacing="0"
        className="breadcrumb"
      >
        <Link to={`/${lang}`}>{wording(lang, "breadcrumb")}</Link>
        {crumbLabel.map((item, index) => {
          if (item.label !== "") {
            return (
              <>
                <Box m="0 8px">
                  <RowLeft />
                </Box>
                {item.url && crumbLabel.length > 1 ? (
                  <Link to={item.url}>{item?.label && parse(item?.label)}</Link>
                ) : (
                  <span>{item?.label && parse(item?.label)}</span>
                )}
              </>
            )
          }
        })}
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  text-transform: none;
  a:first-letter,
  span::first-letter {
    text-transform: uppercase;
  }
`
