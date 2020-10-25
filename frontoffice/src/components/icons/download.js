import React from "react"

function Download({ text }) {
  return (
    <svg
      width="12px"
      height="18px"
      viewBox="0 0 12 18"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
    >
      {text && <title>{text}</title>}
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-32.000000, -16.000000)" fill="#444444">
          <g>
            <g transform="translate(32.000000, 16.000000)">
              <g>
                <g>
                  <path d="M12,16 L12,17.5 L0,17.5 L0,16 L12,16 Z M6.75,-1.86517468e-14 L6.75,10.553 L10.17825,7.125 L11.30325,8.25 L6,13.55325 L0.69675,8.25 L1.82175,7.125 L5.25,10.553 L5.25,-1.86517468e-14 L6.75,-1.86517468e-14 Z"></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default Download
