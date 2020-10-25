import { useStaticQuery, graphql } from "gatsby"
export const usePagesRse = () => {
  const data = useStaticQuery(
    graphql`
      query pageRseQuery {
        allPageRse {
          edges {
            node {
              fr
              en
              id
              uuid
            }
          }
        }
      }
    `
  )
  return data.allPageRse.edges
}
