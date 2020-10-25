import React, { useContext, useState, useEffect } from "react"
import { GlobalContext } from "./layout"
import axios from "axios"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import { format } from "date-fns"
import { fr, en } from "date-fns/locale"
import TextDivider from "./icons/textDivider"
import Arrow from "./icons/arrow"
import { Link } from "gatsby"
import moment from "moment"

export default () => {
  const { lang, wording } = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(true)
  const [dataAction, setDataAction] = useState(null)

  const [time] = useState(
    moment.utc().format(lang === "fr" ? "HH:mm:ss" : "hh.mm.ss a")
  )

  const formatDate = str => {
    const oldDate = str.split("-")
    const year = oldDate[0].substr(0, 4)
    const month = oldDate[0].substr(4, 2)
    const day = oldDate[0].substr(6, 2)
    const newDateFormat = year + "-" + month + "-" + day + "T" + oldDate[1]
    const date2 = new Date(newDateFormat)
    const date3 = format(
      date2,
      `${lang === "fr" ? "dd MMMM yyyy" : " MMMM dd, yyyy"}`,
      { locale: lang === "fr" ? fr : en }
    )
    return date3
  }
  useEffect(() => {
    axios
      .get(process.env.API_GATEWAY_URL + "/euronext")
      .then(result => {
        setDataAction({
          valorization: result.data.instr
            ? result.data.instr.currInstrSess.valorization
            : null,
          dateTime: formatDate(
            result.data.instr
              ? result.data.instr.currInstrSess.valorizationDateTime
              : null
          ),
          evolution: (
            result.data.instr.perf.filter(perf => perf.perType === "D")[0].var *
            100
          ).toFixed(2),
        })
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  if (!isLoading) {
    return (
      <ExchangeRate>
        <div>{dataAction.dateTime}</div>
        <div>{time} (UTC)</div>
        <Box>
          <TextDivider />
        </Box>
        <Box
          className="valuation"
          display={{ xs: "flex", sm: "flex", md: "none" }}
        >
          <Link
            to={`/${lang}/l-action-hermes/`}
            aria-label={`Cours de l'action: ${dataAction.valorization} €`}
          >
            {dataAction.valorization} €
          </Link>
        </Box>
        <Box
          component={"div"}
          className="valuation"
          display={{ xs: "none", sm: "none", md: "flex" }}
        >
          {dataAction.valorization} €
        </Box>
        <div>
          <Box
            className="changeRate"
            color={dataAction.evolution > 0 ? "var(--green)" : "var(--red)"}
          >
            <Box component="span">{dataAction.evolution} %</Box>
            <Arrow
              direction={dataAction.evolution > 0 ? "up" : "down"}
              color={dataAction.evolution > 0 ? "var(--green)" : "var(--red)"}
              ariaLabel={wording(lang, "ExchangeRate")}
            />
            <Box component="span" className="visually-hidden">
              {wording(lang, "ExchangeRate")}
            </Box>
          </Box>
        </div>
      </ExchangeRate>
    )
  } else {
    return null
  }
}

const ExchangeRate = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  font-family: Helvetica, "Helvetica W01", Arial, sans-serif;
  font-size: 11px;
  letter-spacing: "0";
  @media (max-width: 960px) {
    font-size: 12px;
  }

  > div {
    margin-right: 9px;
  }
  .valuation {
    color: inherit;
  }
  .changeRate {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
  }
`
