import React, { useEffect } from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Breadcrumb from "../../src/components/breadcrumb"
import Block01 from "../components/blocks/block01"
import Block02 from "../components/blocks/block02"
import Block03 from "../components/blocks/block03"
import Block04 from "../components/blocks/block04"
import Block06 from "../components/blocks/block06"
import Block07 from "../components/blocks/block07"
import Block08 from "../components/blocks/block08"
import Block11 from "../components/blocks/block11"
import Block13 from "../components/blocks/block13"
import Block15 from "../components/blocks/block15"
import Block16 from "../components/blocks/block16"
import Block19 from "../components/blocks/block19"
import Block22 from "../components/blocks/block22"
import Agenda from "../components/blocks/agenda"
import LActionHermes from "../components/blocks/actionHermes"
import ListOfDocuments from "../components/listOfDocuments/index"
import parse from "html-react-parser"

export default ({ pageContext }) => {
  const { title, allMenuFr, allMenuEn, lang } = pageContext
  const allMenu = lang === "fr" ? allMenuFr : allMenuEn
  const pageData = pageContext[lang]
  const blocks = pageData ? pageData?.body : null
  const categories = [
    "publications",
    "regulated_information",
    "other_legal_information",
    "officers",
    "the_shareholder_world",
    "general_assembly",
    "homepageRse",
  ]

  //----- BREADCRUMB -----\\
  // For pages that are not RSE
  // get the title from the submenu (= subMenu item), corresponding to the current page
  const listItem = allMenu
    ? allMenu.filter(item => title === item[lang]?.title)
    : []

  // get the id of the parent (= one of the menu item )
  const parentID =
    listItem.length > 0
      ? listItem[0][lang]?.parent
        ? listItem[0][lang]?.parent.split(":")[1]
        : null
      : null

  const parentItem = allMenu
    ? allMenu.filter(item => item?.uuid === parentID)
    : []

  const breadcrumbParent =
    parentItem.length > 0 ? parentItem[0][lang].title : ""

  // For RSE pages
  const parentItemRSE = allMenu
    ? allMenu.filter(
        item =>
          (lang === "fr" && item?.id === "17") ||
          (lang === "en" && item?.id === "83")
      )[0]
    : []

  const breadcrumbParentRSE = {
    label: parentItemRSE ? parentItemRSE[lang]?.title : "",
    url: parentItemRSE ? parentItemRSE[lang]?.link?.url : "",
  }

  const breadCrumbRSE =
    pageContext.pageType === "rse"
      ? [breadcrumbParentRSE, { label: title, url: "" }]
      : [breadcrumbParentRSE]

  const crumbLabel =
    pageContext.pageType === "rse" || pageContext.pageType === "homepageRse"
      ? breadCrumbRSE
      : [
          {
            label: breadcrumbParent,
            url: "",
          },
          { label: title, url: "" },
        ]

  useEffect(() => {
    if (typeof window !== "undefined") {
      let page_type = ""
      if (pageContext.pageType === "rse") {
        page_type = "RSE"
      } else if (breadcrumbParent?.length > 0) {
        const typeName = {
          Governance: "Gouvernance",
          Investors: "Investisseurs",
        }
        page_type =
          typeName[breadcrumbParent]?.length > 0
            ? typeName[breadcrumbParent]
            : breadcrumbParent
      } else {
        page_type = pageContext.title && parse(pageContext.title)
      }

      /* GTM */
      window.dataLayer.push({
        event: "pageview",
        page_type,
        page_language: lang,
      })

      /* REDIRECTS SSR */
      if (
        process.env.NODE_ENV === "development" &&
        window.location.pathname.includes(`/${lang}/`) === false
      ) {
        navigate(`/${lang}${window.location.pathname}`)
      }
    }
  }, [])

  //=======================>   CONSOLE.LOG  <=======================\\
  console.log("pageContext", pageContext)

  return (
    <Layout pageContext={pageContext} lang={lang}>
      <SEO
        title={pageData?.meta_tag?.title ? parse(pageData.meta_tag.title) : ""}
        description={
          pageData?.meta_tag?.description
            ? parse(pageData.meta_tag.description)
            : ""
        }
        lang={lang}
      />
      <Breadcrumb crumbLabel={crumbLabel} />
      {pageData && <Block01 data={pageData} />}

      {/* Display iframe for Hermès Exchange Rate page */}
      {pageData?.type === "action" && <LActionHermes />}

      {/* BLOCKS */}
      {blocks &&
        blocks.map((block, index) => {
          let blockType = block?.bundle?.slice(0, 3)

          // Detect if there's several B16, B7 or B3 one after the other,
          // to have no margin between those blocks
          const nextBlock = blocks[index + 1]?.bundle?.slice(0, 3)
          let noMarginBottom = false
          if (blockType === "b07" && nextBlock === "b07") {
            noMarginBottom = true
          }
          if (blockType === "b03" && nextBlock === "b03") {
            noMarginBottom = true
          }

          const blocksResolver = {
            b02: <Block02 data={block} key={index} />,
            b03: (
              <Block03
                data={block}
                key={index}
                noMarginBottom={noMarginBottom}
              />
            ),
            b04: <Block04 data={block} key={index} />,
            b07: (
              <Block07
                data={block}
                key={index}
                noMarginBottom={noMarginBottom}
              />
            ),
            b08: <Block08 data={block} key={index} />,
            b11: <Block11 data={block} key={index} />,
            b16: <Block16 data={block} key={index} />,
            b19: <Block19 data={block} key={index} />,
            b22: <Block22 data={block} key={index} />,
            b13: <Block13 data={block} key={index} />,
            b06: <Block06 data={block} key={index} />,
          }
          return blockType ? blocksResolver[blockType] : null
        })}

      {/* AGENDA */}
      {pageData?.type === "agenda" && (
        <Agenda pageContext={pageContext[lang]} />
      )}

      {/* CONTACT */}
      {pageData?.type === "contact" && <Block15 />}

      {/* CATEGORIES */}
      {pageContext?.pageType && categories.includes(pageContext?.pageType) ? (
        <ListOfDocuments
          lang={lang}
          pageContext={pageContext}
          pageType={pageContext?.pageType}
        />
      ) : null}
    </Layout>
  )
}
