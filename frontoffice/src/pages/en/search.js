import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ListOfDocuments from "../../components/listOfDocuments/index"
import SearchBar from "../../components/listOfDocuments/searchBar.js"

export default ({ location }) => {
  const [searchValue, setSearchValue] = useState("")
  useEffect(() => {
    /* GTM */
    window.dataLayer.push({
      event: "pageview",
      page_type: "Recherche",
      page_language: "en",
    })
  }, [])
  return (
    <Layout lang="en">
      <SEO title="Search results" />
      <SearchBar
        setSearchValue={setSearchValue}
        searchValue={
          location?.state?.searchValue ? location.state.searchValue : ""
        }
      />
      <ListOfDocuments pageType="searchResults" searchValue={searchValue} />
    </Layout>
  )
}
