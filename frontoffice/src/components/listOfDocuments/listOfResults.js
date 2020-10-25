import React, { useState, useEffect, useContext } from "react"
// import axios from "axios"
import styled from "styled-components"
import { GlobalContext } from "../layout"
import Document from "./document"
import DownloadButton from "./buttonDownload"
import ShowMoreButton from "./buttonShowMore"
import multiDownload from "multi-download"

export default function ({ listOfResults, pageType }) {
  const { lang, wording } = useContext(GlobalContext)
  const [documentsToDownload, setDocumentsToDownload] = useState([])
  const [nbrSelectedDocuments, setNbrSelectedDocuments] = useState(0)
  const [pagination, setPagination] = useState(10)

  const handleDownload = () => {
    // DOWNLOAD AUTOMATICALLY
    const files = documentsToDownload.map(doc => doc.fileUrl)
    multiDownload(files, {
      rename: ({ url, index, urls }) =>
        documentsToDownload[index]?.fileName || "Hermès",
    })
    // OPEN IN NEW TABS
    // documentsToDownload.map(documentToDL => {
    //   console.log(documentToDL)
    //   if (typeof window !== `undefined`) {
    //     // for non-IE
    //     if (!window.ActiveXObject) {
    //       let save = document.createElement("a")
    //       save.href = documentToDL.fileUrl
    //       save.target = "_blank"
    //       const filename = documentToDL.fileUrl.substring(
    //         documentToDL.fileUrl.lastIndexOf("/") + 1
    //       )
    //       save.download = documentToDL.documentfileName || filename
    //       if (
    //         navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) &&
    //         navigator.userAgent.search("Chrome") < 0
    //       ) {
    //         window.open(save.href, "_blank")
    //         // document.location = save.href;
    //       } else {
    //         const evt = new MouseEvent("click", {
    //           view: window,
    //           bubbles: true,
    //           cancelable: false,
    //         })
    //         save.dispatchEvent(evt)
    //         ;(window.URL || window.webkitURL).revokeObjectURL(save.href)
    //       }
    //     }

    //     // for IE < 11
    //     else if (!!window.ActiveXObject && document.execCommand) {
    //       var _window = window.open(documentToDL.fileUrl, "_blank")
    //       _window.document.close()
    //       _window.document.execCommand(
    //         "SaveAs",
    //         true,
    //         documentToDL.documentfileName || documentToDL.fileUrl
    //       )
    //       _window.close()
    //     }
    //   }
    // })
  }

  // 'listOfResults' can have both documents or pages that need to be displayed from most recent to oldest
  const sortedResults = listOfResults.sort((a, b) => {
    // Check if date exists
    if (b[lang].datetime_publication && !a[lang].datetime_publication) return 1
    if (a[lang].datetime_publication && !b[lang].datetime_publication) return -1
    // Sort by date
    if (b[lang].datetime_publication > a[lang].datetime_publication) return 1
    if (a[lang].datetime_publication > b[lang].datetime_publication) return -1
    return 0
  })
  if (sortedResults.length > 0) {
    return (
      <ListOfResults>
        {sortedResults.slice(0, pagination).map((document, index, array) => {
          return (
            <Document
              key={index}
              document={document[lang]}
              lang={lang}
              documentsToDownload={documentsToDownload}
              setDocumentsToDownload={setDocumentsToDownload}
              setNbrSelectedDocuments={setNbrSelectedDocuments}
              type={document.type === "document" ? "document" : "page"}
              pageType={pageType}
              isLastItem={index === array.length - 1}
            />
          )
        })}
        {nbrSelectedDocuments > 0 && (
          <DownloadButton
            nbrSelectedDocuments={nbrSelectedDocuments}
            event={handleDownload}
          />
        )}
        {pagination < listOfResults.length && (
          <div className="show-more">
            <ShowMoreButton event={() => setPagination(pagination + 10)} />
          </div>
        )}
      </ListOfResults>
    )
  }
}

const ListOfResults = styled.div`
  margin-bottom: 100px;
  .show-more {
    width: 100%;
    button {
      margin: 80px auto;
    }
  }
`
