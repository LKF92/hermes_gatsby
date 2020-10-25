import React from "react"
import Helmet from "react-helmet"

export default ({ pageContext }) => {
  return (
    <>
      <Helmet>
        <meta
          http-equiv="refresh"
          content={`0;URL='${pageContext.destination}'`}
        />
      </Helmet>
    </>
  )
}
