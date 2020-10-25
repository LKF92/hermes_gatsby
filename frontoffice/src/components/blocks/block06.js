import React, { useContext } from "react"
import { GlobalContext } from "../layout"
import { Link } from "gatsby"
import styled from "styled-components"
import { Box } from "@material-ui/core"
import ExternalLink from "../../images/svg/externalLink.svg"
import { format, fromUnixTime } from "date-fns"
import { useDocuments } from "../../data/documents"
import { useDocumentsCategories } from "../../data/documentsCategories"
import parse from "html-react-parser"
import moment from "moment-timezone"

export default () => {
  const { lang, wording } = useContext(GlobalContext)
  const documents = useDocuments()
  const documentsCategories = useDocumentsCategories()

  const checkIfPressRelease = categoryIDs => {
    const checkCategories = categoryIDs?.filter(categoryID => {
      // Check if one of the categories of the document is a Press Release
      return (
        documentsCategories.filter(
          node =>
            categoryID === node?.id &&
            node[lang] &&
            node[lang].thematic === "press_release"
        ).length > 0
      )
    })
    return checkCategories?.length > 0 ? true : false
  }

  const maxPublicationDate = process.env.GATSBY_PUBLICATION_DATE
    ? moment
        .utc(fromUnixTime(process.env.GATSBY_PUBLICATION_DATE))
        .tz("Europe/Paris")
    : moment.utc(new Date()).tz("Europe/Paris")

  // We get the last 3 documents, sorted by datetime publication
  const sortedDocuments = documents
    .filter(document => {
      if (document[lang]?.category_id?.length > 0) {
        const isPressRelease = checkIfPressRelease(document[lang].category_id)
        // FILTRE ENVIRONNEMENT
        if (process.env.NODE_ENV === "production") {
          // Filter documents that are not published yet
          if (document[lang].datetime_publication) {
            return (
              isPressRelease &&
              moment
                .utc(document[lang].datetime_publication)
                .tz("Europe/Paris")
                .format("YYYYMMDDHHmmss") <=
                moment(maxPublicationDate).format("YYYYMMDDHHmmss") &&
              document[lang]?.status === true
            )
          } else {
            return isPressRelease && document[lang]?.status === true
          }
        } else {
          return isPressRelease
        }
      }
    })
    .sort((a, b) => {
      const dateTimeA = a[lang]?.datetime_publication
      const dateTimeB = b[lang]?.datetime_publication

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
    .slice(0, 3)

  return (
    <Block06
      component="section"
      p={{ xs: "60px 40px 70px", sm: "60px 60px 60px", md: "50px 98px 70px" }}
      bgcolor="var(--floralWhite)"
      className="light-background"
    >
      <Box
        component="h2"
        textAlign="center"
        mb={{ xs: "40px", sm: "60px", md: "70px" }}
      >
        {wording(lang, "PressReleases")}
      </Box>
      {sortedDocuments.map((node, index) => {
        const { document, title, datetime_publication } = node[lang]

        const date = {}
        if (datetime_publication) {
          const newDate = new Date(datetime_publication)
          date.day = format(
            newDate,
            lang === "fr" ? "dd.MM.yyyy" : "MM.dd.yyyy"
          )
          date.time = format(newDate, lang === "fr" ? "HH:mm" : "HH.mmaaaa")
        }
        return (
          <>
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              width="100%"
            >
              <Box>
                <a href={document?.file.url} target="_blank" rel="noreferrer">
                  <Box
                    component="h4"
                    aria-level="3"
                    fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
                    fontSize={{ xs: "15px", md: "18px" }}
                    lineHeight={{ xs: "20px", md: "28px" }}
                    width="100%"
                    textAlign="left"
                    mb={{ xs: "14px", md: "5px" }}
                  >
                    {title && parse(title)}
                  </Box>
                </a>
                <Box
                  fontFamily="Courier New"
                  fontSize={{ xs: "12px", md: "14px" }}
                  lineHeight={{ xs: "16px", md: "20px" }}
                >
                  <Box component="span">{date.day}</Box>
                  <Box component="span"> - </Box>
                  <Box component="span">{date.time}</Box>
                  <Box component="span" ml="5px">
                    {document &&
                      `(${document?.filetype}, ${document?.filesize})`}
                  </Box>
                </Box>
              </Box>
              <Box
                bgcolor="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p="12px"
                border="1px solid var(--darkGrey)"
                borderRadius="50%"
              >
                <a target="_blank" rel="noreferrer" href={document?.file.url}>
                  <span className="visually-hidden">
                    {title ? parse(title) : ""}
                  </span>
                  <ExternalLink />
                </a>
              </Box>
            </Box>
            {index < sortedDocuments.length - 1 && (
              <Box
                component="hr"
                m={{
                  xs: "9px 15px 30px 0",
                  sm: "40px 0 40px",
                  md: "32px 0 32px",
                }}
                border="1px solid var(--beige)"
                borderBottom={0}
                title="delimitation between document"
              ></Box>
            )}
          </>
        )
      })}
      <Link to={`/${lang}/publications?type=19`} className="nohover">
        <Box
          component="p"
          mt={{ xs: "40px", sm: "60px", md: "70Px" }}
          width={{ xs: "287px", sm: "320px", md: "356px" }}
          p="18px 0"
          textAlign="center"
          border="1px solid var(--darkGrey)"
          borderRadius="5px"
          bgcolor="var(--white)"
        >
          {wording(lang, "AllPressReleases")}
        </Box>
      </Link>
    </Block06>
  )
}
const Block06 = styled(Box)`
  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
