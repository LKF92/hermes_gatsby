require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
const path = require("path")
const fs = require("fs")
const moment = require("moment-timezone")
const { fromUnixTime } = require("date-fns")

exports.createPages = async ({
  actions: { createPage, createRedirect },
  graphql,
}) => {
  const maxPublicationDate = process.env.GATSBY_PUBLICATION_DATE
    ? moment
        .utc(fromUnixTime(process.env.GATSBY_PUBLICATION_DATE))
        .tz("Europe/Paris")
    : moment.utc(new Date()).tz("Europe/Paris")

  console.log(
    `
      Timestamp variable env : ${process.env.GATSBY_PUBLICATION_DATE}<br />
      Date actuelle : ${moment.utc(new Date()).tz("Europe/Paris")}<br />
      Date variable env : ${moment
        .utc(fromUnixTime(process.env.GATSBY_PUBLICATION_DATE))
        .tz("Europe/Paris")}<br />
      Date filtrage documents : ${maxPublicationDate}<br />
      Test : ${moment(maxPublicationDate).format("YYYYMMDDhhmmss")}
    `
  )
  const slugify = str => {
    const a =
      "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;"
    const b =
      "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------"
    const p = new RegExp(a.split("").join("|"), "g")
    // AJOUTER LES STOP WORDS DE L'ANCIENNE BORNE

    return str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, "-and-") // Replace & with 'and'
      .replace(/[^\w\-]+/g, "") // Remove all non-word characters
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
  }

  await graphql(`
    {
      allPage {
        nodes {
          id
          fr
          en
          uuid
          type
        }
      }
      allDocumentCategories {
        nodes {
          id
          fr
          en
        }
      }
      allDocument {
        nodes {
          en
          fr
          id
          uuid
        }
      }
      allPageRse {
        nodes {
          fr
          en
          id
          uuid
          type
        }
      }
      allMenuPrincipal {
        nodes {
          fr
          id
          uuid
        }
      }
      allMenuPrincipalEn {
        nodes {
          en
          id
          uuid
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      Promise.reject(result.errors)
    }
    const langs = ["fr", "en"]

    const allMenuParsed = result.data.allMenuPrincipal.nodes.map(node => {
      return {
        ...node,
        fr: node.fr ? JSON.parse(node.fr) : null,
      }
    })
    const allMenuEnParsed = result.data.allMenuPrincipalEn.nodes.map(node => {
      return {
        ...node,
        en: node.en ? JSON.parse(node.en) : null,
      }
    })
    const allPageParsed = result.data.allPage.nodes.map(node => {
      return {
        ...node,
        en: node.en ? JSON.parse(node.en) : null,
        fr: node.fr ? JSON.parse(node.fr) : null,
      }
    })
    const allPageRseParsed = result.data.allPageRse.nodes.map(node => {
      return {
        ...node,
        en: node.en ? JSON.parse(node.en) : null,
        fr: node.fr ? JSON.parse(node.fr) : null,
      }
    })

    const allDocumentParsed = result.data.allDocument.nodes.map(node => {
      return {
        ...node,
        type: "document",
        en: node.en ? JSON.parse(node.en) : null,
        fr: node.fr ? JSON.parse(node.fr) : null,
      }
    })

    /* REDIRECTS SSG */
    const pages = [...allPageParsed, ...allPageRseParsed, ...allDocumentParsed]
    const pagesRedirects = pages
      .map(node => {
        return langs
          .filter(lang => {
            return node[lang] && node[lang].alias
          })
          .filter(lang => {
            if (node.type === "document") {
              return (
                node[lang].document &&
                node[lang].document.file &&
                node[lang].document.file.url
              )
            } else {
              return node[lang].redirection && node[lang].redirection.length > 0
            }
          })
          .map(lang => {
            const alias = node[lang].alias
            const hasPrefix = alias.includes(`/${lang}/`) === true
            const uri = `${alias.replace(`/${lang}/`, "/")}/`

            if (node.type === "document") {
              return [
                {
                  source: `/${lang}${uri}`,
                  destination: node[lang].document.file.url,
                },
                {
                  source: uri,
                  destination: node[lang].document.file.url,
                },
              ]
            } else {
              /* pages */
              const redirects = node[lang].redirection
              return redirects.map(redirect => {
                /* Redirections drupal */
                return [
                  {
                    source:
                      `/${lang}` + redirect.replace(`/${lang}/`, "/") + "/",
                    destination: `/${lang}${uri}`,
                  },
                  {
                    source: `${redirect}/`,
                    destination: `/${lang}${uri}`,
                  },
                ]
              })
            }
          })
      })
      .flat()
      .flat()
      .flat()

    fs.writeFile(
      "redirects.json",
      JSON.stringify([
        ...pagesRedirects,
        {
          source: "/fr/",
          destination: "/",
        },
        {
          source: "/recherche/",
          destination: "/fr/recherche/",
        },
        {
          source: "/search/",
          destination: "/en/search/",
        },
      ]),
      err => {
        if (err) console.log(err)
        console.log(`${pagesRedirects.length} redirections created !`)
      }
    )

    /* REDIRECTS SSR */
    if (process.env.NODE_ENV === "development") {
      console.log("Creating SSR redirects...")
      langs.map(lang => {
        allDocumentParsed
          .filter(node => {
            return (
              node[lang] &&
              node[lang].alias &&
              node[lang].document &&
              node[lang].document.file &&
              node[lang].document.file.url
            )
          })
          .map(node => {
            createPage({
              path: `${node[lang].alias}/`,
              component: path.resolve(`src/templates/redirect.js`),
              context: {
                destination: node[lang].document.file.url,
              },
            })
            createPage({
              path: `/${lang}${node[lang].alias}/`,
              component: path.resolve(`src/templates/redirect.js`),
              context: {
                destination: node[lang].document.file.url,
              },
            })
          })
      })
    }

    /* PAGES */
    const allPages = [...allPageParsed, ...allPageRseParsed]
    allPages.map(node => {
      return langs.map(lang => {
        if (
          node[lang] &&
          node[lang].title &&
          node[lang].type !== "homepage" &&
          node[lang].alias
        ) {
          if (
            process.env.NODE_ENV === "development" ||
            (process.env.NODE_ENV === "production" &&
              node[lang].status === true)
          ) {
            return createPage({
              path: `/${lang}${node[lang].alias}`,
              component: path.resolve(`src/templates/page.js`),
              context: {
                lang,
                id: node.id,
                uuid: node.uuid,
                title: node[lang].title,
                en: node.en ? node.en : null,
                fr: node.fr ? node.fr : null,
                pageType:
                  node.type === "page"
                    ? node[lang].type
                    : node[lang].is_index
                    ? "homepageRse"
                    : "rse",
                allMenuFr: allMenuParsed,
                allMenuEn: allMenuEnParsed,
              },
            })
          }
        }
      })
    })
  })
}
