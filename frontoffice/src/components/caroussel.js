import React from "react"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import SubSection from "./header/subSection"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function Caroussel({ data }) {
  const settings = {
    className: "columns",
    dots: true,
    infinite: true,
    speed: 500,
    swipeToSlide: true,
    slidesToShow: 3,

    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <StyledSlider {...settings}>
      {data.map((column, index) => (
        <Column
          key={index}
          index={index}
          className="columns"
          m={{
            xs: index === 1 ? "0 15px" : null,
            sm: index === 1 ? "0 20px" : null,
            md: index === 1 ? "0 36px" : null,
          }}
        >
          <Image
            height={{ xs: "180px", md: "200px" }}
            width={{ xs: "320px", md: "356px" }}
          >
            <img src={column.image.url} />
          </Image>
          <Box p="30px" minHeight={{ xs: "473px", md: "425px" }}>
            <Title component="h3" mb={{ xs: "25px", md: "22px" }}>
              {column.title}
            </Title>
            <List>
              {column.listItems.map((listItem, index) => (
                <Box mb="15px">
                  <SubSection
                    text={listItem.text}
                    url={listItem.url}
                    key={index}
                  />
                </Box>
              ))}
            </List>
          </Box>
        </Column>
      ))}
    </StyledSlider>
  )
}

const StyledSlider = styled(Slider)`
  .columns {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--floralWhite);

    width: 320px !important;
    @media (min-width: 960px) {
      width: 356px !important;
    }
  }
  .slick-slide {
    object-fit: cover;
    img {
      width: 100%;
      height: 100%;
    }
  }
`
const Column = styled(Box)``
const Image = styled(Box)`
  object-fit: cover;
  img {
    width: 100%;
  }
`
const Title = styled(Box)``
const List = styled(Box)``
