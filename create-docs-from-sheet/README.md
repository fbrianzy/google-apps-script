# Google Docs Generator from Sheet Rows

## Description

This Google Apps Script automates the creation of multiple Google Docs based on data from rows in a Google Sheet. It adds a custom menu named "Doc Generator" to the spreadsheet's UI, making it a powerful tool for generating batch documents like form letters, certificates, or reports.

## Features

- **Custom Menu**: Creates an easy-to-use menu item in Google Sheets to run the script.
- **Batch Processing**: Iterates through all rows in the active sheet and generates a document for each one.
- **Dynamic Content**: Populates each document with data from the corresponding row.
- **Organized Output**: Saves all generated documents into a specified folder in your Google Drive.
- **Status Tracking**: Updates a "Status" column in the sheet to "Created" after a document is successfully generated, preventing duplicate work.

## Setup

**This script requires manual configuration before its first use.**

1.  **Sheet Structure**: Your active Google Sheet must contain columns with the following exact headers:
    - `FileName`: The desired name for the output Google Doc.
    - `Header`: The content that will become the main heading of the document.
    - `Body`: The main paragraph content for the document.
    - `Status`: A column to track the script's progress. Leave it blank initially.

2.  **Set Destination Folder**: You must specify the Google Drive folder where the documents will be saved.
    - Find your destination folder's ID. The ID is the last part of the folder's URL (e.g., `.../folders/THIS_IS_THE_ID`).
    - Open the script file (`create-docs-from-sheet.gs`).
    - **Replace `"ID_FOLDER_ANDA_DISINI"`** with your actual folder ID in this line:
      ```javascript
      const parentFolder = DriveApp.getFolderById("ID_FOLDER_ANDA_DISINI");
      ```

## Usage

1.  Fill your Google Sheet with data according to the structure defined in the Setup section.
2.  From the Google Sheets menu, click `Doc Generator` > `Create Documents from Rows`.
3.  The script will process all rows that do not have "Created" in their `Status` column.
4.  A confirmation message will appear when the process is complete. The `Status` column will be updated accordingly.
