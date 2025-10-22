# 🧾 Invoice Generator Panel (Google Apps Script)

Generate professional invoices from Google Sheets to Google Docs/PDF via a clean Sidebar Panel. 
Supports column mapping, template placeholders, auto-numbering, tax/discount, status, generated date, and optional email to client.

## ✨ Features
- Sidebar panel (no CLASP required) with column mapping (letters) and options.
- Generate **Google Docs** from a **template** + export **PDF** to Drive.
- Auto-numbering (`INV-YYYY-####`) or pull invoice number from a sheet column.
- Tax & discount support; write back links (Doc/PDF), status, and generated date.
- Optional email to client with the PDF attached.
- Works on **V8 runtime**, minimal, production-ready.

## 🏁 Quickstart
1. Open your Google Sheet → **Extensions → Apps Script**.
2. Create flat files one-by-one (no folders) and paste the script contents from this repo.
3. Add your Google Docs template; include placeholders (see below).
4. Reload the Sheet → menu **Invoice Tools** → **Open Panel**.
5. Fill the panel (IDs, rows, column letters, options) → **Validate** → **Preview** → **Generate**.

## 🧩 Column Mapping (example)
| Column | Example Letter |
|---|---|
| Client Name | `B` |
| Client Email | `C` |
| Invoice Date (`yyyy-mm-dd`) | `D` |
| Due Date (`yyyy-mm-dd`) | `E` |
| Currency | `F` |
| Items (multiline: `Desc | Qty | Unit`) | `G` |
| Notes | `H` |
| Doc Link (output) | `I` |
| PDF Link (output) | `J` |
| Generated Date (output, optional) | `K` |
| Status (output, optional) | `L` |
| Invoice Number (optional, read from sheet) | `A` |

## 🧱 Template Placeholders (Google Docs)
Add these tokens to your template (plain text):
```
{{INVOICE_NUMBER}}
{{CLIENT_NAME}}
{{CLIENT_EMAIL}}
{{INVOICE_DATE}}
{{DUE_DATE}}

{{ITEMS_TABLE}}

Subtotal: {{SUBTOTAL}}
Tax ({{TAX_RATE}}): {{TAX}}
Discount: {{DISCOUNT}}
Total: {{TOTAL}}

Status: {{STATUS}}
Notes:
{{NOTES}}

{{COMPANY_NAME}}
{{COMPANY_ADDRESS}}
{{COMPANY_LOGO}}
```
> `{{ITEMS_TABLE}}` will be replaced by a table with **Description / Qty / Unit Price / Amount**.

## 🔐 Permissions (Scopes)
This project requires these OAuth scopes (declared in `appsscript.json`):
- `spreadsheets.currentonly` – read/write the current spreadsheet.
- `documents` – generate and edit Google Docs.
- `drive` + `drive.file` – read files by ID, copy template, and write PDF to Drive.
- `script.container.ui` – show the sidebar panel.
- `script.send_mail` – send email with PDF attachment (optional feature).

## 🧪 Dummy Data (for testing)
Create a sheet named **`Invoices`** and paste the following rows (starting at row 1):
```
A: Invoice No | B: Client Name | C: Client Email | D: Invoice Date | E: Due Date | F: Currency | G: Items (Desc | Qty | Unit) | H: Notes | I: Doc Link | J: PDF Link | K: Generated Date | L: Status

(leave empty) | Andi Pratama | andi@example.com | 2025-10-01 | 2025-10-15 | IDR | Website Design | 2 | 1500000
Hosting | 1 | 500000 | Thanks for your business.
(leave empty) | Sari Dewi | sari@example.com | 2025-10-03 | 2025-10-17 | IDR | Data Analysis | 3 | 200000
Dashboard | 1 | 750000 | Please pay via bank transfer.
```
*(Multiline items: put each line as `Description | Qty | Unit` in the same cell. See examples in the repository.)*

## ⚙️ Panel Options
- **Tax Rate (%), Discount (%)** → totals will be computed as `total = subtotal + tax − discount`.
- **Default Status** → value written back to the Status column.
- **Send Email** → sends PDF to the client email (if present).

## 🧰 Troubleshooting
- **Invalid regular expression error** → ensure `Utils_StringUtils.parseItemsMultiline` uses **non-regex** split (the provided code already does).
- **Invalid or unexpected token** → re-paste `Services_EmailService.gs` from this repo to remove hidden characters.
- **Missing permissions prompt** → run once and grant scopes; switch to **V8 runtime** in Project Settings.
- **File/Folder not found** → verify **Template Doc ID** and **Output Folder ID**.

## 📝 Versioning & Changelog
We follow Keep a Changelog and Conventional Commits. See `CHANGELOG.md`.

## 🤝 Contributing
Contributions are welcome! See `CONTRIBUTING.md`.

## 📜 License
MIT © 2025 Bagus Febriansyah Pratama
