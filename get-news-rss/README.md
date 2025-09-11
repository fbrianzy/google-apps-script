# Google News RSS Fetcher

## Description

This Google Apps Script provides a custom function, `GET_NEWS(category, location)`, for Google Sheets. It searches the Google News RSS feed for articles based on a specified category and location, returning the original publisher URLs.

**Important:** This script is hardcoded to search for articles published only within a specific date range: **August 1, 2025, to August 31, 2025**.

## Features

- **News Search**: Queries the Google News RSS feed with a given category and location.
- **URL Extraction**: Implements a multi-step process to resolve Google's redirect links and find the true source URL of the article. This includes:
    - Extracting the URL from link parameters.
    - Manually following redirects if necessary.
- **URL Sanitization**: Cleans the final URL by removing common tracking parameters (e.g., `utm_source`, `gclid`, `fbclid`) and AMP-related paths.
- **Result Limit**: The script is configured to return a maximum of two unique news links per query.
- **Caching**: Caches results for 30 minutes to improve performance and reduce the number of requests for the same query.
- **Default Location**: If the `location` parameter is omitted, the script defaults to searching in "Sidoarjo".
- **Output**: Returns a comma-separated string of URLs. If no articles are found, it returns "tidak ada" (Indonesian for "not available").

## Usage

In any cell in your Google Sheet, you can use the function as follows:

```excel
=GET_NEWS(category, location)
```

## Parameters 

- category (Required): The search term or news category (e.g., "technology").
- location (Optional): The geographical area for the news search (e.g., "Surabaya").

## Example
```excel
=GET_NEWS("property investment", "Surabaya")
```
