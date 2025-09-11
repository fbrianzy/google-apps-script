# Currency Conversion Function

## Description

This Google Apps Script provides a custom function `=GET_CURRENCY_RATE(from, to, amount)` for Google Sheets. It fetches near real-time currency exchange rates using the free Frankfurter.app API to perform conversions directly within your sheet.

## Features

- **Real-time Conversion**: Fetches the latest available exchange rates for accurate conversions.
- **Flexible Use**: Converts a specific amount of a currency. If the amount is not specified, it defaults to 1.
- **Efficient Performance**: Caches the results for 4 hours to minimize API calls and speed up calculations on repeated queries.
- **Error Handling**: Returns clear error messages if a currency code is invalid or the API request fails.

## Usage

Use the function directly in any cell of your Google Sheet.

### Syntax
```excel
=GET_CURRENCY_RATE(from, to, amount)
```

## Parameters 

- from (Required): The 3-letter currency code of the source currency (e.g., "USD").
- to (Required): The 3-letter currency code of the target currency (e.g., "IDR").
- amount (Optional): The numeric value to convert. Defaults to 1 if omitted.

## Example

To convert 150 US Dollars to Indonesian Rupiah:

```excel
=GET_CURRENCY_RATE("USD", "IDR", 150)
```

To find the exchange rate for 1 Euro to Japanese Yen:

```excel
=GET_CURRENCY_RATE("EUR", "JPY")
```
