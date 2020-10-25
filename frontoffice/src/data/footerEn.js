import { useStaticQuery, graphql } from "gatsby"

export const useFooterEn = () => {
  const stringData = useStaticQuery(
    graphql`
      query getFooterEn {
        allMenuFooterEn {
          nodes {
            id
            uuid
            en
          }
        }
      }
    `
  )
  const data = stringData.allMenuFooterEn.nodes.map(node => {
    return {
      ...node,
      en: node.en ? JSON.parse(node.en) : null,
    }
  })
  const sortedFooterData = data.sort(
    (node1, node2) => node1.en?.weight - node2.en?.weight
  )

  return sortedFooterData
}
