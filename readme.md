# DSF Product Altering Script
## **Intro**
This script is designed to perform simple, mass changes to DSF. Changes such as altering a single setting, or adding one additional field of information that would normally take massive amounts of man-hours can be done in the background quickly by this script. This document outlines the general procedures behind altering the code to work for specific cases, and maintaining code through future updates and changes to the DSF website

## **Code Overview**
The code is broken into 3 main sections, with the last section being further broken into 4 sections

### **run.js**
The main body of code, where the entirety of the logic for the script is stored

#### **Dependents**
Importing the necessary code into the script.

1. puppeteer: The Google library being used to navigate the web
2. fs: Library used to write files
3. read-excel-file: Used to read in excel files, the format of information the script is coded for
4. constants: The script expects a file of constants which includes all element and file paths
5. credentials: The script also expects both a username and password to be provided in a seperate file (not included for security purposes)

Potential changes required: likely none, unless new libraries need to be used to add functionality

#### **Functions**
The functions used to assist the script

1. isNumeric: Checks if the character passed in is a numeric character or not
2. removePublisher: The format of products in our DSF database includes a publisher identifier at the beginning which is removed by this function
3. getMessageWithTime: Appends the current time to the beginning of a message, to prepare it to be logged
4. logToConsoleAndLog: Logs a message to both the log and to a non volatile text document
5. generateErrorLog: Updates the error log to be current

Potential changes required: likely none, unless new functions are needed to assist script updates

#### **Main Program**
The main logic the script will follow to perform a given task, further broken down into the following sections:

1. Setup Phase: In this phase, the script navigates to the DSF product page, and logs in using a pre provided account found in the credentials file. Nothing should be changed in this section, as any information that needs changing should be altered in the constants or credentials page. The only exception would be removing the chrome executable path parameters to the puppeteer launch phase to use chromium instead of Chrome
2. Acquire Info Phase: In this phase, the script pulls all of the information it needs from outside sources into local variables to be more readily accessible and easier to use. In it's current state, all information it is referencing is stored in an excel file. This section will likely need to be modified a moderate amount, since all information will likely be pulled in slightly differently. If information is being pulled in in a way other than an excel file, this section will need to be heavily modified
3. Search Phase: In this phase, the script parses through all of the pulled information and attempts to find the next product in DSF. In it's current state it is designed to modify books which come in at most 4 products, and thus is only designed to look at the first 4 products found. This section could be modified to parse through more results, but if a query should only pull 4 or less products, no change should be necessary.
4. Execution Phase: In this phase, the script performs whatever action is desired on the product found in the last phase. In it's current state the script is inputting an ISBN found on the spreadsheet into a couple different text boxes on the product page. This section will likely need to be heavily modified, to perform different actions to products

### **constants.js**
Any constant that is used by the script. These should be documented well inside the code, but references are provided here for confusing elements just in case. This file will require moderate modification in the form of HTML element path's changing, and new constants being added. If an element doesn't seem to be working, it could be caused by a mismatch of paths. To find the path for an element, simply open the page it appears on, navigate to developer tools (usually F11 or ctrl + i) and find the element in the source. (there is usually an option to click on an element as well.) From here, simply right click on the element, go to copy, and select "copy JS path." Paste this into the constants page with the desired identifier, and delete the "Document.querySelector" prefix that comes with copying paths. This will change the path Puppeteer looks for everywhere that path is referenced. Certain paths must be filled in before the script will work at all, namely URL, CHROME_PATH, LOG_PATH, ERROR_LOG_PATH, and SPREADSHEET_PATH

1. URL: The URL of the product page. Logging in directly to the product page allows a login to take the script directly where it needs to go to, without any extra redirects
2. DSF_AFTER_SEARCH_NUMBER_RESULT_(VALUE): These are the HTML elements that show up for the "Name" section on DSF. The first is the complete element, and the second is the element inside that contains the actual text. One is used to check if elements are there, and the other to grab what the element is

### **credentials.js**
The script will look to this file to find the username and password to log in to DSF. Both will need to be changed before the script can work.

## Development Info
This script was developed by Max Ostenson while working at BYU Print and Mail. Any questions or bugs can be directed to max.ostenson@gmail.com