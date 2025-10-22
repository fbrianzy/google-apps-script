# Contributing Guide

Thanks for considering a contribution!

## Development Workflow (flat files)
1. Open **Extensions → Apps Script** from your Google Sheet.
2. Create each file one by one (no folders), paste code from this repository.
3. Reload the spreadsheet and open the panel from **Invoice Tools**.
4. Validate, Preview, then Generate.

## Conventional Commits
Use the format:
```
type(scope): short description
```
Examples:
```
feat(panel): add Open Template button
fix(email): remove invisible characters from body
docs(readme): clarify column mapping
```

## Code Style
- Use modern GAS (V8), avoid fragile regex.
- Keep functions small and single-purpose.
- Prefer pure helpers in `Utils_*.gs` and `Services_*.gs` modules.

## Issues & PRs
- Describe the context, screenshots are welcome.
- For bugs, include the **error message**, file name, and **line number**.
