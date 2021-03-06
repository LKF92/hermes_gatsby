import React from "react"

function CrossIcon({ width, height, color, title, refFocus }) {
  return (
    <svg
      ref={refFocus}
      role="img"
      focusable="true"
      aria-label={title}
      stroke={color}
      fill="none"
      width="14px"
      height="14px"
      viewBox="0 0 14 14"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Close</title>

      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g
          transform="translate(-315.000000, -125.000000)"
          stroke="#444444"
          stroke-width="1.5"
        >
          <g transform="translate(20.000000, 100.000000)">
            <g>
              <g transform="translate(295.000000, 25.000000)">
                <g>
                  <line x1="0.5" y1="13.5" x2="13.5" y2="0.5"></line>
                  <line
                    x1="0.5"
                    y1="13.5"
                    x2="13.5"
                    y2="0.5"
                    transform="translate(7.000000, 7.000000) scale(-1, 1) translate(-7.000000, -7.000000) "
                  ></line>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default CrossIcon
