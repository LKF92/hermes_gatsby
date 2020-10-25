require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })

module.exports = {
  siteMetadata: {
    title: `Hermès Finance`,
    description: `finance.hermes.com`,
    author: `@dropteam`,
    siteUrl: `https://hecate.ppr-aws.hermes.com/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `hermes-finance`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/png/hecate.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-source-hecate",
      options: {
        cognito: {
          client_id: process.env.API_COGNITO_CLIENT_ID,
          password: process.env.API_COGNITO_PASSWORD,
          pool_id: process.env.API_COGNITO_POOL_ID,
          username: process.env.API_COGNITO_USERNAME,
        },
        drupal: {
          host: process.env.API_DRUPAL,
          enpoints: [
            {
              type: "page",
              url: "/node/page/collection",
            },
            {
              type: "pageRse",
              url: "/node/page_rse/collection",
            },
            {
              type: "document",
              url: "/node/document/collection",
            },
            {
              type: "agenda",
              url: "/node/agenda/collection",
            },
            {
              type: "documentCategories",
              url: "/taxonomy_term/document_categories/collection",
            },
            {
              type: "menuPrincipal",
              url: "/menu_link_content/main/collection",
            },
            {
              type: "menuPrincipalEn",
              url: "/menu_link_content/main-en/collection",
            },
            {
              type: "menuFooter",
              url: "/menu_link_content/footer/collection",
            },
            {
              type: "menuFooterEn",
              url: "/menu_link_content/footer-en/collection",
            },
          ],
        },
      },
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: `${__dirname}/src/images/svg`,
        },
      },
    },
    `gatsby-plugin-force-trailing-slashes`,
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        sitemap: "https://hecate.ppr-aws.hermes.com/sitemap.xml",
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    `gatsby-plugin-sitemap`,
  ],
}
