import React, { useEffect, useContext } from "react"
import { Link } from "gatsby"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import Checkbox from "../myCheckbox"
import Chip from "@material-ui/core/Chip"
import moment from "moment-timezone"
import parse from "html-react-parser"

export default function ({
  document,
  type,
  documentsToDownload,
  setDocumentsToDownload,
  setNbrSelectedDocuments,
  pageType,
  isLastItem,
}) {
  const { lang, wording } = useContext(GlobalContext)
  const { datetime_publication, showdatetime, showtime } = document
  const fileType = document?.document?.filetype
  const fileSize = document?.document?.filesize
  const eAccessible = document["e-accessible"]
  const dateANDtime =
    datetime_publication && showdatetime
      ? showtime
        ? moment
            .utc(datetime_publication)
            .tz("Europe/Paris")
            .format(
              lang === "fr" ? "DD.MM.YYYY - HH:mm" : "MM.DD.YYYY - hh:mm A"
            )
        : moment
            .utc(datetime_publication)
            .tz("Europe/Paris")
            .format(lang === "fr" ? "DD.MM.YYYY" : "MM.DD.YYYY")
      : null
  const documentMetaData =
    fileType || fileSize || eAccessible
      ? `(${fileType ? fileType : ""}${fileType && fileSize ? ", " : ""}${
          fileSize ? fileSize : ""
        }${
          eAccessible
            ? fileType === "PDF"
              ? ", e-accessible"
              : "e-accessible"
            : ""
        })`
      : null

  const docTime = parseInt(
    moment.utc(datetime_publication).tz("Europe/Paris").format("YYYYMMDDHHmmss")
  )
  const now = parseInt(moment.utc().tz("Europe/Paris").format("YYYYMMDDHHmmss"))
  const isPublicationFuture = docTime > now

  const handleClickDocument = e => {
    const fileUrl = document.document.file.url
    const fileName = document.document.title
    const temp = [...documentsToDownload]
    // Add to the list of documents to download
    if (e.target.checked) {
      temp.push({ fileUrl, fileName })
      setDocumentsToDownload(temp)
      setNbrSelectedDocuments(prev => prev + 1)

      // or remove the document from it
    } else {
      temp.filter(
        doc =>
          doc.fileUrl !== document.fileUrl && doc.fileName !== document.fileName
      )
      setDocumentsToDownload(temp)
      setNbrSelectedDocuments(prev => prev - 1)
    }
  }
  return (
    <Document
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dataLayer.push({
            event: "interaction",
            e_category: "document",
            e_action: "telechargement",
            e_label: document?.title,
          })
        }
      }}
    >
      <div className="main-info">
        <a
          className="document"
          href={
            type === "document"
              ? document?.document?.file?.url
              : `${
                  lang === "en" && !document.alias.includes("/en/") ? "/en" : ""
                }/${lang}${document.alias.toLowerCase()}`
          }
          target="_blank"
          rel="noreferrer"
        >
          {pageType === "searchResults" && (
            <div className="document-type">{type}</div>
          )}
          <div className="document-title">
            {document?.title ? parse(document.title) : ""}
          </div>
          <div className="document-meta-data">
            {type === "document" ? (
              <span>
                {dateANDtime} {documentMetaData}
              </span>
            ) : (
              <span>
                {document?.mate_tag?.description
                  ? parse(document.mate_tag.description)
                  : ""}
              </span>
            )}
          </div>
        </a>
        {document.document && (
          <div className="checkbox">
            <label>
              <Checkbox
                id={`${document?.document?.title}_${datetime_publication}`}
                title={document?.document?.title}
                name={document?.document?.title}
                value={document?.document?.file?.url}
                handleClickDocument={handleClickDocument}
              />
            </label>
          </div>
        )}
      </div>
      {/****** LIVE PREVIEW  ******/}
      {process.env.NODE_ENV === "development" &&
        (!document.status || isPublicationFuture) && (
          <div className="mui-chip">
            {/****** The publication is not published yet ******/}
            {!document.status && (
              <Chip
                label={wording(lang, "Status")}
                className="chipIcon"
                color="secondary"
              />
            )}
            {/****** The publication is programmed for a future date ******/}
            {isPublicationFuture && (
              <Chip
                label={wording(lang, "futurPublication")}
                className={"chipIcon"}
                color="secondary"
              />
            )}
          </div>
        )}
      {!isLastItem && <hr role="presentation" />}
    </Document>
  )
}

const Document = styled.div`
  background: var(--floralWhite);
  &:hover {
    background: var(--beige2);
  }
  padding: 30px 30px 0 30px;
  @media (min-width: 600px) {
    padding: 30px 40px 0;
  }
  @media (min-width: 960px) {
    padding: 40px 118px 0 98px;
  }

  .main-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30px;
  }

  .document-type {
    color: var(--black);
    font-family: Helvetica, "Helvetica W01", Arial, sans-serif;
    text-transform: uppercase;
    letter-spacing: 1;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 6px;
  }

  .document-title {
    flex: 1;
    margin-bottom: 15px;
    font-size: 15px;
    line-height: 20px;
    max-width: 215px;
    @media (min-width: 600px) {
      max-width: 480px;
    }
    @media (min-width: 960px) {
      margin-bottom: 5px;
      font-size: 18px;
      line-height: 28px;
      max-width: 700px;
    }
  }

  .document-meta-data {
    font-family: "Courier New", Calibri, serif;
    font-size: 12px;
    line-height: 16px;
    @media (min-width: 960px) {
      font-size: 14px;
      line-height: 20px;
    }
  }

  .checkbox {
  }

  hr {
    border: 0;
    margin: 0;
    width: 100%;
    border-top: 1px solid var(--grey);
  }

  .mui-chip {
    padding: 0 0 30px;
    .chipIcon {
      margin-right: 10px;
      background-color: var(--chip);
    }
  }
`
