import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ListOfDocuments from "../../components/listOfDocuments/index"
import SearchBar from "../../components/listOfDocuments/searchBar.js"

export default ({ location }) => {
  const [searchValue, setSearchValue] = useState("")

  /* GTM */
  useEffect(() => {
    window.dataLayer.push({
      event: "pageview",
      page_type: "Recherche",
      page_language: "fr",
    })
  }, [])

  return (
    <Layout lang="fr">
      <SEO title="Résultats de recherche" />
      <SearchBar
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        locationSearchValue={
          location?.state?.searchValue ? location?.state?.searchValue : ""
        }
      />
      <ListOfDocuments pageType="searchResults" searchValue={searchValue} />
    </Layout>
  )
}
