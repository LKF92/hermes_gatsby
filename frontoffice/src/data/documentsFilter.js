import { useStaticQuery, graphql } from "gatsby"
export const useDocumentsFilter = () => {
  const data = useStaticQuery(
    graphql`
      query documentsQueryAndDocumentsQuery {
        allDocument {
          edges {
            node {
              id
              uuid
              fr
              en
            }
          }
        }
      }
    `
  )
  return data.allDocument.edges
}
