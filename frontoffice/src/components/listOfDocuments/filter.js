import React, { useState, useEffect, useContext } from "react"
import { GlobalContext } from "../layout"
import styled from "styled-components"
import Arrow from "../../images/svg/arrowTop.svg"
import Cross from "../../images/svg/cross.svg"
import FilterSection from "./filterSection"
const clone = require("rfdc")()

export default function ({
  pageType,
  childrenCategories,
  activeFilters,
  listOfDocument,
  numberOfResults,
}) {
  const [filterSections, setFilterSections] = useState([])
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const { lang, wording } = useContext(GlobalContext)

  // GET THE NUMBER OF AVAILABLE DOCUMENTS FOR EACH FILTER SECTION'S ITEM
  useEffect(() => {
    // We use Really Fast Deep Clone (rfdc) to deep clone the ARRAY childrenCategories
    // and avoid data mutability when states will update
    const sections = childrenCategories
      ? clone(childrenCategories.sortedChildren)
      : []
    const yearsFilter = {}

    for (const document of listOfDocument) {
      // Get the year of the document to know how many documents per year there are
      const yearOfDoc = document[lang].year.name
      if (yearsFilter[yearOfDoc]) yearsFilter[yearOfDoc].count += 1
      if (!yearsFilter[yearOfDoc]) {
        yearsFilter[yearOfDoc] = { year: yearOfDoc, count: 1 }
      }

      // If there are sections => the category has filters
      // if not, the only filter available will be the year of publication of the documents
      if (sections.length > 0 && document[lang].category_id) {
        // For each category that the document belongs to...
        for (const categoryId of document[lang].category_id) {
          // And for each of the filter section (= children category lvl1)...
          for (const filterSection of sections) {
            // Compare the document's category id to the filter item (= the category children lvl2)
            filterSection[lang].filterItems.map((filterItem, index) => {
              if (filterItem.id === categoryId) {
                // And increase a counter indicating how many documents are available in each of the filter item
                if (filterSection[lang].filterItems[index][lang].count) {
                  filterSection[lang].filterItems[index][lang].count += 1
                } else {
                  filterSection[lang].filterItems[index][lang].count = 1
                }
              }
            })
          }
        }
      }
    }
    // Sort the filter items to respects the order defined in the BO
    if (sections.length > 0) {
      for (const section of sections) {
        section[lang].filterItems.sort(
          (sectionA, sectionB) => sectionA[lang].weight - sectionB[lang].weight
        )
      }
    }
    // Transform the yearFilter object in an array to be able to sort the data from most recent year
    const yearArray = Object.values(yearsFilter).sort(
      (yearA, yearB) => yearB.year - yearA.year
    )
    // Add the year filter at the beggining of the array 'sections' so it is always displayed first
    sections.unshift(yearArray)
    setFilterSections(sections)
  }, [listOfDocument])

  return (
    <Filter>
      <FilterHeader showFilterMenu={showFilterMenu}>
        <div className="title">
          <h2>
            {pageType === "searchResults"
              ? wording(lang, "Results")
              : "Documents"}
          </h2>
          <div className="numbers">({numberOfResults})</div>
        </div>
        <button
          className="toggleFilterMenu"
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          aria-expanded={showFilterMenu}
        >
          <div>{wording(lang, "FiltersLabel")}</div>
          <div className="svgIcons">
            <div className="arrow">
              <Arrow />
            </div>
            <div className="cross">
              <Cross />
            </div>
          </div>
        </button>
      </FilterHeader>

      <FilterMenu
        showFilterMenu={showFilterMenu}
        numberOfFilters={
          pageType === "searchResults" ? 1 : filterSections.length
        }
      >
        <hr role="presentation" />
        <div className="filter-menu">
          {filterSections.map((section, index) => {
            // Because the data structure of the year filter and the other filter are differents we need two returns
            // The year filter is always available
            if (index === 0) {
              return (
                <FilterSection
                  key={index}
                  yearSection={section}
                  lang={lang}
                  numberOfFilters={filterSections.length}
                />
              )
              // Display the filter section only if there is documents available in it
            } else if (
              pageType !== "searchResults" &&
              section[lang].filterItems.some(
                item =>
                  item[lang].count > 0 ||
                  activeFilters?.categoryIds?.includes(item.id)
              )
            ) {
              return (
                <FilterSection
                  key={index}
                  numberOfFilters={filterSections.length}
                  section={section[lang]}
                  lang={lang}
                />
              )
            }
          })}
        </div>
      </FilterMenu>
    </Filter>
  )
}

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  @media (max-width: 960px) {
    margin-bottom: 0px;
    flex-direction: column;
  }

  > div {
    display: flex;
    align-items: center;
  }
  .title {
    width: 100%;
    @media (max-width: 960px) {
      margin-bottom: 35px;
    }

    h2 {
      margin-right: 10px;
      @media (max-width: 600px) {
        font-size: 22px;
      }
    }
    .numbers {
      font-size: 14px;
      line-height: 24px;
      @media (min-width: 960px) {
        font-size: 18px;
        line-height: 28px;
      }
    }
  }

  .toggleFilterMenu {
    box-sizing: border-box;
    font-family: "Orator W01", Calibri, serif;
    font-size: 18px;
    line-height: 28px;
    display: flex;
    align-items: center;

    @media (max-width: 960px) {
      width: 100%;
      background: var(--floralWhite);
      justify-content: space-between;
      padding: 27px 40px;
    }
    @media (max-width: 600px) {
      padding: 27px 24px;
    }
    .svgIcons {
      margin-left: 10px;
      .cross {
        svg {
          transition: 0.5s transform;
          transform: ${({ showFilterMenu }) =>
            showFilterMenu ? "rotate(180deg)" : "rotate(45deg)"};
        }
        @media (min-width: 960px) {
          display: none;
        }
      }
      .arrow {
        display: flex;
        transition: 0.5s transform;
        transform: ${({ showFilterMenu }) =>
          showFilterMenu ? "rotate(180deg)" : ""};
        @media (max-width: 960px) {
          display: none;
        }
      }
    }
  }
`

const FilterMenu = styled.div`
  display: ${({ showFilterMenu }) => (showFilterMenu ? "block" : "none")};
  background: var(--floralWhite);
  padding: 0 30px 30px;
  @media (min-width: 600px) {
    padding: 0 40px 30px;
  }
  @media (min-width: 960px) {
    padding: 70px 98px 50px;
  }

  .filter-menu {
    @media (min-width: 960px) {
      display: flex;
      justify-content: ${({ numberOfFilters }) =>
        numberOfFilters > 2 ? "space-around" : "flex-start"};
      flex-flow: row wrap;
    }
  }
  hr {
    border: 0;
    border-top: 1px solid var(--grey);
    margin: 0;
    padding: 0;
    @media (min-width: 960px) {
      display: none;
    }
  }
`
const Filter = styled.div`
  margin-bottom: 30px;
  @media (min-width: 600px) {
    margin-bottom: 40px;
  }
  @media (min-width: 960px) {
    margin-bottom: 50px;
  }
`
