import { useStaticQuery, graphql } from "gatsby"

export const useFooter = () => {
  const stringData = useStaticQuery(
    graphql`
      query getFooter {
        allMenuFooter {
          nodes {
            id
            uuid
            fr
          }
        }
      }
    `
  )
  const data = stringData.allMenuFooter.nodes.map(node => {
    return {
      ...node,
      fr: node.fr ? JSON.parse(node.fr) : null,
    }
  })
  const sortedFooterData = data.sort(
    (node1, node2) => node1.fr?.weight - node2.fr?.weight
  )

  return sortedFooterData
}
