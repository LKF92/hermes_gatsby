const axios = require("axios")

exports.sourceNodes = async (
  { actions, createContentDigest },
  configOptions
) => {
  const { createNode } = actions
  const { drupal } = configOptions
  const getDrupal = () =>
    Promise.all(
      drupal.enpoints.map(enpoint => {
        return axios.get(drupal.host + enpoint.url + "?offset=0&limit=10000")
      })
    ).then(values => {
      return values.map((item, index) => {
        return {
          [drupal.enpoints[index].type]: item.data,
        }
      })
    })

  try {
    const result = await getDrupal()
    result.map(item => {
      const type = Object.keys(item)[0]
      const data = node => {
        if (node.id) {
          return createNode(
            Object.assign(
              {},
              {
                children: [],
                id: node.id.toString(),
                uuid: node.uuid ? node.uuid : "",
                fr: node.fr ? JSON.stringify(node.fr) : "",
                en: node.en ? JSON.stringify(node.en) : "",
                ...(type === "page" && {
                  drupalType: node.fr.type,
                }),
                category: node.fr ? node.fr.category_id : "",
                type,
                internal: {
                  type,
                  content: JSON.stringify(node),
                  contentDigest: createContentDigest(node),
                },
                parent: null,
              }
            )
          )
        }
      }
      if (Array.isArray(item[type])) {
        // If there are multiple items
        return item[type].map(element => {
          return data(element)
        })
      } else {
        // If not, just create an object
        return data(item[type])
      }
    })
    return
  } catch (error) {
    console.log(error)
  }
}
