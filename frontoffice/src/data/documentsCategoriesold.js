import { useStaticQuery, graphql } from "gatsby"
export const useDocumentsCategoriesOLD = () => {
  const data = useStaticQuery(
    graphql`
      query documentsCategoriesQueryOLD {
        allDocumentCategories {
          edges {
            node {
              id
              fr
              en
            }
          }
        }
      }
    `
  )
  return data.allDocumentCategories.edges
}
