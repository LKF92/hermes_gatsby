import React from "react"

function MinusIcon({ hidden, title }) {
  return (
    <svg
      role="img"
      aria-label={title}
      focusable="true"
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="1"
      viewBox="0 0 9 1"
      aria-hidden={hidden}
    >
      <path fill="#444" d="M0 0h9v1H0z"></path>
    </svg>
  )
}

export default MinusIcon
