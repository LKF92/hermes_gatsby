import { useStaticQuery, graphql } from "gatsby"
export const useTermsOfServices = () => {
  const data = useStaticQuery(
    graphql`
      query getTermdsOfServices {
        allPage(filter: { drupalType: { eq: "terms_of_service" } }) {
          nodes {
            id
            fr
            en
            type
            uuid
          }
        }
      }
    `
  )
  return data
}
