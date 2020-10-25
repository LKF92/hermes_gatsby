import React from "react"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import parse from "html-react-parser"
export default function ({ data }) {
  return (
    <Block01
      component="section"
      className="wysiwyg"
      ml={{ xs: "-16px", sm: "-69px", md: "-113px" }}
      mr={{ xs: "-16px", sm: "-69px", md: "-113px" }}
    >
      <Box flexDirection="column" display="flex" alignItems="center">
        {data?.background?.url[0].url && (
          <Image
            component="figure"
            width="100%"
            boxSizing="border-box"
            m={{ xs: "0 -16px 40px" }}
          >
            <Box
              component={"img"}
              width={"100%"}
              m={"0 auto"}
              src={data?.background?.url[0].url}
              alt={data?.background?.url[0]?.alt}
            />
          </Image>
        )}
        <Content
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          p={{ xs: "0", sm: "55px 75px 0", md: "65px 98px 0" }}
          mt={{
            xs: "0",
            sm: `${data?.background ? "-48px" : "0"}`,
            md: `${data?.background ? "-168px" : "0"}`,
          }}
          bgcolor="var(--beige3)"
          boxSizing="border-box"
          width={{ xs: "100%", sm: "630px", md: "1140px" }}
        >
          <Box
            component="h2"
            width={{ sm: "630px", md: "670px" }}
            mb={{ xs: "10px", sm: "0", md: "10px" }}
            p={{ xs: "0 16px", sm: "0", md: "0" }}
          >
            {data?.title ? parse(data?.title) : null}
          </Box>
          {data?.introduction && (
            <Box
              component="p"
              mt={{ xs: "0", sm: "20px", md: "30px" }}
              p={{ xs: "0 20px", sm: "0", md: "0" }}
              fontSize={{ xs: "16px", md: "18px" }}
              lineHeight={{ xs: "26px", md: "26px" }}
              maxWidth={{ xs: "100%", sm: "480px", md: "748px" }}
            >
              {data?.introduction ? parse(data?.introduction) : null}
            </Box>
          )}
        </Content>
      </Box>
    </Block01>
  )
}
const Block01 = styled(Box)`
  justify-content: center;
`
const Image = styled(Box)`
  img {
    object-fit: contain;
  }
`
const Content = styled(Box)`
  h2 {
    font-size: 32px;
    line-height: 36px;
    @media (min-width: 960px) {
      font-size: 40px;
      line-height: 46px;
    }
  }
`
