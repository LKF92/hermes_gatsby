import React, { useEffect, useContext } from "react"
import "./css/addEvent.css"
import AddToCalendar from "react-add-to-calendar"
import styled from "styled-components"
import { GlobalContext } from "../layout"

export default ({ children, eventDetails }) => {
  const { title, description, location, startTime, endTime } = eventDetails
  const { lang } = useContext(GlobalContext)

  // Add accessibility
  useEffect(() => {
    if (typeof window !== undefined) {
      const anchorTag = document.getElementsByClassName(
        "react-add-to-calendar__button"
      )
      let anchorArray = [...anchorTag]
      anchorArray = anchorArray.map(a => {
        a.href = ""
        a.setAttribute("aria-label", title)
        a.innerHTML = `<span class='visually-hidden'>${
          lang === "fr"
            ? `Appuyer sur Entrer pour afficher les options d'ajout au calendrier pour l'évènement : ${title}`
            : `Press Enter to show the available options to add the following event to your calendar : ${title}`
        }</span>`
        a.addEventListener("click", event => {
          event.preventDefault()
        })
      })
    }
  }, [])

  const event = {
    title,
    description,
    location,
    startTime,
    endTime,
  }
  const choices = [
    { google: "Google" },
    { outlook: "Outlook" },
    { outlookcom: "Outlook.com" },
    { apple: "Apple" },
    { yahoo: "Yahoo" },
  ]
  return (
    <Button title="Add to Calendar">
      <AddToCalendar event={event} listItems={choices} />
      {children}
    </Button>
  )
}

const Button = styled.div`
  position: relative;
  width: 100%;
  .react-add-to-calendar {
    height: 100%;
    position: absolute;
    width: 100%;
    & + div {
      pointer-events: none;
    }
  }
  .react-add-to-calendar__wrapper,
  .react-add-to-calendar__button {
    display: block;
    height: 100%;
    width: 100%;
    span {
      display: none;
    }
  }
  .react-add-to-calendar__dropdown {
    background: white;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 10px 26px;
    position: absolute;
    ul {
      margin: 0;
      padding: 20px;
      width: 230px;
    }
    li {
      list-style-image: none;
      list-style-type: none;
      text-align: left;
      i {
        margin-right: 10px;
      }
    }
  }
`
