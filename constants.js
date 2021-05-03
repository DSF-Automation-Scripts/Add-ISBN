module.exports = {
    //URL of the starting page
    URL: "<DSF Product Page URL>",

    //System file path to the Chrome executable
    CHROME_PATH: "<Log to Chrome .exe>",

    //System file path to both log and error log
    LOG_PATH: "<Path to desired log location>",
    ERROR_LOG_PATH: "<Path to desired error log location>",

    //Show advanced login options button on main login screen of DSF 
    DSF_SHOW_ADVANCED_LOGIN_OPTIONS: "body > div.wrapper.ng-scope > div > div:nth-child(1) > div.login-single.ng-scope > div:nth-child(3) > div > div.modalcontent > form > div:nth-child(4) > a",

    //DSF login username
    DSF_USERNAME_TEXT_BOX: "body > div.wrapper.ng-scope > div > div:nth-child(1) > div.login-single.ng-scope > div:nth-child(3) > div > div.modalcontent > form > div:nth-child(5) > div.login-as-customer-container > div.customer-container-column > input.textbox",
   
    //DSF login password
    DSF_PASSWORD_TEXT_BOX: "#loginPwd",

    //DSF login button
    DSF_LOGIN_BUTTON: "body > div.wrapper.ng-scope > div > div:nth-child(1) > div.login-single.ng-scope > div:nth-child(3) > div > div.modalcontent > form > div:nth-child(5) > div.login-as-customer-container > div.customer-container-column > div.login-actions > button",
    
    //Element used to see if login was successful. Currently using header of DSF product view
    DSF_LOGIN_CHECK_ELEMENT: "#displayName_SmartSearchInput",

    //Display as search text box in product view of DSF
    DSF_DISPLAY_AS_SEARCH_TEXT_BOX: "#displayName_SmartSearchInput",

    //After search, the result's elements or text values
    DSF_AFTER_SEARCH_FIRST_RESULT: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(1) > td:nth-child(5) > p-celleditor > div > md-grid-link-data > div > a",
    DSF_AFTER_SEARCH_FIRST_RESULT_TEXT_VALUE: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(1) > td:nth-child(5) > p-celleditor > div > md-grid-link-data > div > a > span",
    DSF_AFTER_SEARCH_SECOND_RESULT: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(2) > td:nth-child(5) > p-celleditor > div > md-grid-link-data > div > a",
    DSF_AFTER_SEARCH_SECOND_RESULT_TEXT_VALUE: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(2) > td:nth-child(5) > p-celleditor > div > md-grid-link-data > div > a > span",
    DSF_AFTER_SEARCH_THIRD_RESULT: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(3) > td:nth-child(5) > p-celleditor > div > md-grid-link-data > div > a",
    DSF_AFTER_SEARCH_THIRD_RESULT_TEXT_VALUE: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(3) > td:nth-child(5) > p-celleditor > div > md-grid-link-data > div > a > span",
    DSF_AFTER_SEARCH_FOURTH_RESULT: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(4) > td:nth-child(5) > p-celleditor > div > md-grid-link-data > div > a",
    DSF_AFTER_SEARCH_FOURTH_RESULT_TEXT_VALUE: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(4) > td:nth-child(5) > p-celleditor > div > md-grid-link-data > div > a > span",
    
    //Save and exit button inside of a product
    DSF_PRODUCT_SAVE_AND_EXIT_BUTTON: "#ctl00_ctl00_C_M_ctl00_W_StartNavigationTemplateContainerID_ctl00_BtnSaveAndExit",

    //Id text box on the first page of a product
    DSF_PRODUCT_ID_TEXT_BOX: "#ctl00_ctl00_C_M_ctl00_W_ctl01__SKU",

    //Footer text box on the first page of a product
    DSF_PRODUCT_DESCRIPTION_FOOTER_TEXT_BOX: "#ctl00_ctl00_C_M_ctl00_W_ctl01_txtUnitsOfMeasure",

    //Element used to check if a query has been performed. Currently, it's the little blue box that DSF shows after a search occurs
    DSF_SEARCH_QUERIED_CHECK: "#aspnetForm > div.dot-rightpane > div.ctr-page > div > div:nth-child(2) > md-root:nth-child(1) > div > div.dot-wrapper > md-app-mdff > div.dot-rightpane > md-manage-products > div > md-users-filters-views > div.filterstring.row.m-0.bulk-actions-row.ng-star-inserted > div > p-chips > div > ul > li.ui-chips-token.ui-state-highlight.ui-corner-all.ng-star-inserted",
    
    //The x for the little blue search box
    DSF_SEARCH_QUERIED_CLOSE_BUTTON: "#aspnetForm > div.dot-rightpane > div.ctr-page > div > div:nth-child(2) > md-root:nth-child(1) > div > div.dot-wrapper > md-app-mdff > div.dot-rightpane > md-manage-products > div > md-users-filters-views > div.filterstring.row.m-0.bulk-actions-row.ng-star-inserted > div > p-chips > div > ul > li.ui-chips-token.ui-state-highlight.ui-corner-all.ng-star-inserted > span.ui-chips-token-icon.pi.pi-fw.pi-times.ng-star-inserted",
    
    //Loading animation that DSF plays while querying results
    DSF_SEARCH_SPINNER: "#aspnetForm > div.dot-rightpane > div.ctr-page > div > div:nth-child(2) > md-root:nth-child(1) > div > div.spinner.ng-star-inserted > p-progressspinner > div > svg",

    //Element to check if a query returned no results, currently "No Results Found" text that appears
    DSF_NO_RESULTS_CHECK: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr > td > span",

    //Path to publisher spreadsheets
    SPREADSHEET_PATH: "Spreadsheet path",

    //Indexes of values on the spreadsheets
    SPREADSHEET_ISBN_INDEX: 1, //Index of ISBN column in spreadsheet
    SPREADSHEET_TITLE_INDEX: 5 //Index of title column in spreadsheet
};