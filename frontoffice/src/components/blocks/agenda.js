import React, { useContext, useState } from "react"
import { GlobalContext } from "../../components/layout"
import styled from "styled-components"
import { useAgendas } from "../../data/agenda"
import { Box } from "@material-ui/core"
import ButtonCTA from "../buttonCTA"
import MyLink from "../myLink"
import ButtonShowMore from "../filter/buttonShowMore"
import moment from "moment-timezone"
import "moment/locale/fr"
import parse from "html-react-parser"

export default () => {
  const { lang } = useContext(GlobalContext)
  const [showMore, setShowMore] = useState(false)
  const allAgendas = useAgendas()
    .map(agenda => agenda[lang])
    .filter(agenda => agenda)
    .sort((a, b) => {
      const dateTimeA = a.datetime
      const dateTimeB = b.datetime

      // Check if date exists
      if (dateTimeA && dateTimeB) {
        // Sort by date
        if (dateTimeA > dateTimeB) return -1
        if (dateTimeA < dateTimeB) return 1
        // If date is equal
        return 0
      }

      // If one date doesn't exist
      if (dateTimeA && !dateTimeB) return -1
      if (!dateTimeA && dateTimeB) return 1
      return 0
    })

  return (
    <>
      <ListOfAgenda>
        <Box display={{ sm: "flex" }} flexWrap="wrap">
          {allAgendas.map((block, index) => {
            // We format the timestamp received here for better readability
            // and create the event object for the addEvent widget
            const event = {}
            if (block?.datetime) {
              moment.locale(lang === "fr" ? "fr" : "en")
              // MONTH
              event.month = moment
                .utc(block?.datetime)
                .tz("Europe/Paris")
                .format("MMMM")
              event.month =
                event.month.length > 4
                  ? `${event.month.slice(0, 3)}.`
                  : event.month
              // DAY
              event.day = moment
                .utc(block?.datetime)
                .tz("Europe/Paris")
                .format(lang === "fr" ? "DD.MM.YYYY" : "MM.DD.YYYY")
              // TIME
              event.time = moment
                .utc(block?.datetime)
                .tz("Europe/Paris")
                .format(lang === "fr" ? "HH:mm" : "HH.mma")
              // TIMEZONE
              event.timezone = moment.tz("Europe/Paris").format("z")
              event.title = parse(block?.title)
            }

            if (index <= 5 || showMore)
              return (
                <Box
                  width={{ xs: "100%", sm: "50%" }}
                  mb={{ xs: "30px", sm: "36px" }}
                >
                  <Block
                    bgcolor="var(--floralWhite)"
                    height={{ xs: "515px", sm: "414px", md: "552px" }}
                    boxSizing="border-box"
                    // Add margin left or right depending on the block number
                    mr={{
                      xs: "0",
                      sm: index === 0 || index % 2 === 0 ? "18px" : 0,
                    }}
                    ml={{
                      xs: "0",
                      sm: index === 1 || index % 2 !== 0 ? "18px" : 0,
                    }}
                    p={{
                      xs: "40px 24px",
                      sm: "35px 20px 41px",
                      md: "55px 98px 60px ",
                    }}
                  >
                    <InnerContent
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Calendar
                        bgcolor="var(--beige3)"
                        p={{
                          xs: "49px 25px",
                          sm: "32px 25px",
                          md: "30px 24px 20px",
                        }}
                        mb={{ xs: "30px", sm: "25px", md: "44px" }}
                        height={{ xs: "205px", sm: "176px", md: "180px" }}
                        width={{ xs: "205px", sm: "205px", md: "180px" }}
                        textAlign="center"
                      >
                        <Box
                          component="h2"
                          className="capitalize"
                          color="var(--orange2)"
                          m={{ xs: "0 0 12px", md: "0 0 13px" }}
                          fontSize={{ md: "40px" }}
                          lineHeight={{ md: "46px" }}
                        >
                          {event.month}
                        </Box>
                        <Box
                          component="p"
                          m={{ xs: "0 0 12px", md: "0 0 17px" }}
                          fontSize={{ md: "22px" }}
                          fontFamily="Orator W01"
                          lineHeight={{ md: "28px" }}
                        >
                          <time>{event.day}</time>
                        </Box>
                        <Box
                          component="p"
                          m="0"
                          fontFamily="Courier New"
                          fontSize={{ md: "16px" }}
                          lineHeight={{ md: "26px" }}
                        >
                          <time>{`${event.time}  ${event.timezone}`}</time>
                        </Box>
                      </Calendar>
                      <Box
                        component="h3"
                        margin="0"
                        className="title"
                        maxWidth={{
                          xs: "210px",
                          md: "250px",
                        }}
                        textAlign="center"
                        fontFamily="Orator W01"
                      >
                        {block?.title ? parse(block?.title) : null}
                      </Box>
                      <Box
                        width="100%"
                        m={{
                          xs: "30px 0",
                          sm: "20px 0",
                          md: "34px 0 24px",
                        }}
                      >
                        <ButtonCTA type="calendar" eventDetails={event} />
                      </Box>
                      <MyLink
                        classStyle="underlinedLink nohover"
                        url={block?.link?.url}
                        text={block?.link?.title}
                        external={block?.link?.attributes?.external}
                        target={block?.link?.attributes?.attributes?.target}
                        aria={event.title}
                      />
                    </InnerContent>
                  </Block>
                </Box>
              )
          })}
        </Box>
      </ListOfAgenda>
      {!showMore && allAgendas.length > 6 && (
        <Box
          display="flex"
          justifyContent="center"
          m={{ xs: "40px 60px", sm: "50px 60px", md: "80px 100px" }}
        >
          <ButtonShowMore event={() => setShowMore(true)} />
        </Box>
      )}
    </>
  )
}
const ListOfAgenda = styled(Box)``
const Block = styled(Box)`
  .title {
    overflow-wrap: break-word;
  }
`
const InnerContent = styled(Box)``
const Calendar = styled(Box)`
  .capitalize {
    text-transform: capitalize;
  }
`
