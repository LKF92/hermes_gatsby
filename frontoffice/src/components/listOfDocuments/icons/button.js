import React from "react"

export const AddIcon = ({ isHovere, title }) => {
  return (
    <svg
      version="1.1"
      viewBox="0 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      role="img"
      aria-label={title}
      focusable="true"
    >
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(-98 -10)">
          <g transform="translate(98 9)">
            <g transform="translate(0 1)">
              <circle
                cx="9.5"
                cy="9.5"
                r="9.5"
                fill={!isHovere ? "var(--black)" : "var(--white)"}
                fill-rule="nonzero"
              />
              <rect
                x="6"
                y="9"
                width="7"
                height="1"
                fill={!isHovere ? "var(--white)" : "var(--black)"}
              />
              <rect
                x="9"
                y="6"
                width="1"
                height="7"
                fill={!isHovere ? "var(--white)" : "var(--grey2)"}
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export const DownloadIcon = ({ isHovere, title }) => {
  return (
    <>
      <svg
        width="12px"
        height="18px"
        viewBox="0 0 12 18"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title}
        focusable="true"
      >
        <title>Arrow</title>
        <desc>Created with Sketch.</desc>
        <g
          id="Symbols"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <g
            id="Icon/Download"
            fill={!isHovere ? "var(--black)" : "var(--white)"}
          >
            <g id="Arrow">
              <path
                d="M12,16 L12,17.5 L0,17.5 L0,16 L12,16 Z M6.75,-1.86517468e-14 L6.75,10.553 L10.17825,7.125 L11.30325,8.25 L6,13.55325 L0.69675,8.25 L1.82175,7.125 L5.25,10.553 L5.25,-1.86517468e-14 L6.75,-1.86517468e-14 Z"
                id="Combined-Shape"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    </>
  )
}
