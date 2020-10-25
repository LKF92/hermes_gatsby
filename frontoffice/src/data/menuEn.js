import { useStaticQuery, graphql } from "gatsby"
export const useMenuEn = () => {
  const strData = useStaticQuery(
    graphql`
      query menuEn {
        allMenuPrincipalEn {
          nodes {
            en
            uuid
            id
          }
        }
      }
    `
  )
  const data = strData.allMenuPrincipalEn.nodes.map(node => {
    return {
      ...node,
      en: node.en ? JSON.parse(node.en) : null,
    }
  })
  const sortedData = data.sort(
    (node1, node2) => node1.en?.weight - node2.en?.weight
  )

  return sortedData
}
