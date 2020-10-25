import React, { useContext, useState, useEffect } from "react"
import { GlobalContext } from "./layout"
import { Box } from "@material-ui/core"
import styled from "styled-components"

export default function ({
  placeholder,
  message,
  setMessage,
  errorMessage,
  showErrorMessage,
}) {
  const { lang, wording } = useContext(GlobalContext)
  const [isError, setIsError] = useState(false)
  return (
    <Box
      onFocus={() => setIsError(false)}
      onBlur={() => (message ? setIsError(false) : setIsError(true))}
    >
      <label htmlFor="textareaMessage">
        <span className="visually-hidden">
          {wording(lang, "TextArea Message")}
        </span>
        <MyTextarea
          id="textareaMessage"
          isError={isError}
          fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
          fontSize="14px"
          component="textarea"
          color="var(--grey2)"
          p="14px 20px"
          width="100%"
          height="172px"
          borderRadius="0px"
          placeholder={placeholder}
          aria-invalid={isError}
          onChange={e => setMessage(e.target.value)}
          value={message}
        ></MyTextarea>
      </label>
      {isError || showErrorMessage ? (
        <Box
          component="p"
          m="0 5px 0 0"
          color="var(--error)"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="12px"
        >
          {errorMessage}
        </Box>
      ) : null}
    </Box>
  )
}

const MyTextarea = styled(Box)`
  border: ${props =>
    props.isError ? "1px solid var(--error)" : "1px solid var(--beige)"};
`
