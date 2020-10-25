import React, { useEffect } from "react"
import Home from "../components/home"

export default () => {
  useEffect(() => {
    /* GTM */
    window.dataLayer.push({
      event: "pageview",
      page_type: "Accueil",
      page_language: "en",
    })
  }, [])
  return <Home lang="en" />
}
