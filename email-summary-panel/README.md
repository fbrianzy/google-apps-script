# Email Summary Panel (Google Apps Script)
Fetch and summarize Gmail messages directly into Google Sheets.

## Features
- Sidebar interface in Sheets (no CLASP required).
- Fetch Gmail emails by date range, label, or search query.
- Writes summaries to a sheet: Date, From, Subject, Snippet, Labels, etc.

## Setup
1. Open Google Sheets → **Extensions → Apps Script**.
2. Create flat files and paste the code from the project.
3. Reload Sheet → **Email Tools → Open Panel**.

## Column Output
| Column | Description |
|--------|--------------|
| Date | Date & time of message |
| From Name | Sender's display name |
| From Email | Sender's email address |
| Subject | Email subject line |
| Snippet | Message preview text |
| Labels | Gmail labels |
| Message ID | Gmail internal ID |
| Thread ID | Thread identifier |
| Message URL | Direct link to Gmail message |

## Permissions
Requires these scopes (Apps Script will request them automatically):
- `spreadsheets.currentonly`
- `gmail.readonly`
- `script.container.ui`

## License
MIT © 2025 fbrianzy
