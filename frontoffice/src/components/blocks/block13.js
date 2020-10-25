import React, { useContext } from "react"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import ButtonCTA from "../buttonCTA"
import MyLink from "../myLink"
import moment from "moment-timezone"
import "moment/locale/fr"
import parse from "html-react-parser"
import { useAgendas } from "../../data/agenda"
import { useDocuments } from "../../data/documents"

export default ({ data }) => {
  const { lang } = useContext(GlobalContext)
  const allAgendas = useAgendas()
  const allDocuments = useDocuments()

  // We get the ids of the agendas and/or documents that we need to retrieve
  const elementsToRetrieve = [
    { ...data.item_left },
    { ...data.item_right },
  ].reduce((arr, item) => {
    if (item.bundle === "document_promote") {
      for (const document of allDocuments) {
        if (document && document.id === item.document_id) {
          arr.push(document[lang])
          return arr
        }
      }
      arr.push({ document: null })
      return arr
    } else if (item.bundle === "agenda_promote") {
      for (const agenda of allAgendas) {
        if (agenda && agenda.id === item.agenda_id) {
          arr.push(agenda[lang])
          return arr
        }
      }
      arr.push({ agenda: null })
      return arr
    }
  }, [])

  // We need to create an attribute "content" so we don't overwrite some attribute like title
  const contentList = [
    { ...data?.item_left, content: elementsToRetrieve[0] },
    { ...data?.item_right, content: elementsToRetrieve[1] },
  ]

  return (
    <Box component="section">
      <Block13 display={{ sm: "flex" }} flexWrap="wrap">
        {contentList.map((block, index) => {
          // We format the timestamp received here for better readability
          // and create the event object for the addEvent widget
          const event = {}
          if (block?.content?.datetime) {
            moment.locale(lang === "fr" ? "fr" : "en")
            // DATE
            event.startTime = moment
              .utc(block?.content?.datetime)
              .tz("Europe/Paris")
              .format()

            event.endTime = moment
              .utc(block?.content?.datetime)
              .tz("Europe/Paris")
              .add(60, "minutes")
              .format()
            // MONTH
            event.month = moment
              .utc(block?.content?.datetime)
              .tz("Europe/Paris")
              .format("MMMM")
            event.month =
              event.month.length > 4
                ? `${event.month.slice(0, 3)}.`
                : event.month
            // DAY
            event.day = moment
              .utc(block?.content?.datetime)
              .tz("Europe/Paris")
              .format(lang === "fr" ? "DD.MM.YYYY" : "MM.DD.YYYY")
            // TIME
            event.time = moment
              .utc(block?.content?.datetime)
              .tz("Europe/Paris")
              .format(lang === "fr" ? "HH:mm" : "HH.mma")
            // TIMEZONE
            event.timezone = moment.tz("Europe/Paris").format("z")
            event.title = parse(block?.content?.title)
          }

          return (
            <Box
              width={{ xs: "100%", sm: "50%" }}
              mb={{ xs: "30px", sm: "36px" }}
            >
              <Block
                height={{ xs: "570px", sm: "520px", md: "585px" }}
                boxSizing="border-box"
                bgcolor="var(--floralWhite)"
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
                  alignItems="center"
                >
                  {/* The block is either a calendar  */}
                  {block.bundle === "agenda_promote" ? (
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
                  ) : // Or it is a document
                  block.bundle === "document_promote" ? (
                    <Document component="figure" m="0">
                      <Box
                        component="img"
                        src={block.background?.url[0].url}
                        alt={block.background?.url[0].alt}
                        height={{ xs: "180px", sm: "147px", md: "180px" }}
                        width={{ xs: "275px", sm: "230px", md: "275px" }}
                      />
                      <Box
                        component="figcaption"
                        textAlign="center"
                        fontFamily="Courier New"
                        lineHeight="20px"
                        fontSize="14px"
                        mt={{ xs: "14px", sm: "24px", md: "14px" }}
                      >
                        {block?.text_before_title
                          ? parse(block.text_before_title)
                          : null}
                      </Box>
                    </Document>
                  ) : null}
                  <Box
                    component="h3"
                    className="title"
                    margin="0"
                    maxWidth={{
                      xs: "210px",
                      sm: `${
                        block.bundle === "agenda_promote" ? "210px" : "240px"
                      }`,
                      md: `${
                        block.bundle === "agenda_promote" ? "250px" : "450px"
                      }`,
                    }}
                    textAlign="center"
                    fontFamily="Orator W01"
                  >
                    {/* The document title to display is in the first level, 
                        for agenda it's nested one level deeper */}
                    {block?.title
                      ? parse(block?.title)
                      : block?.content?.title
                      ? parse(block?.content?.title)
                      : null}
                  </Box>
                  {/* Texte sous titre */}
                  {block.bundle === "document_promote" && (
                    <Box
                      component="p"
                      margin="0"
                      maxWidth={{
                        xs: "210px",
                        sm: `${
                          block.bundle === "agenda_promote" ? "210px" : "240px"
                        }`,
                        md: `${
                          block.bundle === "agenda_promote" ? "250px" : "450px"
                        }`,
                      }}
                      textAlign="center"
                    >
                      {block?.text_sub_title
                        ? parse(block.text_sub_title)
                        : null}
                    </Box>
                  )}
                  <Box width="100%" mt={{ xs: "30px", sm: "20px", md: "34px" }}>
                    <ButtonCTA
                      type={
                        block.bundle === "agenda_promote"
                          ? "calendar"
                          : block.bundle === "document_promote"
                          ? "document"
                          : null
                      }
                      eventDetails={
                        block.bundle === "agenda_promote" ? event : null
                      }
                      file={
                        block.bundle === "document_promote"
                          ? block?.content?.document
                          : null
                      }
                    />
                  </Box>
                  <Box mt={{ xs: "25px", sm: "25px", md: "24px" }}>
                    <MyLink
                      classStyle="underlinedLink nohover"
                      url={block?.link?.url}
                      text={block?.link?.title}
                      external={block?.link?.attributes?.external}
                      target={block?.link?.attributes?.attributes?.target}
                    />
                  </Box>
                </InnerContent>
              </Block>
            </Box>
          )
        })}
      </Block13>
    </Box>
  )
}

const Block13 = styled(Box)``
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
const Document = styled(Box)`
  img {
    display: block;
    object-fit: contain;
  }
`
