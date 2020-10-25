import { useStaticQuery, graphql } from "gatsby"
export const usePages = () => {
  const data = useStaticQuery(
    graphql`
      query pageQuery {
        allPage {
          edges {
            node {
              id
              uuid
              en
              fr
            }
          }
        }
      }
    `
  )
  return data.allPage.edges
}
