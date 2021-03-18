//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//1. DEPENDENTS
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Puppeteer framework to navigate web
const puppeteer = require("puppeteer");

//Fs for writing to log and error log
const fs = require("fs");

//Read-excel-file used to pull information from excel file
const readExcelFile = require("read-excel-file/node");

//File containing all constants
const constants = require("./constants");

//File containing credentials
const credentials = require("./credentials");

run();

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//2. FUNCTIONS
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Function isNumeric
//Purpose: Checks if a given char/digit is numeric
//Returns: True if numeric, false otherwise
//Parameters: Char or single digit
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//Function removePublisher
//Purpose: Remove undesired information at beginning of product names
//Returns: Altered product name
//Parameters: Product name to modify
function removePublisher(product) {

    //Check if there are any spaces at the beginning
    while(product[0] === ' ') {
        product = product.substring(1);
    }

    //Figure out publisher and remove appropriate char count
    if (product.substring(0, 7).includes("DB POD")) {
        return product.substring(7);
    }
    else if (product.substring(0, 3).includes("DB") || product.substring(0, 2).includes("CF")) {
        return product.substring(3);
    }
    else if (product.substring(0, 4).includes("COV")) {
        return product.substring(4);
    }
    else {
        return "Didn't recognize product format.";
    }
}

//Function getMessageWithTime
//Purpose: Takes a message (usually to be logged) and appends the current time to the beginning
//Returns: Given parameter with time appended to the front
//Parameters: Message to append time to
function getMessageWithTime(message) {
    let today = new Date();
    let date = today.getDay() + '/' + today.getMonth() + '/' + today.getFullYear() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ": ";
    return date + message;
}

//Function logToConsoleAndLog
//Purpose: Takes a message and logs it to both the console and to a non volatile text file
//Returns: None
//Parameters: Message to log
function logToConsoleAndLog(message) {
    console.log(message);
    fs.appendFile(constants.LOG_PATH, message + '\n', function (err) {
        if(err) throw err;
    })
}

//Function generateErrorLog
//Purpose: Delete old error log and update it with current error log
//Returns: None
//Parameters: Errors that need logged
function generateErrorLog(errors) {
    let errorLog = "Failed attempts:" + '\n';
    for(let i = 0; i < errors.length; i++) {
        errorLog += errors[i] + '\n';
    }
    fs.writeFile(constants.ERROR_LOG_PATH, errorLog, (err) => {
        if(err) throw err;
    });
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//3. MAIN PROGRAM
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function run() {
    try {

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //3a. SETUP PHASE
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        
        //Erase old log file
        fs.writeFile(constants.LOG_PATH, "", (err) => {
            if(err) throw err;
        });

        //Launch Chrome and open a new page
        console.clear();
        logToConsoleAndLog("*** START LOG ***");
        logToConsoleAndLog(getMessageWithTime("Launching Chrome"));
        const browser = await puppeteer.launch({
            headless: false,
            //Remove this to launch Chromium instead of Chrome
            executablePath: constants.CHROME_PATH
        });
        const page = await browser.newPage();

        //Go to main site
        logToConsoleAndLog(getMessageWithTime("Navigating to " + constants.URL));
        await page.goto(constants.URL);
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        //Login
        await page.click(constants.DSF_SHOW_ADVANCED_LOGIN_OPTIONS, {
            waitUntil: "networkidle0"
        });

        //Enter username and password
        await page.waitForSelector(constants.DSF_LOGIN_BUTTON);
        await page.type(constants.DSF_USERNAME_TEXT_BOX, credentials.USERNAME);
        await page.type(constants.DSF_PASSWORD_TEXT_BOX, credentials.PASSWORD);
        logToConsoleAndLog(getMessageWithTime("Logging in"));
        await page.click(constants.DSF_LOGIN_BUTTON);
        try {

            //If redirected, successful login
            await page.waitForSelector(constants.DSF_LOGIN_CHECK_ELEMENT, {timeout: 4000});
            loggedIn = true;
        }
        catch (err) {

            //If not redirected, invalid credentials
            throw("loginError");
        }

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //3b. ACQUIRE INFO PHASE
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        //Read in books to process and store them
        logToConsoleAndLog(getMessageWithTime("Reading in books to update"));
        let bookList = [];
        let failedAttempts = [];

        //Read excel file
        await readExcelFile(constants.SPREADSHEET_PATH).then((rows) =>{

            //Remove all rows prior to book table
            while(rows[0][0] === null) rows.shift();
            rows.shift();

            //Create book object (array)
            //Book array content is:
            //0: Title
            //1. ISBN
            for (let i = 0; i < rows.length; i++) {
                let book = [];

                //Grab title and remove prefix
                let title = rows[i][constants.SPREADSHEET_TITLE_INDEX].substring(3);

                //Check for spaces at beginning or end and remove
                while(title[0] === ' ') {
                    title = title.substring(1);
                }
                while(title[title.length - 1] === ' ') {
                    title = title.slice(0, -1);
                }

                //Check for book size at end of title and remove
                if(isNumeric(title[title.length - 1])) {
                    while(isNumeric(title[title.length - 1]) || title[title.length - 1] === 'X' || title[title.length - 1] === 'x' || title[title.length - 1] === '.') {
                        title = title.slice(0, -1);
                    }

                    //Remove trailing space
                    title = title.slice(0, -1);
                }

                //Create book object and add it to list of books to update
                book.push(title, rows[i][constants.SPREADSHEET_ISBN_INDEX]);
                bookList.push(book);
            }
        });
        logToConsoleAndLog(getMessageWithTime("Read in " + bookList.length + " books"));

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //3c. SEARCH PHASE
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        //Go through each book and update ISBN
        for (let i = 0; i < bookList.length; i++) {
            logToConsoleAndLog(getMessageWithTime("Adding ISBN for book: " + bookList[i][0]));

            //Find book in DSF
            //
            //Allow initial load to finish
            while(await page.$(constants.DSF_SEARCH_SPINNER) !== null) {
                await page.waitForTimeout(100);
            }

            //Query title
            await page.type(constants.DSF_DISPLAY_AS_SEARCH_TEXT_BOX, bookList[i][0]);
            await page.keyboard.press("Enter");

            //Allow load to finish
            await page.waitForSelector(constants.DSF_SEARCH_QUERIED_CHECK);
            while(await page.$(constants.DSF_SEARCH_SPINNER) !== null) {
                await page.waitForTimeout(100);
            }

            //Ensure results were found, log if not
            try {

                //If this passes, no results were found
                await page.waitForSelector(constants.DSF_NO_RESULTS_CHECK, {timeout: 100});
                logToConsoleAndLog("*** WARNING ***");
                logToConsoleAndLog(getMessageWithTime("No results found for book: " + bookList[i][0] + ". Please check that the name in the spreadsheet and in DSF match exactly"));
                failedAttempts.push(bookList[i][0]);
                generateErrorLog(failedAttempts);
            }

            //Results were found
            catch (err) {

                //Read the text values of the item names, and find which one is the book kit
                //***IMPORTANT***
                //Script assumes multiple titles won't pull up with a query and will get stuck if book doesn't show up in the first four products.
                //This could be solved by using a for loop to alter the HTML path for the resulting elements and run through every result that is queried on the first page.
                //Alternatively, you can just click on the desired book product when it gets stuck and the script will take back over.
                try {

                    //Read the first result and check if it's the book
                    let firstResultElem = await page.$(constants.DSF_AFTER_SEARCH_FIRST_RESULT_TEXT_VALUE);
                    let firstResultVal = await page.evaluate(el => el.textContent, firstResultElem);

                    //This will become the new page that is opened by clicking on the product
                    const newPagePromise = new Promise(x => browser.once("targetcreated", target => x(target.page())));

                    //Check if "Book" appears right after the publisher and click on product if so
                    if(removePublisher(firstResultVal).substring(0, 5).toUpperCase().includes("BOOK")) {
                        await page.click(constants.DSF_AFTER_SEARCH_FIRST_RESULT);
                    }

                    //Since first result wasn't the book, try the second or third
                    else {
                        try {
                            //Read the second and thrid results and check if either is the book
                            let secondResultElem = await page.$(constants.DSF_AFTER_SEARCH_SECOND_RESULT_TEXT_VALUE);
                            let secondResultVal = await page.evaluate(el => el.textContent, secondResultElem);
                            let thirdResultElem = await page.$(constants.DSF_AFTER_SEARCH_THIRD_RESULT_TEXT_VALUE);
                            let thirdResultVal = await page.evaluate(el => el.textContent, thirdResultElem);

                            //Check if "Book" appears right after the publisher and click on product if so
                            if(removePublisher(secondResultVal).substring(0, 5).toUpperCase().includes("BOOK")) {
                                await page.click(constants.DSF_AFTER_SEARCH_SECOND_RESULT);
                            }
                            else if (removePublisher(thirdResultVal).substring(0, 5).toUpperCase().includes("BOOK")) {
                                await page.click(constants.DSF_AFTER_SEARCH_THIRD_RESULT);
                            }

                            //Since third ruselt wasn't the book, check if a fourth exists, else log and throw error
                            else {
                                try {
                                    //Read the fourth result and check if it's the book
                                    let fourthResultElem = await page.$(constants.DSF_AFTER_SEARCH_FOURTH_RESULT_TEXT_VALUE);
                                    let fourthResultVal = await page.evaluate(el => el.textContent, fourthResultElem);

                                    //Check if "Book" appears right after the publisher and click on the product if so
                                    if (removePublisher(fourthResultVal).substring(0, 5).toUpperCase().includes("BOOK")) {
                                        await page.click(constants.DSF_AFTER_SEARCH_FOURTH_RESULT);
                                    }
                                }
                                catch (err) {

                                    //Results were found, but none were the book product
                                    logToConsoleAndLog("*** WARNING ***");
                                    logToConsoleAndLog(getMessageWithTime("Results were found for book: " + bookList[i][0] + " , but none were found to be the book kit. Please check the product in DSF to ensure it is made and named correctly"));
                                    failedAttempts.push(bookList[i][0]);
                                    generateErrorLog(failedAttempts);
                                    throw("");
                                }
                            }
                        }

                        //Less than three results were found
                        catch (err) {
                            if (err != "") {
                                throw ("lessThanThreeResults");
                            }
                            else {
                                throw err;
                            }
                        }
                    }

                    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    //3d. EXECUTION PHASE
                    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

                    //Now in product page
                    //
                    //Grab the new tab that was opened
                    const productTab = await newPagePromise;

                    //Input ISBN to appropriate fields
                    if(bookList[i][1] === null) {

                        //If no ISBN is there, error and log book
                        logToConsoleAndLog("*** WARNING ***");
                        logToConsoleAndLog(getMessageWithTime("ISBN not found for book: " + bookList[i][0] + ". Please add ISBN to spreadsheet"));
                        failedAttempts.push(bookList[i][0]);
                        generateErrorLog(failedAttempts);
                    }
                    else {

                        //Input ISBN into desired fields
                        logToConsoleAndLog(getMessageWithTime("Inputting the ISBN: " + bookList[i][1] + " into book: " + bookList[i][0]));
                        await productTab.waitForSelector(constants.DSF_PRODUCT_ID_TEXT_BOX, {visible: true});
                        await productTab.click(constants.DSF_PRODUCT_ID_TEXT_BOX, {clickCount: 3});
                        await productTab.keyboard.press("Backspace");
                        await productTab.type(constants.DSF_PRODUCT_ID_TEXT_BOX, String(bookList[i][1]));
                        await productTab.click(constants.DSF_PRODUCT_DESCRIPTION_FOOTER_TEXT_BOX, {clickCount: 3});
                        await productTab.keyboard.press("Backspace");
                        await productTab.type(constants.DSF_PRODUCT_DESCRIPTION_FOOTER_TEXT_BOX, String(bookList[i][1]));
                    }

                    //Save and exit tab
                    await productTab.click(constants.DSF_PRODUCT_SAVE_AND_EXIT_BUTTON);
                    await page.waitForSelector(constants.DSF_LOGIN_CHECK_ELEMENT, {visible: true});
                    logToConsoleAndLog(getMessageWithTime("Successfully added ISBN to book: " + bookList[i][0]));
                    await productTab.close();
                }

                //Less than three results were found
                catch (err) {
                    if (err !== "") {
                        logToConsoleAndLog("*** WARNING ***");
                        logToConsoleAndLog(getMessageWithTime("After querying the book: " + bookList[i][0] + " less than three results were found. Please check the product in DSF to ensure it is made and named correctly"));
                        failedAttempts.push(bookList[i][0]);
                        generateErrorLog(failedAttempts);
                    }
                }
            }

            //Clear search and wait for initial load again
            await page.click(constants.DSF_SEARCH_QUERIED_CLOSE_BUTTON);
            while(await page.$(constants.DSF_SEARCH_SPINNER) !== null) {
                await page.waitForTimeout(100);
            }
        }

        //Display finished message and output failed attempts to a text file
        logToConsoleAndLog(getMessageWithTime("Finished running. Failed attempts have been added to a text file located at " + constants.ERROR_LOG_PATH));
        generateErrorLog(failedAttempts);
        await page.close();
        process.exit(0);
    }
    catch (err) {

        //Login error
        if(err === "loginError") {
            logToConsoleAndLog("*** ERROR ***");
            logToConsoleAndLog(getMessageWithTime("Login failed. Check credentials"));
            process.exit(1);
        }

        //Default error case
        else {
            logToConsoleAndLog("*** ERROR ***");
            logToConsoleAndLog(getMessageWithTime("Something went wrong. Error:"));
            logToConsoleAndLog(getMessageWithTime(err));
            process.exit(2);
        }
    }
}