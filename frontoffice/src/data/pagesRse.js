import { useStaticQuery, graphql } from "gatsby"
export const usePagesRse = () => {
  const stringData = useStaticQuery(
    graphql`
      query getPagesRse {
        allPageRse {
          nodes {
            fr
            en
            uuid
            id
          }
        }
      }
    `
  )
  const data = stringData.allPageRse.nodes.map(node => {
    return {
      ...node,
      en: node.en ? JSON.parse(node.en) : null,
      fr: node.fr ? JSON.parse(node.fr) : null,
    }
  })

  return data
}
