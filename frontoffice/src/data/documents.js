import { useStaticQuery, graphql } from "gatsby"
export const useDocuments = () => {
  const data = useStaticQuery(
    graphql`
      query documentsQuery {
        allDocument {
          nodes {
            en
            fr
            id
            uuid
            type
          }
        }
      }
    `
  )
  return data.allDocument.nodes.map(node => {
    return {
      ...node,
      en: node.en ? JSON.parse(node.en) : null,
      fr: node.fr ? JSON.parse(node.fr) : null,
    }
  })
}
