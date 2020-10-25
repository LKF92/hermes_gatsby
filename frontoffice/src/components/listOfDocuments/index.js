import React, { useState, useEffect, useContext, createContext } from "react"
import { useDocumentsCategories } from "../../data/documentsCategories"
import { useDocuments } from "../../data/documents"
import { usePages } from "../../data/pages"
import { usePagesRse } from "../../data/pagesRse"
import styled from "styled-components"
import Filter from "./filter"
import ListOfResults from "./listOfResults"
import { GlobalContext } from "../layout"
import parse from "html-react-parser"
import { format, fromUnixTime } from "date-fns"
import moment from "moment-timezone"

export const FilterContext = createContext()

export default ({ pageContext, pageType, searchValue }) => {
  const { lang, wording } = useContext(GlobalContext)
  const allCategoriesOfDocument = useDocumentsCategories()
  const allPages =
    pageType === "searchResults" ? [...usePages(), ...usePagesRse()] : null
  const [isLoading, setIsLoading] = useState(true)
  const [initialData, setInitialData] = useState({})
  const [filteredResults, setFilteredResults] = useState({})
  const [activeFilters, setActiveFilters] = useState({})

  const maxPublicationDate = process.env.GATSBY_PUBLICATION_DATE
    ? moment
        .utc(fromUnixTime(process.env.GATSBY_PUBLICATION_DATE))
        .tz("Europe/Paris")
    : moment.utc(new Date()).tz("Europe/Paris")

  const allDocuments = useDocuments().filter(document => {
    // FILTRE ENVIRONNEMENT
    if (process.env.NODE_ENV === "production") {
      if (document[lang]?.datetime_publication) {
        return (
          moment
            .utc(document[lang].datetime_publication)
            .tz("Europe/Paris")
            .format("YYYYMMDDHHmmss") <=
            moment(maxPublicationDate).format("YYYYMMDDHHmmss") &&
          document[lang]?.status === true
        )
      } else {
        return document[lang]?.status === true
      }
    } else {
      return document[lang]
    }
  })

  //------------------------------------------------------------------------\\
  // 1 :     GET THE INITIAL DATA FOR THE CATEGORY PAGES
  //------------------------------------------------------------------------\\
  useEffect(() => {
    // Get the initial data of :
    // - the main category of the page,
    // - all the subcategories available as filters for that main category,
    // - all the documents that fall under that main category
    if (pageContext && pageType !== "searchResults") {
      const mainCategory = (() => {
        if (pageType === "homepageRse") {
          return allCategoriesOfDocument
            .filter(node => node.fr && node.fr.thematic === "rse")
            .map(node => node)[0]
        } else if (
          pageType === "publications" ||
          pageType === "regulated_information" ||
          pageType === "other_legal_information" ||
          pageType === "officers" ||
          pageType === "the_shareholder_world" ||
          pageType === "general_assembly"
        ) {
          return allCategoriesOfDocument
            .filter(
              node =>
                node[lang] &&
                pageContext[lang]?.type &&
                node[lang].thematic === pageContext[lang].type
            )
            .map(node => node)[0]
        } else {
          return null
        }
      })()

      const childrenCategories = (() => {
        // allCategoryIDs = array of all the sub-category ids (children + grand-children)
        const allCategoryIDs = []
        // children = tree representation of the sub-categories
        const children = {}

        // Get all the children categories (= the filter sections)
        for (const category of allCategoriesOfDocument) {
          if (
            category[lang]?.parent &&
            category[lang]?.parent[0] === mainCategory.id
          ) {
            allCategoryIDs.push(category.id)
            children[category.id] = category
            children[category.id][lang].filterItems = []
          }
        }
        // this category has no children
        if (Object.keys(children).length === 0) return null

        // Add the child's respective children (= the filter items)
        for (const category of allCategoriesOfDocument) {
          if (category[lang]?.parent) {
            const parentID = category[lang]?.parent[0]
            if (Object.keys(children).includes(parentID)) {
              children[parentID][lang].filterItems.push(category)
              allCategoryIDs.push(category.id)
            }
          }
        }

        // Sort the children (filter sections) by 'weight', so it respects the order defined in the BO
        // We transform the children object in an array to be able to sort the data.
        const sortedChildren = Object.values(children).sort(
          (childA, childB) => childA[lang].weight - childB[lang].weight
        )

        return { sortedChildren, allCategoryIDs }
      })()

      const documents = (() => {
        // A document can be linked to the main category, the children and/or grand-children
        const allCategoryIDs = childrenCategories
          ? [mainCategory.id, ...childrenCategories.allCategoryIDs]
          : [mainCategory.id]

        return allDocuments.filter(document => {
          if (document && document[lang] && document[lang].category_id) {
            for (const categoryID of document[lang].category_id) {
              // Check if the document has a categoryID equal to the main category or one of its children
              if (allCategoryIDs.includes(categoryID)) {
                return true
              }
            }
          }
        })
      })()

      setInitialData({ childrenCategories, documents })
      setFilteredResults({ documents: documents })
      setIsLoading(false)
    }
  }, [])

  //------------------------------------------------------------------------\\
  // 1.bis :     GET THE INITIAL DATA FOR THE SEARCH/RESULT PAGE
  //------------------------------------------------------------------------\\
  useEffect(() => {
    // The list of results (documents + pages) is initially filtered by the searchValue only
    if (pageType === "searchResults") {
      const listOfPages = (() => {
        return allPages.filter(page => {
          if (page[lang]) {
            const pageTitle = page[lang]?.title ? parse(page[lang].title) : null
            const pageDescription = page[lang]?.description
              ? parse(page[lang].introduction)
              : null
            // Check if the searchValue appears in the page title or page description
            if (pageTitle && pageTitle.toLowerCase().includes(searchValue))
              return true
            if (
              pageDescription &&
              pageDescription.toLowerCase().includes(searchValue)
            )
              return true
          }
        })
      })()
      // List of all the category ids from the documents filtered
      const listOfCategoryIDs = []

      const listOfDocuments = (() => {
        return allDocuments.filter(document => {
          // Check if the searchValue appears in the page title or page description to filter
          if (document[lang] && document[lang].title) {
            const documentTitle = parse(document[lang].title.toLowerCase())
            if (documentTitle.includes(searchValue)) {
              if (document[lang].category_id) {
                // Add the category ids of this document...if they haven't been added to listOfCategoryIDs already
                document[lang].category_id.forEach(categoryID => {
                  if (!listOfCategoryIDs.includes(categoryID))
                    listOfCategoryIDs.push(categoryID)
                })
              }
              return true
            }
          }
        })
      })()

      // GET THE CHILDREN CATEGORIES (= the available filters)
      const childrenCategories = (() => {
        // children = tree representation of the sub-categories
        const children = {}

        // Get the main categories (they don't have parents)
        const mainCategories = allCategoriesOfDocument
          .map(category => (!category[lang].parent ? category.id : null))
          .filter(category => category)

        // Get all the children categories (= the filter sections)
        for (const category of allCategoriesOfDocument) {
          if (
            category[lang]?.parent &&
            mainCategories.includes(category[lang]?.parent[0])
          ) {
            children[category.id] = category
            children[category.id][lang].filterItems = []
          }
        }
        // this category has no children
        if (Object.keys(children).length === 0) return null

        // Add the child's respective children (= the filter items)
        for (const category of allCategoriesOfDocument) {
          if (category[lang]?.parent) {
            const parentID = category[lang]?.parent[0]
            if (Object.keys(children).includes(parentID)) {
              children[parentID][lang].filterItems.push(category)
            }
          }
        }

        // Sort the children (filter sections) by 'weight', so it respects the order defined in the BO
        // We transform the children object in an array to be able to sort the data.
        const sortedChildren = Object.values(children).sort(
          (childA, childB) => childA[lang].weight - childB[lang].weight
        )

        return { sortedChildren, listOfCategoryIDs }
      })()

      setInitialData({
        childrenCategories,
        documents: listOfDocuments,
        pages: listOfPages,
      })
      setFilteredResults({ documents: listOfDocuments, pages: listOfPages })
      setIsLoading(false)
    }
  }, [searchValue])

  //------------------------------------------------------------------------\\
  // 2 :           GET THE INITIAL FILTERS FROM THE PARAMS
  //------------------------------------------------------------------------\\
  useEffect(() => {
    if (typeof window !== undefined) {
      const queryString = window.location.search
      if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString)
        const typeParams = urlParams.get("type")
        const yearParams = urlParams.get("year")

        const filters = {}
        if (yearParams) filters.year = yearParams
        if (typeParams) {
          filters.categoryIds = decodeURI(typeParams)
            .replace(/\+/g, " ")
            .split(" ")
        }

        setActiveFilters(filters)
      }
    }
  }, [])

  //------------------------------------------------------------------------\\
  // 3 :     UPDATE THE DOCUMENT LIST WITH THE SELECTED FILTERS (checkbox)
  //------------------------------------------------------------------------\\
  useEffect(() => {
    if (initialData.documents) {
      const applyFilters = (documents, activeFilters) => {
        return documents.filter(document => {
          // We filter all the documents that have...
          return Object.keys(activeFilters).every(filter => {
            // ...the same year...
            if (filter === "year") {
              return document[lang]?.year?.name === activeFilters.year
              // AND ALL the selected categories
            } else if (filter === "categoryIds" && activeFilters.categoryIds) {
              return activeFilters.categoryIds.every(categoryID =>
                document[lang]?.category_id.includes(categoryID)
              )
            }
          })
        })
      }

      //--------------------  CATEGORY PAGES --------------------\\
      if (pageType !== "searchResults") {
        // If some filters have been selected, update the list of documents
        if (Object.keys(activeFilters).length > 0) {
          const updatedListofDocuments = applyFilters(
            initialData.documents,
            activeFilters
          )
          setFilteredResults({ documents: updatedListofDocuments })
          // If no filters have been selected...
        } else {
          setFilteredResults({ documents: initialData.documents })
        }

        //--------------------  SEARCH PAGES --------------------\\
        // Same as category page, but taking into account the searchValue
      } else {
        if (Object.keys(activeFilters).length > 0) {
          const updatedListofDocuments = applyFilters(
            initialData.documents,
            activeFilters
          )
          setFilteredResults({ documents: updatedListofDocuments })
          // If no filters have been selected...
        } else {
          if (searchValue) {
            setFilteredResults({
              documents: initialData.documents,
              pages: initialData.pages,
            })
          } else {
            setFilteredResults({ pages: allPages, documents: allDocuments })
          }
        }
      }
    }
  }, [activeFilters, searchValue, initialData])

  const listOfDocument = filteredResults.documents
    ? filteredResults.documents
    : []
  const listOfPages = filteredResults.pages ? filteredResults.pages : []
  const listOfResults = [...listOfPages, ...listOfDocument]

  return (
    <FilterContext.Provider
      value={{ lang, activeFilters, setActiveFilters, maxPublicationDate }}
    >
      {!isLoading && (
        <div id="listOfResults">
          {listOfResults.length > 0 ? (
            <>
              <Filter
                childrenCategories={initialData.childrenCategories}
                numberOfResults={listOfResults.length}
                listOfDocument={listOfDocument}
                pageType={pageType}
                activeFilters={activeFilters}
              />
              <ListOfResults
                listOfResults={listOfResults}
                pageType={pageType}
              />
            </>
          ) : (
            <NoResults>
              <h2>{wording(lang, "noResult")}</h2>
              <p>{wording(lang, "noResultContext")}</p>
            </NoResults>
          )}
        </div>
      )}
    </FilterContext.Provider>
  )
}

const NoResults = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 100px;

  h2 {
    text-align: center;
    font-family: "Courier New";
    font-size: 40px;
    line-height: 46px;
  }
  p {
    margin-top: 30px;
    text-align: center;
    font-family: "Courier New";
    font-size: 18px;
    line-height: 26px;
    max-width: 100%;
  }
`
