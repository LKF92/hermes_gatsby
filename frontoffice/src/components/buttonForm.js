import React from "react"
import styled from "styled-components"
import { Box } from "@material-ui/core"

export default function ({ text, width, action, isFormValid }) {
  return (
    <ButtonForm
      component="button"
      onClick={action}
      width={width}
      height="50px"
      bgcolor="var(--black)"
      fontFamily="Courier New"
      fontSize="13px"
      fontWeight="bold"
      lineHeight="15px"
      color="white"
      borderRadius="5px"
      isFormValid={isFormValid}
      aria-disabled={isFormValid ? false : true}
    >
      {text}
    </ButtonForm>
  )
}

const ButtonForm = styled(Box)`
  cursor: ${({ isFormValid }) => (isFormValid ? "pointer" : "not-allowed")};
`
