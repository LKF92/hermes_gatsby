import React, { useState } from "react"
import { Box, TextField } from "@material-ui/core"
import styled from "styled-components"

export default function MyInput({
  value,
  setValue,
  placeholder,
  errorMessage,
  showErrorMessage,
  isEmail,
  isEmailValid,
  firstName,
  lastName,
  email,
}) {
  const [isError, setIsError] = useState(false)

  const checkInput = () => {
    if (isEmail && isEmailValid) return setIsError(false)
    if (isEmail && !isEmailValid) return setIsError(true)
    if (!value) return setIsError(true)
    if (value) return setIsError(false)
  }

  return (
    <Box onFocus={() => setIsError(false)} onBlur={() => checkInput()}>
      <StyledTextField
        isError={isError}
        id={`input_${placeholder}`}
        label={placeholder}
        variant="outlined"
        placeholder={placeholder}
        inputProps={{
          autocomplete: firstName
            ? "given-name"
            : lastName
            ? "family-name"
            : email
            ? "email"
            : "on",
          "aria-invalid": isError,
        }}
        onChange={e => setValue(e.target.value)}
        value={value}
        helperText={isError || showErrorMessage ? errorMessage : ""}
      />
    </Box>
  )
}

const StyledTextField = styled(TextField)`
  width: 100%;

  /*  INPUT */
  .MuiInputBase-input {
    height: 48px;
    box-sizing: border-box;
    padding: 14px 20px;
    background: var(--white);
    color: var(--grey2);
  }

  /* OUTLINE */
  .MuiOutlinedInput-root {
    fieldset {
      border-color: ${props =>
        props.isError ? "var(--error)" : "var(--beige)"};
      border-radius: 0px;
    }
    &:hover fieldset {
      border-color: ${props =>
        props.isError ? "var(--error)" : "var(--beige)"};
    }
    &.Mui-focused fieldset {
      border: 1px solid var(--black);
    }
  }

  /* LABEL */
  .MuiInputLabel-outlined {
    font-family: Helvetica, "Helvetica W01", Arial, sans-serif;
    color: var(--grey2);
    font-size: 14px;
    text-indent: 6px;
  }
  label.Mui-focused {
    font-family: Helvetica, "Helvetica W01", Arial, sans-serif;
    color: var(--black);
    font-size: 14px;
    font-weight: bold;
  }

  /* ERROR MESSAGE */
  .MuiFormHelperText-contained {
    margin-left: 0;
    margin-top: 5px;
    color: var(--error);
  }
`
