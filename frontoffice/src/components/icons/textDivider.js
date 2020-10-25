import React from "react"
import styled from "styled-components"

export default function TextDivider() {
  return (
    <Divider>
      <span>&nbsp;</span>
    </Divider>
  )
}
const Divider = styled.div`
  margin-left: 2px;
  border-left: solid 1px var(--grey);
  height: 100%;
`
