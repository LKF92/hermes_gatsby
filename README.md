# Hermès Finance 
Frontend realized for Hermès from March to August 2020.
[See the website in production](https://finance.hermes.com/)
Most of this work was realized by myself with the help and supervision of a senior developer. 

## Description
* Built a modular system by taking advantage of Gatsby’s templates as well as React and Styled-components to
create a library of reusable components to be utilised by the back-office.
* Used of diverse librairies (Material-UI, React-Select, React-add-to-calendar, React-slick, etc.)
* Integrated data coming from Drupal, using Gatsby's GraphQL queries.
* Internationalization (i18n) and compliance with the WCAG 2.1 AA accessibility standard.
* Usage of OpenAPI and Prism in the beggining of the development process to describe the desired structure of the API for the frontend development.

## Details about the project structure
* Data from the Drupal API is processed in gatsby-node.js
* Layout is a wrapper component that allows to centralize a lot of style and wrap the application with global state
* The data folder groups all the graphQL queries
* In component, you can find the 'blocks' folder that contains all the blocks that can be utilised by Hermès to create a new page from their backoffice in Drupal.
* The folder 'listOfDocument' is a complex component that displays a list of documents available for download. The data it receives differs depending on the page. Only some categories of documents will be available for each page, which also change the filters available to the user. This component is also use in the search page where the search query filter the data (instead of the page it is on).  
You can see the different pages here :
- https://finance.hermes.com/en/search/?search=meeting </br> 
- https://finance.hermes.com/en/a-value-creating-and-sustainable-french-model </br> 
- https://finance.hermes.com/en/other-legal-information </br>  
- https://finance.hermes.com/en/general-meetings </br> 
- https://finance.hermes.com/en/publications </br> 
- https://finance.hermes.com/en/regulated-information </br> 

