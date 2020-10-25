import React from "react"

function Calendar({ text }) {
  return (
    <svg
      width="15px"
      height="17px"
      viewBox="0 0 15 17"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      focusable="false"
    >
      {text && <title>{text}</title>}
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-43.000000, -16.000000)" fill="#444444">
          <g>
            <g>
              <g transform="translate(43.000000, 16.000000)">
                <g>
                  <g>
                    <path d="M4.25,0.75 L4.25,2 L10.75,2 L10.75,0.75 L12.25,0.75 L12.25,2 L13,2 C14.1045695,2 15,2.8954305 15,4 L15,15 C15,16.1045695 14.1045695,17 13,17 L2,17 C0.8954305,17 0,16.1045695 0,15 L0,4 C0,2.8954305 0.8954305,2 2,2 L2.75,2 L2.75,0.75 L4.25,0.75 Z M13.5,8.25 L1.5,8.25 L1.5,15 C1.5,15.2454599 1.67687516,15.4496084 1.91012437,15.4919443 L2,15.5 L13,15.5 C13.2454599,15.5 13.4496084,15.3231248 13.4919443,15.0898756 L13.5,15 L13.5,8.25 Z M13,3.5 L2,3.5 C1.75454011,3.5 1.55039163,3.67687516 1.50805567,3.91012437 L1.5,4 L1.5,6.75 L13.5,6.75 L13.5,4 C13.5,3.75454011 13.3231248,3.55039163 13.0898756,3.50805567 L13,3.5 Z"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default Calendar