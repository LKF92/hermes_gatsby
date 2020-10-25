import React, { useContext } from "react"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import MyLink from "../myLink"
import parse from "html-react-parser"

export default ({ data }) => {
  const { lang, wording } = useContext(GlobalContext)
  const { group_key_number, link, title } = data

  return (
    <Block11
      component="section"
      className="light-background"
      p={{ xs: "40px 0", sm: "60px 0", md: "70px 0" }}
      bgcolor="var(--floralWhite)"
    >
      {title && (
        <Title
          className="centered"
          mb={{ xs: "50px", sm: "60px", md: "50px" }}
          p={{ xs: "0 20px", sm: "0 60px", md: "0 100px" }}
        >
          {title ? parse(title) : null}
        </Title>
      )}
      <Box
        mb={{ xs: "40px", sm: "60px", md: "70px" }}
        display="flex"
        flexWrap="wrap"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "center", sm: "flex-start" }}
        justifyContent="center"
      >
        {group_key_number &&
          group_key_number.map((keyNumber, index, array) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-evenly"
              width={{ xs: "100%", sm: "50%", md: "33%" }}
              mb={{
                xs: index < array.length - 1 ? "58px" : 0,
                sm: "41px",
                md: "0",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="154px"
                width="154px"
              >
                <Box
                  component="img"
                  src={keyNumber?.pictogram?.url[0].url}
                  alt={keyNumber?.pictogram?.url[0]?.alt}
                  // role="presentation"
                />
              </Box>
              <Box
                mb={{ xs: "12px", sm: "14px", md: "12px" }}
                fontSize={{ xs: "47px", md: "55px" }}
                lineHeight={{ xs: "60px", md: "72px" }}
                fontFamily="Orator W01"
                color="var(--orange)"
                textAlign="center"
                maxWidth={{ xs: "300px", sm: "222px", md: "260px" }}
              >
                {keyNumber?.key_number ? parse(keyNumber.key_number) : null}
              </Box>
              <Box
                component="p"
                textAlign="center"
                maxWidth={{ xs: "300px", sm: "222px", md: "260px" }}
              >
                {keyNumber?.key_number ? parse(keyNumber.description) : null}
              </Box>
            </Box>
          ))}
      </Box>
      <Box className="centered">
        <MyLink
          classStyle="underlinedLink nohover"
          url={link?.url}
          text={link?.title || wording(lang, "findMore")}
          external={link?.attributes?.external}
          target={link?.attributes?.attributes?.target}
        />
      </Box>
    </Block11>
  )
}

const Block11 = styled(Box)`
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`
// Force the <p> received from the BO to display as a <h2>
const Title = styled(Box)`
  color: var(--black);
  font-weight: normal;
  text-align: center;

  p {
    font-family: "Orator W01", Calibri, serif;
    font-size: 24px;
    line-height: 28px;
  }
  @media (min-width: 960px) {
    p {
      font-family: "Orator W01", Calibri, serif;
      font-size: 32px;
      line-height: 36px;
    }
  }
  p::first-letter {
    text-transform: capitalize;
  }
`
