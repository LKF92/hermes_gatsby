import React, { useState } from "react"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import ListItem from "../listItem"
import Slider from "react-slick"
import parse from "html-react-parser"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function ({ data }) {
  const { pillar_one, pillar_two, pillar_three } = data
  const allPillars = [{ ...pillar_one }, { ...pillar_two }, { ...pillar_three }]

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    swipeToSlide: true,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1060,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    customPaging: i => (
      <button>
        <span className="visually-hidden">{`slide ${1 + i}`}</span>
      </button>
    ),
  }

  return (
    <Block08 component="section">
      <Slider {...settings}>
        {allPillars.map(({ image, title, link }, slideIndex) => (
          <Column key={slideIndex}>
            <Image height={{ xs: "180px", md: "200px" }} width="100%">
              <img src={image?.url[0].url} alt={image?.url[0]?.alt} />
            </Image>
            <Box p="30px" height={{ xs: "475px", md: "425px" }}>
              <Title component="h3" mb={{ xs: "25px", md: "22px" }}>
                {title && parse(title)}
              </Title>
              <List component="ul">
                {link?.map((listItem, index) => {
                  return (
                    <Box mb="15px" component="li">
                      {listItem && (
                        <ListItem
                          text={listItem?.title}
                          url={listItem?.url}
                          key={index}
                          isDocument={link?.type === "document"}
                          external={listItem?.attributes?.external}
                          target={listItem?.attributes?.attributes?.target}
                          lowercase
                        />
                      )}
                    </Box>
                  )
                })}
              </List>
            </Box>
          </Column>
        ))}
      </Slider>
    </Block08>
  )
}

const Block08 = styled(Box)`
  /* clip the left side only so we only keep the right overflow */
  clip-path: inset(0% -18px -30px 0%);
  @media (min-width: 600px) {
    clip-path: inset(0% -69px -30px 0%);
  }

  .slick-slider {
  }
  .slick-list {
    /* Break the padding on the right side to show the beggining of the next slide */
    overflow: visible;
  }
  .slick-track {
  }

  .slick-slide {
    /* width = slick-track width / 3 */
  }
  .slick-arrow {
    display: none !important;
  }
`

const Column = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--floralWhite);

  width: 95% !important;
  @media (min-width: 960px) {
    width: 356px !important;
  }
`
const Image = styled(Box)`
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`
const Title = styled(Box)``
const List = styled(Box)`
  ul {
    list-style: none;
    margin: 0;
    padding-inline-start: 0px;
  }
  li {
    list-style: none;
  }
`
