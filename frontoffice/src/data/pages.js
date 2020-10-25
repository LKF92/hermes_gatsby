import { useStaticQuery, graphql } from "gatsby"
export const usePages = () => {
  const stringData = useStaticQuery(
    graphql`
      query getPages {
        allPage {
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
  const data = stringData.allPage.nodes.map(node => {
    return {
      ...node,
      en: node.en ? JSON.parse(node.en) : null,
      fr: node.fr ? JSON.parse(node.fr) : null,
    }
  })

  return data
}
