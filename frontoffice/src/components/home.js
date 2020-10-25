import React from "react"
import parse from "html-react-parser"
import Layout from "./layout"
import SEO from "./seo"
import { usePages } from "../data/pages"
import { useAgendas } from "../data/agenda"
import { useDocuments } from "../data/documents"
import Block02 from "./blocks/block02"
import Block03 from "./blocks/block03"
import Block04 from "./blocks/block04"
import Block06 from "./blocks/block06"
import Block07 from "./blocks/block07"
import Block08 from "./blocks/block08"
import Block11 from "./blocks/block11"
import Block13 from "./blocks/block13"
import Block16 from "./blocks/block16"
import Block19 from "./blocks/block19"
import Block22 from "./blocks/block22"

export default ({ lang }) => {
  const allPage = usePages()
  const homepageData = allPage.filter(page => {
    return page[lang]?.type === "homepage"
  })[0]
  const blocks = homepageData ? homepageData[lang]?.body : null
  return (
    <Layout lang={lang}>
      <SEO
        title={
          homepageData && homepageData[lang]?.meta_tag?.title
            ? parse(homepageData[lang]?.meta_tag.title)
            : "Hermès Finance"
        }
        description={
          homepageData && homepageData[lang]?.meta_tag?.description
            ? parse(homepageData[lang]?.meta_tag.description)
            : "Hermès Finance"
        }
        lang={lang}
      />
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
    </Layout>
  )
}
