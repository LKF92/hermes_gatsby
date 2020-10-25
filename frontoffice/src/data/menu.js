import { useStaticQuery, graphql } from "gatsby"
export const useMenu = () => {
  const strData = useStaticQuery(
    graphql`
      query menu {
        allMenuPrincipal {
          nodes {
            fr
            uuid
            id
          }
        }
      }
    `
  )
  const data = strData.allMenuPrincipal.nodes.map(node => {
    return {
      ...node,
      fr: node.fr ? JSON.parse(node.fr) : null,
    }
  })
  const sortedData = data.sort(
    (node1, node2) => node1.fr?.weight - node2.fr?.weight
  )

  return sortedData
}
