import React, { useState, useEffect } from "react"
import "font-awesome/css/font-awesome.min.css"
import { Box } from "@material-ui/core"
import styled from "styled-components"

export default ({
  handleClickFilter,
  handleClickDocument,
  id,
  value,
  checked,
  name,
  title,
}) => {
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    if (checked) setIsChecked(true)
  }, [checked])

  const onChange = event => {
    setIsChecked(!isChecked)
    if (handleClickFilter) handleClickFilter(event, value)
    if (handleClickDocument) handleClickDocument(event)
  }

  return (
    <Checkbox>
      <input
        type="checkbox"
        tabIndex={0}
        id={id}
        name={name}
        checked={checked}
        title={title}
        onChange={onChange}
        checked={isChecked}
        value={value}
      />
      <span className="cr">
        <i className="cr-icon fa fa-check"></i>
      </span>
    </Checkbox>
  )
}

const Checkbox = styled(Box)`
  display: inline;
  .cr {
    display: inline-block;
    position: relative;
    top: 0;
    left: 0;
    color: var(--red);
    border: 1px solid var(--beige4);
    background: white;
    border-radius: 2px;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
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

  .cr .cr-icon {
    position: absolute;
    font-size: 0.8em;
    line-height: 0;
    top: 50%;
    left: 25%;
  }

  input[type="checkbox"] {
    overflow: visible;
    display: block;
    position: absolute;
    width: 21px;
    height: 21px;
    margin: 0;
    padding: 0;
    cursor: pointer;
    @media (min-width: 960px) {
      height: 25px;
      width: 25px;
    }
  }

  input[type="checkbox"] + .cr > .cr-icon {
    transform: scale(3) rotateZ(-20deg);
    opacity: 0;
    transition: all 0.2s ease-in;
  }

  input[type="checkbox"]:checked + .cr > .cr-icon {
    transform: scale(1) rotateZ(0deg);
    opacity: 1;
  }

  input[type="checkbox"]:disabled + .cr {
    opacity: 0.5;
  }
`
