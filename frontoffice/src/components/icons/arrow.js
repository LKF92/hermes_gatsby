import React from "react"

function Arrow({ direction, color, ariaLabel }) {
  if (direction === "up") {
    return (
      <svg
        role="img"
        aria-label={ariaLabel}
        focusable="false"
        style={{ margin: "0 3px" }}
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="4"
        viewBox="0 0 8 4"
      >
        <path fill={color ? color : "black"} d="M4 0l4 4H0z"></path>
      </svg>
    )
  } else if (direction === "down") {
    return (
      <svg
        role="img"
        aria-label={ariaLabel}
        focusable="false"
        style={{ transform: "rotate(180deg)", margin: "0 3px" }}
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="4"
        viewBox="0 0 8 4"
      >
        <path fill={color ? color : "black"} d="M4 0l4 4H0z"></path>
      </svg>
    )
  }
}

export default Arrow
