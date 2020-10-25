import React from "react"

function SearchIcon({ color, tablet, mobile, title }) {
  if (mobile || tablet) {
    return (
      <svg
        role="img"
        focusable="true"
        aria-label={title}
        xmlns="http://www.w3.org/2000/svg"
        width={mobile ? 20 : 19}
        height={mobile ? 20 : 19}
        viewBox="0 0 20 20"
      >
        <path
          fill="none"
          stroke={color}
          strokeMiterlimit="20"
          d="M9.35 16.39a7.6 7.6 0 100-15.2 7.6 7.6 0 000 15.2zM19.76 19.216l-5.203-5.413"
          transform="matrix(-1 0 0 1 21 0)"
        ></path>
      </svg>
    )
  } else {
    return (
      <svg
        role="img"
        focusable="true"
        aria-label={title}
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
      >
        <path
          fill={color}
          d="M10.003 13.75c-3.17 0-5.75-2.58-5.75-5.75s2.58-5.75 5.75-5.75 5.75 2.58 5.75 5.75-2.58 5.75-5.75 5.75zm0-13C6.005.75 2.753 4.002 2.753 8c0 1.66.576 3.271 1.627 4.562L.65 16.291l1.061 1.062 3.73-3.73a7.237 7.237 0 004.562 1.627c3.998 0 7.25-3.252 7.25-7.25S14.001.75 10.003.75z"
        ></path>
      </svg>
    )
  }
}

export default SearchIcon
