import React, { useState, useEffect, useContext } from "react"
import { navigate } from "gatsby"
import { FilterContext } from "./index"
import { GlobalContext } from "../layout"
import parse from "html-react-parser"
import styled from "styled-components"
import Arrow from "../../images/svg/arrowTop.svg"
import CheckBox from "../myCheckbox"

export default function ({ section, yearSection, numberOfFilters }) {
  const { setActiveFilters, activeFilters } = useContext(FilterContext)
  const { lang, wording } = useContext(GlobalContext)
  const [showFilterSection, setShowFilterSection] = useState(true)

  // Add the filter to the list of active filter,
  // + update the 'filter' state so that we can display the filter section with one checked checkbox only,
  // + update the url with the filter params
  const handleClickFilter = (event, value) => {
    // Update the url when the user selects filters
    let pathname = window.location.pathname
    let searchParams = window.location.search
    let params = new URLSearchParams(searchParams)

    // If checked, we add the filter (year or sub-category id) to the list of active filters
    if (event.target.checked) {
      const updatedList = { ...activeFilters }
      if (value.year) {
        updatedList.year = value.year
        params.set("year", value.year)
      }
      if (value.id) {
        if (updatedList.categoryIds) {
          updatedList.categoryIds = [...updatedList.categoryIds, value.id]
        } else {
          updatedList.categoryIds = [value.id]
        }
        params.set("type", encodeURI(updatedList.categoryIds.join("+")))
      }
      setActiveFilters(updatedList)
      navigate(`${pathname}?${params.toString()}#listOfResults`)

      // If unchecked, we remove the filter (year or sub-category id) of the list of active filters
    } else {
      const updatedList = { ...activeFilters }
      if (value.year) {
        delete updatedList.year
        params.delete("year")
      }
      if (value.id) {
        updatedList.categoryIds = updatedList.categoryIds.filter(
          categoryID => categoryID !== value.id
        )
        if (updatedList.categoryIds.length === 0) {
          delete updatedList.categoryIds
          params.delete("type")
        } else {
          params.set("type", encodeURI(updatedList.categoryIds.join("+")))
        }
      }
      setActiveFilters(updatedList)
      navigate(`${pathname}?${params.toString()}#listOfResults`)
    }
  }

  return (
    <FilterSection
      showFilterSection={showFilterSection}
      numberOfFilters={numberOfFilters}
    >
      <button
        className="toggle-section"
        onClick={() => setShowFilterSection(!showFilterSection)}
        aria-expanded={showFilterSection}
      >
        <div className="section-title">
          <div>{section ? section.name : wording(lang, "YearLabel")}</div>
        </div>
        <div className="arrow">
          <Arrow />
        </div>
      </button>

      {/* The data structure of the year filter and the other filter section are different */}
      {/* that's why we have to render them separately */}
      <div className="section-body">
        {/* YEAR FILTER */}
        {yearSection &&
          yearSection.map(item => {
            // Return the checked item if a filter is selected,
            if (activeFilters.year && item.year === activeFilters.year) {
              return (
                <div className="section-item">
                  <label htmlFor={"year-filter-" + item?.year}>
                    <div className="checkbox">
                      <CheckBox
                        id={"year-filter-" + item?.year}
                        value={item}
                        title={item?.year}
                        name={wording(lang, "YearLabel")}
                        handleClickFilter={handleClickFilter}
                        checked
                      />
                    </div>
                    <span>
                      {item?.year} ({item?.count}
                      <span className="visually-hidden">
                        {wording(lang, "Results")}
                      </span>
                      )
                    </span>
                  </label>
                </div>
              )
              // Return the unchecked item if it has documents
            } else if (item.count > 0) {
              return (
                <div className="section-item">
                  <label htmlFor={"year-filter-" + item?.year}>
                    <div className="checkbox">
                      <CheckBox
                        id={"year-filter-" + item?.year}
                        value={item}
                        title={item?.year}
                        name={wording(lang, "YearLabel")}
                        handleClickFilter={handleClickFilter}
                      />
                    </div>
                    <span>
                      {item?.year} ({item?.count}
                      <span className="visually-hidden">
                        {wording(lang, "Results")}
                      </span>
                      )
                    </span>
                  </label>
                </div>
              )
              // Don't show the checkbox if it has 0 document
            } else {
              return
            }
          })}
        {/* OTHER FILTERS */}
        {section &&
          section.filterItems.map(item => {
            // Return the checked item if a filter is selected,
            if (
              activeFilters.categoryIds &&
              activeFilters.categoryIds.includes(item.id)
            ) {
              return (
                <div className="section-item">
                  <label htmlFor={"filter-" + item[lang]?.name}>
                    <div className="checkbox">
                      <CheckBox
                        id={"filter-" + item[lang]?.name}
                        value={item}
                        title={item[lang]?.name}
                        name={section.name}
                        handleClickFilter={handleClickFilter}
                        checked
                      />
                    </div>
                    <span>
                      {item[lang]?.name ? parse(item[lang]?.name) : ""} (
                      {item[lang]?.count}
                      <span className="visually-hidden">
                        {wording(lang, "Results")}
                      </span>
                      )
                    </span>
                  </label>
                </div>
              )
              // Return the unchecked item if it has documents
            } else if (item[lang]?.count > 0) {
              return (
                <div className="section-item">
                  <label htmlFor={"filter-" + item[lang]?.name}>
                    <div className="checkbox">
                      <CheckBox
                        id={"filter-" + item[lang]?.name}
                        value={item}
                        title={item[lang]?.name}
                        name={section.name}
                        handleClickFilter={handleClickFilter}
                      />
                    </div>
                    <span>
                      {item[lang]?.name ? parse(item[lang]?.name) : ""} (
                      {item[lang]?.count}
                      <span className="visually-hidden">
                        {wording(lang, "Results")}
                      </span>
                      )
                    </span>
                  </label>
                </div>
              )
              // Don't show the checkbox if it has 0 document
            } else {
              return
            }
          })}
      </div>
    </FilterSection>
  )
}

const FilterSection = styled.div`
  @media (min-width: 960px) {
    min-width: 130px;
    margin-right: ${({ numberOfFilters }) =>
      numberOfFilters > 2 ? "0" : "140px"};
    max-width: 290px;
  }

  button.toggle-section {
    font-family: "Orator W01", Calibri, serif;
    font-size: 18px;
    line-height: 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--grey);

    @media (min-width: 960px) {
      padding: 0;
      font-size: 22px;
      line-height: 28px;
    }
    .section-title {
      text-align: left;
      flex: 1;
      height: 57px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .arrow {
      display: flex;
      transition: 0.5s transform;
      transform: ${({ showFilterSection }) =>
        showFilterSection ? "rotate(180deg)" : ""};
      @media (min-width: 960px) {
        display: none;
      }
    }
  }

  .section-body {
    display: ${({ showFilterSection }) =>
      showFilterSection ? "block" : "none"};
    margin-top: 20px;
    label {
      display: flex;
    }
    .section-item {
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 24px;
      display: flex;
      .checkbox {
        margin-right: 15px;
      }
    }
  }
`
