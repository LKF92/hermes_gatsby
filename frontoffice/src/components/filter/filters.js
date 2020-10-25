import React, { useContext, useState, useEffect } from "react"
import { GlobalContext } from "../layout"
import { format, fromUnixTime } from "date-fns"
import parse from "html-react-parser"
import { Box, Grid } from "@material-ui/core"
import styled from "styled-components"
import ArrowTop from "../../images/svg/arrowTop.svg"
import Cross from "../../images/svg/cross.svg"
import Collapse from "@material-ui/core/Collapse"
import Chip from "@material-ui/core/Chip"
import InputCheckbox from "../checkBox"
import ButtonShowMore from "./buttonShowMore"
import ButtonDownload from "./buttonDownload"
import Search from "../header/search"
import MyLink from "../myLink"
import { useDocumentsFilter } from "../../data/documentsFilter"
import { useDocumentsCategoriesOLD } from "../../data/documentsCategoriesold"
import { usePages } from "../../data/page"
import { usePagesRse } from "../../data/pageRse"
import moment from "moment-timezone"

console.log("check here")

export default ({
  pageContext,
  filterTitle,
  isPageResearch,
  nameCategory,
  type,
}) => {
  const { lang, wording } = useContext(GlobalContext)

  const nameOfFilter = [
    {
      name: "Informations réglementées",
      document: wording(lang, "PeriodicInformation"),
      evenement: wording(lang, "PermanentInformation"),
    },
    {
      name: "regulated",
      document: wording(lang, "PeriodicInformation"),
      evenement: wording(lang, "PermanentInformation"),
    },
    {
      name: "publications",
      document: wording(lang, "EventLabel"),
      evenement: wording(lang, "TypeLabel"),
    },
    {
      name: "Mandataires sociaux",
      document: wording(lang, "TypeLabel"),
    },
    {
      name: "Corporate officers",
      document: wording(lang, "TypeLabel"),
    },
    {
      name: "Autres informations juridiques",
      document: wording(lang, "TypeLabel"),
    },
    {
      name: "Other legal information",
      document: wording(lang, "TypeLabel"),
    },
  ]
  const [pagination, setPagination] = useState(10)
  const isDevelopmentEnv = process.env.NODE_ENV === "development"

  const paramSearch = "search"
  const [loading, setLoading] = useState(true)
  const data = useDocumentsFilter()
  const dataCategories = useDocumentsCategoriesOLD()
  const dataPage = isPageResearch ? usePages() : ""
  const dataPageRse = isPageResearch ? usePagesRse() : ""
  const hasData = isPageResearch ? true : pageContext

  const nameOfCategoryPage = isPageResearch
    ? wording(lang, "Results")
    : hasData
    ? pageContext[lang]?.length > 0
      ? JSON.parse(pageContext[lang])?.name
      : ""
    : ""

  // itemjs Filtre
  const sortData = data => {
    const dataSorting = data.sort((a, b) => (b.key > a.key ? 1 : -1))
    return dataSorting
  }

  let filterDataCategories = ""
  let filterDataTypeCategories = ""

  if (!isPageResearch) {
    filterDataCategories = dataCategories.filter(
      items =>
        items?.node[lang] &&
        JSON.parse(items?.node[lang]) &&
        JSON.parse(items?.node[lang]).parent
    ) // filtrer les categorie qui ont un prent

    filterDataTypeCategories = dataCategories.filter(
      items =>
        items?.node[lang] &&
        JSON.parse(items?.node[lang]) &&
        !JSON.parse(items?.node[lang]).parent
    ) // filtrer les categorie qui ont un prent
  }

  const namefiltreObject = nameOfFilter.filter(
    item =>
      nameOfCategoryPage.toLowerCase().includes(item.name.toLowerCase()) ===
      true
  )

  let jsonDocument = {
    [lang]: {
      nameCategory: nameOfCategoryPage,
      titleYears: wording(lang, "YearLabel"),
      titleFilter1:
        namefiltreObject.length > 0
          ? namefiltreObject[0].document
            ? namefiltreObject[0].document
            : ""
          : "",
      titleFilter2:
        namefiltreObject.length > 0
          ? namefiltreObject[0].evenement
            ? namefiltreObject[0].evenement
            : ""
          : "",
      items: [],
    },
  }
  let oneFind = true

  const allData = [
    {
      data: data,
      type: "document",
    },
  ]
  if (dataPage !== "") {
    allData.push(
      {
        data: dataPage,
        type: "page",
      },
      {
        data: dataPageRse,
        type: "page",
      }
    )
  }

  hasData &&
    allData.map(dataDoc => {
      const isPageType = dataDoc.type === "page"
      dataDoc.data
        .filter(nodes => {
          return nodes
        })
        .map((nodes, index) => {
          const dataParseNode = nodes.node[lang] && JSON.parse(nodes.node[lang])
          const isTrueStatus =
            nodes.node[lang] && JSON.parse(nodes.node[lang]).status
          let item = {
            isfilter1: !isPageType,
            type: isPageType ? "page" : "document",
            id: isPageType ? nodes.id : nodes.node.id,
            uuid: isPageType ? nodes.uuid : nodes.node.uuid,
            category: nodes.node[lang]
              ? JSON.parse(nodes.node[lang])?.category_id
              : null,
            nameCategory: "",
            nameCategoryArray: [],
            years: [dataParseNode.year ? dataParseNode.year.name : ""],
            filter1: [],
            filter2: [],
            "e-accessible": dataParseNode["e-accessible"],
            link: dataParseNode.link ? dataParseNode.link : "",
            showtime: dataParseNode.showtime ? dataParseNode.showtime : "",
            status: dataParseNode.status,
            name: dataParseNode.title ? dataParseNode.title : "",
            datetime_publication: dataParseNode.datetime_publication
              ? dataParseNode.datetime_publication
              : "",
            showdatetime: dataParseNode.showdatetime
              ? dataParseNode.showdatetime
              : "",
            lng: lang,
            documentType: nodes.node.fr
              ? JSON.parse(nodes.node.fr)?.document?.filetype
              : "",
            documentSize: dataParseNode.document
              ? dataParseNode.document.filesize
              : "",
            documentTitle: dataParseNode.document
              ? dataParseNode.document.title
              : "",
            version: dataParseNode["e-accessible"]
              ? dataParseNode["e-accessible"]
                ? "e-accessible"
                : ""
              : "",
            href: isPageType
              ? dataParseNode.alias
              : dataParseNode.document
              ? dataParseNode.document.file.url
              : "",
            link: dataParseNode.link,
            title: dataParseNode.title,
            description: isPageType ? dataParseNode.introduction : "", /// to do
          }

          // jsonDocument[lang].items.push(item)
          let secondNameFilter = ""
          const idCategory = isPageType
            ? [nodes.node.id]
            : dataParseNode.category_id
          if (!isPageResearch && idCategory && idCategory !== null) {
            /* CURRENT DOCUMENT CATEGORIES */
            idCategory.map(itemId => {
              const thisId = filterDataCategories.filter(
                items => items?.node.id === itemId
              )
              if (!isPageType) {
                /* CURRENT CATEGORY */
                const thisCategory = filterDataCategories.filter(
                  items =>
                    thisId[0] &&
                    items?.node.id ===
                      JSON.parse(thisId[0].node[lang]).parent[0]
                )

                /* CURRENT CATEGORY - PARENT */
                const thisTypeCategory = filterDataTypeCategories.filter(
                  items =>
                    thisCategory[0] &&
                    items?.node.id ===
                      JSON.parse(thisCategory[0].node[lang]).parent[0]
                )

                const thisNameCategory =
                  thisTypeCategory && thisTypeCategory[0]
                    ? JSON.parse(thisTypeCategory[0].node[lang]).name
                    : ""

                item.nameCategory = thisNameCategory

                if (item.nameCategoryArray.indexOf(thisNameCategory) < 0) {
                  item.nameCategoryArray.push(thisNameCategory)
                }

                if (
                  item.nameCategory === nameOfCategoryPage &&
                  !isPageResearch &&
                  oneFind
                ) {
                  secondNameFilter = thisCategory[0]
                    ? JSON.parse(thisCategory[0].node[lang]).name
                    : ""
                  oneFind = false
                }

                // FILTERS
                const filters1 = [
                  "Information périodique",
                  "Periodic information",
                  "Evènement",
                  "Event",
                  "Type de Documents",
                  "Documents",
                ]

                // PUSH FILTERS
                if (
                  thisId[0] &&
                  JSON.parse(thisCategory[0].node[lang]).parent[0] ===
                    pageContext.id &&
                  thisTypeCategory[0]?.node[lang]
                ) {
                  if (
                    filters1.includes(
                      JSON.parse(thisCategory[0].node[lang]).name
                    )
                  ) {
                    item.filter1.push(JSON.parse(thisId[0].node[lang]).name)
                  } else {
                    item.filter2.push(JSON.parse(thisId[0].node[lang]).name)
                  }
                }
              }
            })
          }
          jsonDocument[lang].items.push(item)
        })
    })

  // DATA POUR MODULE DE RECHERCHE AVEC FILTRE
  const currentCatLvl2 = useDocumentsCategoriesOLD()
    .filter(({ node }) => {
      return (
        node[lang] &&
        pageContext &&
        JSON.parse(node[lang]).parent &&
        JSON.parse(node[lang]).parent.includes(pageContext.id) === true
      )
    })
    .map(({ node }) => {
      return node.id
    })
  const currentCatLvl3 = useDocumentsCategoriesOLD()
    .filter(({ node }) => {
      return (
        node[lang] &&
        pageContext &&
        JSON.parse(node[lang]).parent &&
        currentCatLvl2 &&
        currentCatLvl2.filter(ccc => {
          return JSON.parse(node[lang]).parent.includes(ccc)
        }).length > 0
      )
    })
    .map(({ node }) => {
      return node.id
    })

  const currentCategories = [
    ...(pageContext ? [pageContext.id] : []),
    ...(currentCatLvl2?.length > 0 ? currentCatLvl2 : []),
    ...(currentCatLvl3?.length > 0 ? currentCatLvl3 : []),
  ]

  const maxPublicationDate = process.env.GATSBY_PUBLICATION_DATE
    ? fromUnixTime(process.env.GATSBY_PUBLICATION_DATE)
    : fromUnixTime(Math.floor(Date.now() / 1000))

  const dataDocsItems = jsonDocument[lang].items
    .filter(item => {
      // FILTRE ENVIRONNEMENT
      if (process.env.NODE_ENV === "production") {
        if (item.datetime_publication) {
          return (
            parseInt(
              format(new Date(item.datetime_publication), "yyyyMMddHHmmss")
            ) <= parseInt(format(maxPublicationDate, "yyyyMMddHHmmss")) &&
            item?.status === true
          )
        } else {
          return item?.status === true
        }
      } else {
        return item
      }
    })
    .filter(item => {
      if (type === "category") {
        return (
          item.id &&
          item.category &&
          item.category.filter(cat => {
            return (
              currentCategories.length > 0 &&
              currentCategories.includes(cat) === true
            )
          }).length > 0
        )
      } else if (type === "block") {
        return (
          item.id &&
          pageContext &&
          item.category.includes(pageContext.id) === true
        )
      } else {
        return item
      }
    })

  let titleFilter1 = jsonDocument[lang].titleFilter1
  let titleFilter2 = jsonDocument[lang].titleFilter2
  let titleYears = jsonDocument[lang].titleYears

  const configuration = {
    searchableFields: ["title", "years", "filter1", "filter2"],
    sortings: {
      name_asc: {
        field: "title",
        order: "desc",
      },
    },
    aggregations: {
      years: {
        title: titleYears,
        size: 3000,
      },
      filter1: {
        title: titleFilter1,
        size: 3000,
      },
      filter2: {
        title: titleFilter2,
        size: 3000,
      },
    },
  }
  const dataDocuments = require("itemsjs")(dataDocsItems, configuration)
  // get param from path
  const queryString =
    typeof window !== "undefined" ? window.location.search : ""
  const urlParams = new URLSearchParams(queryString)
  const valueParameterPath = urlParams.get(paramSearch)
  const isValueParameterPath =
    valueParameterPath !== null ? valueParameterPath.length > 0 : false

  let dataItems = dataDocuments.search({
    per_page: 10000,
    sort: "title_asc",
    // full text search
    query: valueParameterPath !== null ? valueParameterPath : "",
    filters: {
      years: [],
      filter1: [],
      filter2: [],
    },
  })
  // end itemJs

  const [showNoResultBloc, setShowNoResultBloc] = useState(
    dataItems.data.items.length === 0
  )

  // checkBox state checked
  const [dataFiltred, setDataFiltred] = useState(dataItems.data.items)
  const [lengthDataItems, setLengthDataItems] = useState(dataFiltred.length)
  const [itemsToShow, setItemsToShow] = useState(10)
  const [isVisible, setIsVisible] = useState(lengthDataItems >= 10)

  // state data filters and documents
  const [filter, setFilter] = useState(dataItems.data.aggregations)
  const [documents, setDocuments] = useState(dataFiltred)

  const [listDocuments] = useState([])
  const [listIdDocuments, setListIdDocuments] = useState([])
  const [nbrDocuments, setNbrDocuments] = useState(0)
  const [showBtDownload, setShowBtDownload] = useState(false)

  // function download Documents
  /* Helper function */
  function download_file(fileURL, fileName) {
    if (typeof window !== `undefined`) {
      // for non-IE
      if (!window.ActiveXObject) {
        let save = document.createElement("a")
        save.href = fileURL
        save.target = "_blank"
        const filename = fileURL.substring(fileURL.lastIndexOf("/") + 1)
        save.download = fileName || filename
        if (
          navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) &&
          navigator.userAgent.search("Chrome") < 0
        ) {
          window.open(save.href, "_blank")
          // document.location = save.href;
        } else {
          const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: false,
          })
          save.dispatchEvent(evt)
          ;(window.URL || window.webkitURL).revokeObjectURL(save.href)
        }
      }

      // for IE < 11
      else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(fileURL, "_blank")
        _window.document.close()
        _window.document.execCommand("SaveAs", true, fileName || fileURL)
        _window.close()
      }
    }
  }
  const downloadDocument = () => {
    listDocuments.forEach(path => {
      // window.open(path, '_blank');
      download_file(path, "document")
    })
  }

  // function download Documents
  const selectDocument = event => {
    const labelFilter = event.target.value
    const idCheck = event.target.id
    const isChecked = event.target.checked
    if (isChecked) {
      if (listIdDocuments.indexOf(idCheck) < 0) {
        listIdDocuments.push(idCheck)
        listDocuments.push(labelFilter)
      }
    } else {
      if (listIdDocuments.indexOf(idCheck) > -1) {
        listIdDocuments.splice(listIdDocuments.indexOf(idCheck), 1)
        listDocuments.splice(listDocuments.indexOf(labelFilter), 1)
      }
    }
    setNbrDocuments(listIdDocuments.length)
    setShowBtDownload(listIdDocuments.length > 0)
  }

  // function unselect Documents
  const UnSelectAll = () => {
    const items = document.getElementsByName("acs")
    for (let i = 0; i < items.length; i++) {
      if (items[i].type === "checkbox") {
        items[i].checked = false
      }
    }
  }

  // state data filter category
  const [state] = useState({
    yearId: [],
    documentId: [],
    eventId: [],
  })
  const { yearId, documentId, eventId } = state

  // value of input search
  // Initialize it on the URI's query value, if available
  const [querySearch, setQuerySearch] = useState(null)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setQuerySearch(
        window.location.href.includes("search=")
          ? decodeURI(window.location.href.split("search=")[1])
          : ""
      )
    }
    setLoading(false)
  }, [])
  // function onchange checkBox filters
  const handleChange = event => {
    const labelFilter = event.target ? event.target.title : event.title
    const id = event.target ? event.target.id : event.id
    const typeInput = event.target ? event.target.type : event.type
    const searchMode = typeInput === "text"
    const constValueInput = event ? event.value : querySearch

    if (constValueInput) setQuerySearch(constValueInput)
    // initialise nbr of PDF and unSelect all checkbox
    listDocuments.splice(0, listDocuments.length) // initialise BR of PDF to download
    setNbrDocuments(listDocuments.length) // set 0 for nbr
    setListIdDocuments([])
    setShowBtDownload(false)
    UnSelectAll() // unSelect all checkbox of documents
    switch (labelFilter) {
      case "years":
        const indexOfyearId = yearId.indexOf(id)
        indexOfyearId < 0 ? yearId.push(id) : yearId.splice(indexOfyearId, 1)
        break
      case "filter1":
        const indexOfdocumentId = documentId.indexOf(id)
        indexOfdocumentId < 0
          ? documentId.push(id)
          : documentId.splice(indexOfdocumentId, 1)
        break
      case "filter2":
        const indexOfEventId = eventId.indexOf(id)
        indexOfEventId < 0
          ? eventId.push(id)
          : eventId.splice(indexOfEventId, 1)
        break
      default:
        console.log("Sorry, we are out of title")
    }

    const dataItemsFiltred = dataDocuments.search({
      per_page: 10000,
      sort: "name_asc",
      // full text search
      query: searchMode ? constValueInput : querySearch,
      filters: {
        years: yearId,
        filter1: documentId,
        filter2: eventId,
      },
    })
    // setCount(dataItemsFiltred.data.items.length) // parent var
    setFilter(dataItemsFiltred.data.aggregations)
    setDataFiltred(dataItemsFiltred.data.items)
    setLengthDataItems(dataItemsFiltred.data.items.length)
    //setDocuments(dataItemsFiltred.data.items.slice(0, itemsToShow))
    if (dataItemsFiltred.data.items.length <= itemsToShow) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
    setShowNoResultBloc(dataItemsFiltred.data.items.length === 0)
  }

  // initialise state check of checkbox filters
  const [checked, setChecked] = useState(false)
  const [checkedYear, setCheckedYear] = useState(true)
  const [checkedDocument, setCheckedDocument] = useState(true)
  const [checkedEvent, setCheckedEvent] = useState(true)

  // show bloc all filter
  const showFilters = () => {
    setChecked(prev => !prev)
  }
  // show bloc year filter
  const showFiltersYears = () => {
    setCheckedYear(prev => !prev)
  }
  // show bloc documents filter
  const showFiltersDocument = () => {
    setCheckedDocument(prev => !prev)
  }
  // show bloc events filter
  const showFiltersEvent = () => {
    setCheckedEvent(prev => !prev)
  }

  // // gere la navigation filter
  // const onFocus = () => {
  //   setChecked(true)
  // }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQuerySearch(
        window.location.href.includes("search=")
          ? decodeURI(window.location.href.split("search=")[1])
          : ""
      )
    }
    setLoading(false)
  }, [])

  if (!loading && hasData) {
    return (
      <Wrapper>
        {isPageResearch && (
          <Box>
            {showNoResultBloc && (
              <Box
                display={"flex"}
                alignItems="center"
                flexDirection={"column"}
                mt={"100px "}
              >
                <Box
                  component={"h2"}
                  textAlign={"center"}
                  fontFamily="Courier New"
                  fontSize={{ xs: "40px" }}
                  lineHeight={{ xs: "46px" }}
                >
                  {wording(lang, "noResult")}
                </Box>

                <Box
                  component={"p"}
                  mt={"30px"}
                  textAlign={"center"}
                  fontFamily="Courier New"
                  fontSize={{ xs: "18px" }}
                  lineHeight={{ xs: "26px" }}
                  maxWidth={{ xs: "100%" }}
                >
                  {wording(lang, "noResultContext")}
                </Box>
              </Box>
            )}

            <Box className="navbarForm">
              <Search
                searchFilter={true}
                searchClick={handleChange}
                idInput={"searchDocs"}
                valuePath={
                  valueParameterPath !== null ? valueParameterPath : ""
                }
                isValueParameterPath={isValueParameterPath}
              />
            </Box>
          </Box>
        )}

        {!showNoResultBloc && (
          <>
            {/*header Filters*/}
            <Box
              component={Grid}
              container
              direction="row"
              alignItems="center"
              pb={{ xs: "0", sm: "0", md: "40px" }}
              className={"containerTitle"}
            >
              <Grid container item xs={12} md={9} justify="flex-start">
                <Box
                  className={"title"}
                  textAlign={{ xs: "left", sm: "left", md: "left" }}
                  mb={{ xs: "30px", sm: "40px", md: "0" }}
                >
                  <Box
                    component="h2"
                    color={"val(--black)"}
                    fontSize={{ xs: "22px", sm: "24px", md: "32px" }}
                    lineHeight={{ xs: "28px", sm: "28px", md: "36px" }}
                    display={"inline"}
                  >
                    {isPageResearch ? wording(lang, "Results") : "Documents"}
                  </Box>
                  <Box
                    component={"span"}
                    display={"inline"}
                    color={"val(--black)"}
                    fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
                    fontSize={"18px"}
                    lineHeight={"28px"}
                    ml={"10px"}
                  >
                    ( {lengthDataItems} )
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container justify="flex-end" direction={"column"}>
                  <Box
                    component="button"
                    aria-expanded={checked}
                    color={"val(--black)"}
                    fontFamily={"Orator W01"}
                    fontSize={"18px"}
                    lineHeight={"24px"}
                    textAlign={{ xs: "left", md: "right" }}
                    onClick={showFilters}
                    className={"openFilters"}
                    p={{ xs: "27px 24px", sm: "27px 40px", md: "0" }}
                    bgcolor={{
                      xs: "var(--beige2)",
                      sm: "var(--beige2)",
                      md: "transparent",
                    }}
                    display="flex"
                    alignItems="center"
                  >
                    <Box
                      flexGrow={1}
                      textAlign={{ xs: "left", sm: "left", md: "right" }}
                    >
                      {wording(lang, "FiltersLabel")}
                    </Box>
                    <Box
                      className={`rowFilters ${checked ? "open" : "close"}`}
                      width={"10px"}
                      m={"0 auto 0 10px"}
                    >
                      <Box
                        className={"rowSvg"}
                        display={{ xs: "none", sm: "none", md: "inline" }}
                      >
                        <ArrowTop />
                      </Box>
                      <Box
                        display={{ xs: "block", sm: "block", md: "none" }}
                        className={"crossSvg"}
                      >
                        <Cross />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    component={"hr"}
                    role="presentation"
                    display={{ xs: "block", sm: "block", md: "none" }}
                    p={{ xs: "0", sm: "0", md: "0" }}
                    position={{
                      xs: "relative",
                      sm: "relative",
                      md: "relative",
                    }}
                    borderBottom={{
                      xs: "1px solid var(--grey)",
                      sm: "1px solid var(--grey)",
                      ms: "0",
                    }}
                    borderTop={{ xs: "0", sm: "0", md: "0" }}
                    m={{
                      xs: "-1px 24px 0 24px",
                      sm: "-1px 40px 0 40px",
                      md: "0",
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/*body filters*/}
            <Collapse in={checked}>
              <Box
                bgcolor="var(--beige2)"
                className={"containerFilters"}
                p={{
                  xs: "20px 24px",
                  sm: "27px 40px 30px 40px",
                  md: "70px 98px",
                }}
                mb={"50px"}
              >
                <Grid container direction="row" alignItems="flex-start">
                  {Object.keys(filter).map(function (key, index) {
                    const item = filter[key]
                    let collapseMethod = showFiltersYears
                    let collapseChecked = checkedYear
                    switch (key) {
                      case "filter1":
                        collapseMethod = showFiltersDocument
                        collapseChecked = checkedDocument
                        break
                      case "filter2":
                        collapseMethod = showFiltersEvent
                        collapseChecked = checkedEvent
                        break
                      default:
                        console.log("")
                    }
                    return (
                      <Grid
                        key={index}
                        item
                        xs={12}
                        md={4}
                        container
                        direction="column"
                        alignItems="flex-start"
                      >
                        {item.buckets.length > 0 && (
                          <Box
                            component="button"
                            fontFamily="'Orator W01', Calibri, serif"
                            color="var(--black)"
                            fontSize={{ xs: "18px", sm: "18px", md: "22px" }}
                            width={{ xs: "100%", sm: "100%", md: "auto" }}
                            lineHeight={{
                              xs: "24px",
                              sm: "24px",
                              md: "28px",
                            }}
                            pr={{ xs: "0", sm: "0", md: "20px" }}
                            mt={"0px"}
                            mb={"21px"}
                            pb={"17px"}
                            borderBottom={"1px solid var(--grey)"}
                            display={"flex"}
                            justifyContent="space-between"
                            onClick={collapseMethod}
                            aria-expanded={collapseChecked}
                          >
                            <Box textAlign="left" width="100%">
                              {item.title}
                            </Box>
                            <Box
                              className={`rowFilters ${
                                collapseChecked ? "open" : "close"
                              }`}
                              component={"span"}
                              width={"10px"}
                              height={"5px"}
                              ml={"10px"}
                              mb={"2px"}
                              flexShrink={0}
                              display={{
                                xs: "inline",
                                sm: "inline",
                                md: "none",
                              }}
                            >
                              <Box className={"rowSvg"}>
                                <ArrowTop />
                              </Box>
                            </Box>
                          </Box>
                        )}
                        <Collapse
                          in={collapseChecked}
                          className={"collapse"}
                          width={{ xs: "100%", sm: "100%", md: "auto" }}
                        >
                          <Box
                            className={"blocFilters"}
                            maxWidth={{ xs: "100%", sm: "100%", md: "292px" }}
                            width={{ xs: "100%", sm: "100%" }}
                            borderBottom={{
                              xs: "1px solid var(--grey)",
                              sm: "1px solid var(--grey)",
                              md: "0",
                            }}
                            mb={{ xs: "20px", sm: "20px", md: "0" }}
                          >
                            {sortData(item.buckets).map((item, index) => {
                              return (
                                <Box
                                  className={`${
                                    item.stateDisabled ? "hidden" : ""
                                  } row`}
                                  key={item.id}
                                  mb={"20px"}
                                >
                                  <InputCheckbox
                                    labelName={item.key && parse(item.key)}
                                    count={item.doc_count}
                                    id={item.key}
                                    active={item.selected}
                                    label={key}
                                    event={handleChange}
                                  />
                                </Box>
                              )
                            })}
                          </Box>
                        </Collapse>
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
            </Collapse>

            {/* DOCUMENTS LIST */}
            <Box
              component={Grid}
              container
              direction="column"
              alignItems="center"
              pb={"100px"}
              mb={"100px"}
              bgcolor="var(--beige2)"
              position={"relative"}
            >
              <Box width="100%">
                {dataFiltred
                  .sort((a, b) => {
                    // Check if date exists
                    if (b.datetime_publication && !a.datetime_publication)
                      return 1
                    if (a.datetime_publication && !b.datetime_publication)
                      return -1
                    // Sort by date
                    if (b.datetime_publication > a.datetime_publication)
                      return 1
                    if (a.datetime_publication > b.datetime_publication)
                      return -1
                    return 0
                  })
                  .slice(0, pagination)
                  .map((item, index) => {
                    const docTime = parseInt(
                      moment
                        .utc(item.datetime_publication)
                        .tz("Europe/Paris")
                        .format("YYYYMMDDHHmmss")
                    )
                    const now = parseInt(
                      moment.utc().tz("Europe/Paris").format("YYYYMMDDHHmmss")
                    )

                    const isFuture = docTime > now

                    return (
                      <Box
                        className={"blocDocument"}
                        xs={12}
                        key={index}
                        p={{
                          xs: "26px 30px 0",
                          sm: "30px 40px",
                          md: "40px 98px 0 98px",
                        }}
                      >
                        <Box
                          className={"blocDocumentInfo"}
                          textAlign={{ xs: "left" }}
                          borderBottom={"1px solid rgb(68, 68, 68, 0.1)"}
                          borderopacity={"0.1"}
                          pr={"0"}
                          pb={"30px"}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          flexDirection={"row"}
                        >
                          {/* isDocumentType n'existe pas donc voir 2ème résultats */}
                          {item.isDocumentType ? (
                            <Box
                              component={
                                item.href !== "" && item.href !== "/"
                                  ? "a"
                                  : "div"
                              }
                              flexGrow={1}
                              href={item.href}
                              rel="noreferrer"
                              target={
                                item.href !== "" && item.href !== "/"
                                  ? "_blank"
                                  : ""
                              }
                              className={"description"}
                              width={{ xs: "100%", sm: "100%", md: "auto" }}
                              pr={{ xs: "43px", sm: "43px", md: "0" }}
                              // id={node.id}
                              position={"relative"}
                            >
                              {isPageResearch && (
                                <Box
                                  className={"documentStatus"}
                                  component={"h2"}
                                  color="var(--black)"
                                  fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
                                  fontSize={{
                                    xs: "12px",
                                    sm: "12px",
                                    md: "12px",
                                  }}
                                  lineHeight={{
                                    xs: "16px",
                                    sm: "16px",
                                    md: "16px",
                                  }}
                                  letterSpacing={"1"}
                                  mb={{ xs: "7px", sm: "7px", md: "5px" }}
                                >
                                  {item.type}
                                </Box>
                              )}

                              <Box
                                component={isPageResearch ? "h3" : "h2"}
                                color="var(--black)"
                                fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
                                fontSize={{
                                  xs: "15px",
                                  sm: "15px",
                                  md: "18px",
                                }}
                                lineHeight={{
                                  xs: "20px",
                                  sm: "20px",
                                  md: "28px",
                                }}
                                fontWeight={{ xs: "500", sm: "500" }}
                                pr={{ xs: "0", sm: "0", md: "40px" }}
                                mt={{ xs: "0", sm: "0", md: "0" }}
                                mb={{ xs: "16px", sm: "16px", md: "0" }}
                                letterSpacing={"0"}
                              >
                                {item?.title ? parse(item.title) : ""}
                              </Box>
                              <Box
                                color="var(--black)"
                                fontFamily={"Courier New"}
                                fontSize={{
                                  xs: "12px",
                                  sm: "12px",
                                  md: "14px",
                                }}
                                lineHeight={{
                                  xs: "16px",
                                  sm: "16px",
                                  md: "20px",
                                }}
                                mt={{ xs: "16px", sm: "15px", md: "5px" }}
                              >
                                {item.datetime_publication &&
                                item.showdatetime === true
                                  ? item.showtime === true
                                    ? moment
                                        .utc(item.datetime_publication)
                                        .tz("Europe/Paris")
                                        .format(
                                          lang === "fr"
                                            ? "DD.MM.YYYY HH:mm"
                                            : "MM.DD.YYYY hh:mm A"
                                        )
                                    : moment
                                        .utc(item.datetime_publication)
                                        .tz("Europe/Paris")
                                        .format(
                                          lang === "fr"
                                            ? "DD.MM.YYYY"
                                            : "MM.DD.YYYY"
                                        )
                                  : null}{" "}
                                {item.documentType ||
                                item.documentSize ||
                                item.version
                                  ? `(${item.documentType}${
                                      item.documentType ? ", " : ""
                                    }${item.documentSize}${
                                      item.version &&
                                      item.documentWeight === "PDF"
                                        ? ", "
                                        : ""
                                    }${item.version})`
                                  : null}
                              </Box>
                              {isPageResearch &&
                                item.description != "" &&
                                item.description !== null && (
                                  <Box
                                    color="var(--black)"
                                    fontFamily={"Courier New"}
                                    fontSize={{
                                      xs: "12px",
                                      sm: "12px",
                                      md: "14px",
                                    }}
                                    lineHeight={{
                                      xs: "16px",
                                      sm: "16px",
                                      md: "20px",
                                    }}
                                    mt={{
                                      xs: "16px",
                                      sm: "15px",
                                      md: "20px",
                                    }}
                                    letterSpacing={"0"}
                                  >
                                    {item?.description
                                      ? parse(item.description)
                                      : ""}
                                  </Box>
                                )}
                              {isDevelopmentEnv ? (
                                <Box
                                  css={`
                                    .MuiChip-root {
                                      margin: 10px 10px 0 0;
                                    }
                                  `}
                                >
                                  {!item.status ? (
                                    <Chip
                                      label={wording(lang, "Status")}
                                      className={"chipIcon"}
                                      color="secondary"
                                    />
                                  ) : null}
                                  {item.datetime_publication && isFuture && (
                                    <Chip
                                      label={wording(lang, "futurPublication")}
                                      className={"chipIcon"}
                                      color="secondary"
                                    />
                                  )}
                                </Box>
                              ) : null}
                            </Box>
                          ) : (
                            // HERE = 2ème résultat
                            <a
                              className={`description  ${
                                (item.href === "" || item.href === "/") &&
                                !item.link
                                  ? "stopEvent"
                                  : ""
                              }`}
                              position={"relative"}
                              href={
                                item.type === "document"
                                  ? item.link?.url
                                    ? item.link.url
                                    : item.href
                                  : `/${lang}${item.href}`
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              {isPageResearch && (
                                <Box
                                  className={"documentStatus"}
                                  component={"h2"}
                                  color="var(--black)"
                                  fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
                                  fontSize={{
                                    xs: "12px",
                                    sm: "12px",
                                    md: "12px",
                                  }}
                                  lineHeight={{
                                    xs: "16px",
                                    sm: "16px",
                                    md: "16px",
                                  }}
                                  letterSpacing={"1"}
                                  mb={{ xs: "7px", sm: "7px", md: "5px" }}
                                >
                                  {item.type}
                                </Box>
                              )}

                              <Box
                                component={isPageResearch ? "h3" : "h2"}
                                color="var(--black)"
                                fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
                                fontSize={{
                                  xs: "15px",
                                  sm: "15px",
                                  md: "18px",
                                }}
                                lineHeight={{
                                  xs: "20px",
                                  sm: "20px",
                                  md: "28px",
                                }}
                                fontWeight={{ xs: "500", sm: "500" }}
                                pr={{ xs: "0", sm: "0", md: "40px" }}
                                mt={{ xs: "0", sm: "0", md: "0" }}
                                mb={{ xs: "16px", sm: "16px", md: "0" }}
                                letterSpacing={"0"}
                              >
                                {item?.title ? parse(item.title) : ""}
                              </Box>
                              <Box
                                color="var(--black)"
                                fontFamily={"Courier New"}
                                fontSize={{
                                  xs: "12px",
                                  sm: "12px",
                                  md: "14px",
                                }}
                                lineHeight={{
                                  xs: "16px",
                                  sm: "16px",
                                  md: "20px",
                                }}
                                mt={{ xs: "16px", sm: "15px", md: "5px" }}
                              >
                                {item.datetime_publication
                                  ? item.showtime === true
                                    ? moment
                                        .utc(item.datetime_publication)
                                        .tz("Europe/Paris")
                                        .format(
                                          lang === "fr"
                                            ? "DD.MM.YYYY HH:mm"
                                            : "MM.DD.YYYY hh:mm A"
                                        )
                                    : moment
                                        .utc(item.datetime_publication)
                                        .tz("Europe/Paris")
                                        .format(
                                          lang === "fr"
                                            ? "DD.MM.YYYY"
                                            : "MM.DD.YYYY"
                                        )
                                  : null}
                                {item.documentType ||
                                item.documentSize ||
                                item.version
                                  ? `(${
                                      item.documentType
                                        ? item.documentType + ", "
                                        : ""
                                    }${
                                      item.documentSize
                                        ? item.documentSize +
                                          (item.version ? ", " : "")
                                        : ""
                                    }${item.version ? item.version : ""})`
                                  : null}
                                {/*({item.documentType},*/}
                                {/*{item.documentSize})*/}
                              </Box>
                              {isPageResearch &&
                                item.description != "" &&
                                item.description !== null && (
                                  <Box
                                    color="var(--black)"
                                    fontFamily={"Courier New"}
                                    fontSize={{
                                      xs: "12px",
                                      sm: "12px",
                                      md: "14px",
                                    }}
                                    lineHeight={{
                                      xs: "16px",
                                      sm: "16px",
                                      md: "20px",
                                    }}
                                    mt={{
                                      xs: "16px",
                                      sm: "15px",
                                      md: "20px",
                                    }}
                                    letterSpacing={"0"}
                                  >
                                    {item?.description
                                      ? parse(item.description)
                                      : ""}
                                  </Box>
                                )}
                              {isDevelopmentEnv ? (
                                <Box
                                  css={`
                                    .MuiChip-root {
                                      margin: 10px 10px 0 0;
                                    }
                                  `}
                                >
                                  {!item.status ? (
                                    <Chip
                                      className="chipIcon"
                                      label={wording(lang, "Status")}
                                      color="secondary"
                                    />
                                  ) : null}
                                  {item.datetime_publication && isFuture && (
                                    <Chip
                                      className="chipIcon"
                                      label={wording(lang, "futurPublication")}
                                      color="secondary"
                                    />
                                  )}
                                </Box>
                              ) : null}
                            </a>
                          )}
                          <Box>
                            {item.documentSize?.length > 0 &&
                            item.href?.length > 0 ? (
                              <InputCheckbox
                                labelName={item?.title ? parse(item.title) : ""}
                                nameInput={"acs"}
                                count={""}
                                id={item.id}
                                label={""}
                                hideLabel={true}
                                dataHref={item.href}
                                event={selectDocument}
                              />
                            ) : null}
                          </Box>
                        </Box>
                      </Box>
                    )
                  })}
                {showBtDownload && (
                  <ButtonDownload
                    event={downloadDocument}
                    nbrSelectedDocuments={nbrDocuments}
                  />
                )}
              </Box>
              {pagination < Math.ceil(dataFiltred.length / 10) * 10 && (
                <Box mt={"80px"}>
                  <ButtonShowMore
                    event={() => {
                      setPagination(pagination + 10)
                    }}
                  />
                </Box>
              )}
            </Box>
          </>
        )}
      </Wrapper>
    )
  } else {
    return null
  }
}

const Wrapper = styled(Box)`
  .chipIcon {
    background-color: var(--chip);
  }
  .stopEvent {
    pointer-events: none;
  }
  .openFilters,
  .filters {
    cursor: pointer;
  }
  .rowFilters {
    svg {
      transition-duration: 0.5s;
      transition-property: transform;
    }
    &.close {
      .rowSvg {
        svg {
          transform: rotate(180deg);
        }
      }
      .crossSvg {
        svg {
          transform: rotate(135deg);
        }
      }
    }
  }

  .blocDocument {
    &:hover {
      background: "var(--beige2)";

      .blocDocumentInfo {
        border-color: "var(--beige2)";
      }
    }
  }

  .documentStatus {
    text-transform: uppercase;
  }

  @media (max-width: 960px) {
    .noBorder {
      border-bottom: none;
    }
  }
`
