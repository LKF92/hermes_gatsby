import { useStaticQuery, graphql } from "gatsby"
export const useAgendas = () => {
  const data = useStaticQuery(
    graphql`
      query allAgenda {
        allAgenda {
          nodes {
            en
            fr
            id
            uuid
          }
        }
      }
    `
  )
  return data.allAgenda.nodes.map(node => {
    return {
      ...node,
      en: node.en ? JSON.parse(node.en) : null,
      fr: node.fr ? JSON.parse(node.fr) : null,
    }
  })
}
