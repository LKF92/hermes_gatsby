import React from "react"

function PlusIcon({ hidden, title }) {
  return (
    <svg
      role="img"
      aria-label={title}
      focusable="true"
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      viewBox="0 0 9 9"
      aria-hidden={hidden}
    >
      <path fill="#727272" d="M4 0h1v9H4z"></path>
      <path fill="#727272" d="M0 4h9v1H0z"></path>
    </svg>
  )
}

export default PlusIcon
