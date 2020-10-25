import { useStaticQuery, graphql } from "gatsby"
export const useDocumentsCategories = () => {
  const data = useStaticQuery(
    graphql`
      query documentsCategoriesQuery {
        allDocumentCategories {
          nodes {
            id
            fr
            en
          }
        }
      }
    `
  )
  return data.allDocumentCategories.nodes.map(node => {
    return {
      ...node,
      en: node.en ? JSON.parse(node.en) : null,
      fr: node.fr ? JSON.parse(node.fr) : null,
    }
  })
}
