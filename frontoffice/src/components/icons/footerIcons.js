import React, { useContext, useState } from "react"
import { GlobalContext } from "../layout"

export const FacebookIcon = function ({ href }) {
  const { lang, wording } = useContext(GlobalContext)
  const [isHovered, setIsHovered] = useState(false)
  const title = wording(lang, "FacebookTitle")
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <svg
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="22"
        viewBox="0 0 12 22"
        role="img"
        focusable="true"
        aria-label={title}
      >
        <path
          fill={isHovered ? "var(--red)" : "black"}
          d="M7.599 21.429v-9.375h3.126l.595-3.879H7.599V5.66c0-1.061.52-2.095 2.186-2.095h1.692V.262S9.942 0 8.474 0C5.409 0 3.406 1.857 3.406 5.22v2.955H0v3.879h3.406v9.375z"
        ></path>
      </svg>
    </a>
  )
}

export const InstagramIcon = function ({ href }) {
  const { lang, wording } = useContext(GlobalContext)
  const [isHovered, setIsHovered] = useState(false)
  const title = wording(lang, "InstagramTitle")
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <svg
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        role="img"
        focusable="true"
        aria-label={title}
      >
        <path
          fill={isHovered ? "var(--red)" : "black"}
          d="M9.997 1.838c2.67 0 2.985.01 4.04.058.974.044 1.503.207 1.856.343.466.181.8.398 1.15.747.349.349.566.681.747 1.147.137.351.3.88.344 1.852.048 1.053.058 1.368.058 4.032 0 2.664-.01 2.98-.058 4.032-.044.972-.207 1.5-.344 1.852a3.091 3.091 0 01-.748 1.147 3.09 3.09 0 01-1.15.747c-.352.136-.88.299-1.856.343-1.054.048-1.37.058-4.04.058-2.669 0-2.985-.01-4.039-.058-.974-.044-1.504-.207-1.856-.343a3.098 3.098 0 01-1.15-.747 3.091 3.091 0 01-.747-1.147c-.137-.351-.3-.88-.345-1.852-.048-1.052-.058-1.368-.058-4.032 0-2.664.01-2.98.058-4.032.045-.972.208-1.5.345-1.852a3.09 3.09 0 01.748-1.147c.35-.35.682-.566 1.149-.747.352-.136.882-.299 1.856-.343 1.054-.048 1.37-.058 4.04-.058m0-1.798C7.282.04 6.94.051 5.875.1c-1.064.048-1.79.217-2.427.464a4.9 4.9 0 00-1.77 1.15A4.89 4.89 0 00.525 3.483C.278 4.116.109 4.842.06 5.904.011 6.968 0 7.307 0 10.017c0 2.71.011 3.05.06 4.114.049 1.062.218 1.787.465 2.421a4.89 4.89 0 001.153 1.768 4.902 4.902 0 001.77 1.15c.636.247 1.363.416 2.427.464 1.066.049 1.407.06 4.122.06s3.055-.011 4.121-.06c1.065-.048 1.791-.217 2.427-.464a4.901 4.901 0 001.77-1.15 4.889 4.889 0 001.154-1.768c.247-.634.416-1.36.465-2.421.048-1.065.06-1.404.06-4.114s-.012-3.05-.06-4.113c-.049-1.062-.218-1.788-.465-2.422a4.89 4.89 0 00-1.153-1.767 4.9 4.9 0 00-1.77-1.151C15.908.317 15.182.148 14.117.1 13.052.051 12.712.04 9.997.04"
        ></path>
        <path
          fill={isHovered ? "var(--red)" : "black"}
          d="M9.994 4.89a5.128 5.128 0 015.133 5.123 5.128 5.128 0 01-5.133 5.124 5.128 5.128 0 01-5.134-5.124A5.128 5.128 0 019.994 4.89m.005 8.449a3.332 3.332 0 003.337-3.326 3.332 3.332 0 00-3.337-3.325 3.332 3.332 0 00-3.338 3.325A3.332 3.332 0 0010 13.34M16.53 4.687c0 .661-.538 1.197-1.2 1.197a1.198 1.198 0 111.2-1.197"
        ></path>
      </svg>
    </a>
  )
}

export const TwitterIcon = function ({ href }) {
  const { lang, wording } = useContext(GlobalContext)
  const [isHovered, setIsHovered] = useState(false)
  const title = wording(lang, "TwitterTitle")
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <svg
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="18"
        viewBox="0 0 21 18"
        role="img"
        focusable="true"
        aria-label={title}
      >
        <path
          fill={isHovered ? "var(--red)" : "black"}
          d="M6.604 17.78c7.925 0 12.259-6.54 12.259-12.21 0-.186-.004-.371-.012-.555A8.746 8.746 0 0021 2.793a8.63 8.63 0 01-2.474.675 4.31 4.31 0 001.894-2.374 8.654 8.654 0 01-2.735 1.042A4.312 4.312 0 0014.54.78c-2.38 0-4.31 1.922-4.31 4.291 0 .337.038.665.112.979a12.248 12.248 0 01-8.88-4.484 4.284 4.284 0 001.334 5.73 4.29 4.29 0 01-1.952-.538v.055A4.298 4.298 0 004.3 11.02a4.337 4.337 0 01-1.946.074 4.311 4.311 0 004.025 2.98 8.667 8.667 0 01-5.351 1.838c-.348 0-.69-.02-1.028-.06a12.232 12.232 0 006.604 1.928"
        ></path>
      </svg>
    </a>
  )
}

export const YoutubeIcon = function ({ href }) {
  const { lang, wording } = useContext(GlobalContext)
  const [isHovered, setIsHovered] = useState(false)
  const title = wording(lang, "YoutubeTitle")
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <svg
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="16"
        viewBox="0 0 23 16"
        role="img"
        focusable="true"
        aria-label={title}
      >
        <path
          fill={isHovered ? "var(--red)" : "black"}
          d="M22.13 2.47c.472 1.763.472 5.44.472 5.44s0 3.678-.473 5.44a2.83 2.83 0 01-1.998 1.999c-1.762.472-8.83.472-8.83.472s-7.068 0-8.83-.472a2.83 2.83 0 01-1.999-1.998C0 11.588 0 7.91 0 7.91s0-3.678.472-5.44A2.83 2.83 0 012.471.472C4.233 0 11.3 0 11.3 0s7.068 0 8.83.472a2.83 2.83 0 011.998 1.999zm-7.217 5.44L9.04 4.52v6.78z"
        ></path>
      </svg>
    </a>
  )
}

export const LinkedinIcon = function ({ href }) {
  const { lang, wording } = useContext(GlobalContext)
  const [isHovered, setIsHovered] = useState(false)
  const title = wording(lang, "LinkedinTitle")
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <svg
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 19 19"
        role="img"
        focusable="true"
        aria-label={title}
      >
        <path
          fill={isHovered ? "var(--red)" : "black"}
          d="M.31 6.24h3.907v12.565H.31zm4.216-3.978A2.263 2.263 0 110 2.264a2.263 2.263 0 014.526-.002zM6.66 6.241h3.74v1.716h.053c.521-.986 1.793-2.027 3.692-2.027 3.952 0 4.68 2.599 4.68 5.98v6.886h-3.9V12.69c0-1.456-.025-3.328-2.027-3.328-2.03 0-2.342 1.587-2.342 3.224v6.21H6.66z"
        ></path>
      </svg>
    </a>
  )
}
