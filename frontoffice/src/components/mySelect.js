import React, { useState, useEffect, useContext } from "react"
import Select from "react-select"
import { Box } from "@material-ui/core"
import { GlobalContext } from "./layout"
import styled from "styled-components"

export default function MySelect({
  value,
  setValue,
  errorMessage,
  options,
  showErrorMessage,
}) {
  const { isKeyboardNav } = useContext(GlobalContext)
  const [isError, setIsError] = useState(false)
  const [selectIsFocused, setSelectIsFocused] = useState(true)

  useEffect(() => {
    if (selectIsFocused) {
      setIsError(false)
    } else {
      value && value !== options[0] ? setIsError(false) : setIsError(true)
    }
  }, [value, selectIsFocused])

  const customStyle = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "0",
      boxShadow: state.isFocused ? "0" : "0",
      borderColor: isError
        ? "var(--error)"
        : state.isFocused
        ? "black"
        : "var(--beige)",
      "&:hover": {
        borderColor: "var(--beige)",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    singleValue: provided => ({
      ...provided,
      fontFamily: "Helvetica, 'Helvetica W01', Arial, sans-serif",
      fontSize: "14px",
      color: "var(--grey2)",
    }),
    option: (provided, state) => ({
      ...provided,
      fontFamily: "Helvetica, 'Helvetica W01', Arial, sans-serif",
      fontSize: "14px",
      color:
        isKeyboardNav && state.isFocused ? "var(--white)" : "var(--darkGrey)",
    }),
    menu: provided => ({
      ...provided,
      zIndex: 10,
    }),
    placeholder: provided => ({
      ...provided,
      color: "var(--grey2)",
    }),
  }

  const customTheme = theme => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "var(--beige)",
      primary50: "var(--beige)",
      primary25: isKeyboardNav ? "var(--orange)" : "var(--floralWhite)",
    },
  })

  // useEffect(() => {
  //   // Disabled useless aria attribute
  //   if (document) {
  //     const hiddenInput = document.querySelector("input")
  //     console.log(hiddenInput)

  //     if (hiddenInput) hiddenInput.removeAttribute("aria-autocomplete")
  //   }
  // }, [])

  return (
    <Container
      onFocus={() => setSelectIsFocused(true)}
      onBlur={() => setSelectIsFocused(false)}
    >
      <Box>
        <label htmlFor="select-subject">
          <span className="visually-hidden">{options[0].label}</span>
          <Select
            id="select-subject"
            aria-label="select-subject"
            onChange={setValue}
            options={options}
            placeholder={options[0].label}
            theme={customTheme}
            styles={customStyle}
            isSearchable={false}
            isOptionDisabled={option => option.disabled}
          />
        </label>
        <Box className="error">
          <span>{isError || showErrorMessage ? errorMessage : ""}</span>
        </Box>
      </Box>
    </Container>
  )
}

const Container = styled(Box)`
  font-family: Helvetica, "Helvetica W01", Arial, sans-serif;

  /* ERROR MESSAGE */
  .error {
    margin-left: 0;
    margin-top: 5px;
    color: var(--error) !important;
    font-size: 12px;
  }
`
