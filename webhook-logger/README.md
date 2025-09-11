# Webhook Data Logger to Google Sheets

## Description

This script transforms a Google Sheet into a data collection endpoint by deploying it as a Web App. It generates a unique URL that can listen for `HTTP POST` requests (a webhook). Any data sent to this URL is automatically timestamped and logged as a new row in the specified spreadsheet, making it an ideal solution for logging events from services like IFTTT, Zapier, GitHub, or custom applications.

## Features

- **Webhook Endpoint**: Creates a public URL to receive data via `HTTP POST` requests.
- **Automatic Timestamp**: Adds a timestamp in the first column for every request received.
- **Flexible Data Handling**: Correctly processes data sent with a `Content-Type` of `application/json` or logs it as plain text for other content types.
- **Reliable Logging**: Appends data to a new row, ensuring existing data is never overwritten.
- **JSON Response**: Provides a standard JSON response (`{status: "success"}` or `{status: "error"}`) to the calling service.

## Setup

**This script requires manual configuration and deployment to function.**

1.  **Configure Script Variables**:
    - Open the script file (`webhook-logger.gs`).
    - Replace `"ID_SPREADSHEET_ANDA_DISINI"` with the actual ID of your target Google Spreadsheet.
    - Replace `"Logs"` with the name of the sheet you want the data to be logged in. The sheet must already exist.

2.  **Deploy as a Web App**:
    - In the Apps Script editor, click `Deploy` > `New deployment`.
    - Click the gear icon next to "Select type" and choose `Web app`.
    - In the configuration settings:
        - For "Execute as", select `Me`.
        - For "Who has access", select `Anyone`.
    - Click `Deploy`.
    - **Authorize** the script when prompted. It will require permission to access Google Sheets.
    - **Copy the provided Web App URL**. This is your unique webhook endpoint.

## Usage

Send `HTTP POST` requests to the Web App URL you obtained after deployment.

### Example with cURL

You can test the endpoint from your terminal using cURL.

**Sending JSON data:**
```bash
curl -L -X POST 'YOUR_WEB_APP_URL' \
-H 'Content-Type: application/json' \
--data-raw '{"user": "test_user", "event": "signed_up", "value": 123}'
```

**Sending Plain Text**
```bash
curl -L -X POST 'YOUR_WEB_APP_URL' \
-H 'Content-Type: text/plain' \
--data-raw 'This is a test log entry.'
```