# 📰 Google News Panel (Apps Script)

A Google Sheets add-on panel that automates fetching Google News RSS results for each category and location, with smart caching and link cleanup.
Built using **Google Apps Script** with a clean sidebar GUI.

## Features
- Fetch news links by **category & region (single cell)** within a **date range**
- Supports **A1-based input** (e.g., `B2` → `B100`)
- **Batch mode** with caching (`CacheService`, 30 min)
- Sidebar GUI (HTML Service)
- Works with multiple sheets

## Usage
1. Open your Google Sheet → **Extensions → Apps Script**
2. Create two files: `Code.gs` and `Sidebar.html` and paste the code from this folder
3. Reload the spreadsheet → you’ll see menu **“News Tools”**
4. Click `Open Panel` → fill in:
   - Sheet Name (optional)
   - Category Column (`B2` → `B100`)
   - Region (single cell, e.g., `C1`)
   - Output Column (`D2` → `D100`)
   - Start & End Dates
   - Max Links per Category
5. Click **Run**

Results will appear in your chosen output column.

## Custom Function
You can still use it directly in a cell:
```js
=GET_NEWS(B2, "Sidoarjo")
```

## 📄 License
MIT License © 2025 Bagus Febriansyah Pratama
