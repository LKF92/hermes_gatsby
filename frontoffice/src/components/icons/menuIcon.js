import React from "react"

function MenuIcon({ width, height, color, title }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 13"
      role="img"
      focusable=" true "
      aria-label={title}
    >
      <path fill={color} d="M0 12h20v1H0zM0 6h20v1H0zM0 0h20v1H0z"></path>
    </svg>
  )
}

export default MenuIcon
