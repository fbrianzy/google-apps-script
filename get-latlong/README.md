# Get Latitude & Longitude Coordinates

## Description

This Google Apps Script project provides two custom functions for Google Sheets: `GetLatitude(address)` and `GetLongitude(address)`. These functions convert a human-readable address into its corresponding geographic coordinates (latitude and longitude).

This script utilizes the built-in Google Maps Geocoding service available in Google Apps Script\.

## Features

- **`GetLatitude(address)`**: Takes a text address and returns its latitude.
- **`GetLongitude(address)`**: Takes a text address and returns its longitude.
- **Error Handling**: Returns "Not Found" if an address cannot be geocoded.
- **Empty Input**: Returns a blank cell if the input address is empty.

## Setup

Before using these functions, you must enable the **Maps Service** in the Google Apps Script editor:
1.  Open the script editor.
2.  On the left sidebar, click the **+** icon next to "Services".
3.  Select **Google Maps Geocoding API** and click "Add".

## Usage

In any cell in your Google Sheet, you can use the functions as follows:

### GetLatitude
```excel
=GetLatitude("Eiffel Tower, Paris")
```

### Get Longitude
```excel
=GetLongitude("Statue of Liberty, New York")
```

The address parameter can be a string or a reference to another cell containing the address.
