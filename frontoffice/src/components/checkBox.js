import React from "react"
import "font-awesome/css/font-awesome.min.css"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import parse from "html-react-parser"

export default ({
  labelName,
  count,
  event,
  id,
  label,
  active,
  dataHref,
  nameInput,
  hideLabel,
}) => {
  return (
    <Wrapper>
      <Box className="checkbox-box">
        <Box
          component="label"
          className="checkbox-label d-flex align-items-top"
          display="flex"
          alignItems="center"
          htmlFor={id}
        >
          <Box alignSelf="start">
            <Box
              id={id}
              component="input"
              type="checkbox"
              onChange={event}
              title={label}
              checked={active}
              value={dataHref}
              name={nameInput}
            />
            <Box component="span" className="cr">
              <Box component="i" className="cr-icon fa fa-check"></Box>
            </Box>
          </Box>
          {labelName && !hideLabel ? (
            <Box className="labelInfo">
              {parse(labelName)} ({count})
            </Box>
          ) : (
            <Box component="span" className="visually-hidden">
              {labelName}
            </Box>
          )}
        </Box>
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  label {
    .labelInfo {
      font-family: Helvetica, "Helvetica W01", Arial, sans-serif;
      font-size: 14px;
      color: var(--black);
      letter-spacing: 0;
      line-height: 24px;
      margin-left: 15px;
    }

    &:hover {
      .cr:not(.disabled) {
        border-color: var(--red);
      }
    }

    i {
      color: var(--red);
    }
  }

  .checkbox-box .cr,
  .radio .cr {
    position: relative;
    display: inline-block;
    border: 1px solid var(--beige4);
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    background: white;
    border-radius: 2px;
    cursor: pointer;

    @media (max-width: 960px) {
      width: 20px;
      height: 20px;
      min-width: 20px;
      min-height: 20px;
    }
    &:hover {
      border-color: var(--red);
    }
  }

  .radio .cr {
    border-radius: 50%;
  }

  .checkbox-box .cr .cr-icon,
  .radio .cr .cr-icon {
    position: absolute;
    font-size: 0.8em;
    line-height: 0;
    top: 50%;
    left: 20%;
  }

  .radio .cr .cr-icon {
    margin-left: 0.04em;
  }

  .checkbox-box label input[type="checkbox"],
  .radio label input[type="radio"] {
    overflow: visible;
    display: block;
    position: absolute;
    height: 24px;
    width: 24px;
    margin: 0;
    padding: 0;
    cursor: pointer;
    @media (max-width: 960px) {
      width: 20px;
      height: 20px;
    }
  }

  .checkbox-box label input[type="checkbox"] + .cr > .cr-icon,
  .radio label input[type="radio"] + .cr > .cr-icon {
    transform: scale(3) rotateZ(-20deg);
    opacity: 0;
    transition: all 0.2s ease-in;
  }

  .checkbox-box label input[type="checkbox"]:checked + .cr > .cr-icon,
  .radio label input[type="radio"]:checked + .cr > .cr-icon {
    transform: scale(1) rotateZ(0deg);
    opacity: 1;
  }

  .checkbox-box label input[type="checkbox"]:disabled + .cr,
  .radio label input[type="radio"]:disabled + .cr {
    opacity: 0.5;
  }

  .checkbox-box .checkbox-label {
    font-size: 1em;
  }
`
