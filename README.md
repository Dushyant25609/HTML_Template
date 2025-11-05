# CIO Viewpoint & Document Builder

This repository contains two primary experiences:

1. Interactive CIO Viewpoint Dashboard (`index.html`) – quick, table-focused view of factors, asset classes and sectors.
2. Rich Multi‑Section Document Builder (`document.html` + `format.html`) – author, edit, and export a full multi-page CIO report (12 logical steps/sections) with inline and bulk editing, JSON paste/import/export, and print‑ready layout.

## Core Capabilities

- Inline editing (double‑click anywhere marked editable)
- Bulk edit modals (Factors table; Section 6 economic forecasts & sidebar)
- Weight indicators (dots 1–5, hidden if -1)
- Trend visualization (arrows / triangles / row styling)
- Dynamic component system in `format.html` (paragraphs, numbered-bottom-line, bottom-line, compare table, subsections, table-data, etc.)
- JSON: live preview, copy, paste/import, localStorage persistence
- Print optimization (A4 sizing, fixed first-page footer, multi-page overflow splitting)

## File Overview

```
├── index.html                  # Simplified dashboard (3 tables)
├── document.html               # Full report (Sections 1–11 editable + JSON paste)
├── format.html                 # Authoring / form-driven builder creating JSON structure
├── data.json                   # Example document data (used by format/document)
├── combined_dashboard_data.json# Example dashboard-only data
├── assets/                     # Images & font resources
├── README.md                   # This file
```

## Data Models

### Dashboard (`combined_dashboard_data.json`)
Root keys: `dashboardInfo`, `equityFactors`, `assetClassViews`, `table3Views`.

#### Equity Factors Item
```
{ "factor": "Growth", "1wk": "+", "1mth": "-", "3mth": "=", "separate": 0 }
```

#### Asset Class Item
```
{ "assetClass": "US Equities", "position": 4, "comments": "Overweight", "separate": 0 }
```
Position meanings: 1–2 underweight, 3 neutral, 4–5 overweight, -1 hidden.

#### Sector Item
```
{ "sector": "Technology", "position": 3, "trend": 1, "comments": "Neutral view", "separate": 0 }
```
Trend: 1 up, -1 down, 0 none.

### Document Builder (`documentData` in localStorage / pasted JSON)
Uses `step1` … `step12` objects. Common examples:

- `step1`: documentTitle, documentMonth, disclaimer
- `step2`: summary.components (array of component objects), tableData for CIO Asset Class Views (sidebar in doc)
- `step3`: factors table (equity factors with trend/value/implication)
- `step7`: economic forecasts + sidebar (bulk edit modal for both tables)
- … remaining steps map to sections 3–11 in `document.html` (watch lists, sector valuation, subsections, strategies, important disclosures, etc.)

Component types (in `format.html` collection logic):
- `paragraph` (content)
- `header` (heading)
- `bullet-points` (heading + left/right columns)
- `subsections` (array of { heading, content })
- `numbered-bottom-line` (mainHeading, bulletPoints[], bottomLine { heading, content })
- `compare-table` (dual column headings, points arrays)
- `bottom-line` (subsections + bottomLine text)
- `table-data` (asset class headers + assetClasses definitions)

Recent fix: numbered-bottom-line now correctly captures `bottomLine.heading` and `bottomLine.content` after placeholder selector adjustments.

## Editing Interactions

| Action | How |
| ------ | ---- |
| Inline text edit | Double-click element (opens multi-field dialog when needed) |
| Weight change | Click a dot (updates position & category) |
| Trend change (factors/asset classes/sectors) | Double-click row/handle/triangle depending on table |
| Bulk factors edit | Click "Edit All Factors" button (document.html Section 2 factors table) |
| Bulk Section 6 edit | Click "Edit All Section 6 Data" (economic forecasts & EPS table + sidebar) |
| Add bullets/subsections | Use appropriate Add buttons in `format.html` wizard |
| Paste JSON | Use Paste icon button (document.html) – dialog accepts full JSON; immediate re-render without page reload |

Dialogs support: Esc to cancel, overlay click to close, Enter or Save buttons to commit, optional Ctrl+Enter in textareas.

## Import / Export Workflow

### In `document.html`
- Paste: Click Paste JSON → paste full `documentData` JSON → Load JSON → instant render.
- Copy: Copy JSON button copies current state from memory/localStorage.
- Local persistence: Updates saved to `localStorage` under key `documentData`.

### In `format.html`
- Build structured content via steps/components.
- Use JSON viewer to copy generated structure for `document.html` ingestion (paste dialog).

## Bulk Edit Modals
Implemented for:
- Factors (edit trend, value, CIO view, comments, hide flag, auto implication)
- Section 6 Economic Forecasts (edit headers, rows, footnotes, sidebar title/content, second table headers/subheaders/rows/footnote)

Focus trapping, Esc handling, and deferred saving (no changes persisted until Save All).

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Paste JSON silently not updating earlier (legacy) | Only `DocumentData` updated, not `documentData` | Fixed – both synced & immediate re-render |
| Bottom line fields empty in JSON | Placeholder mismatch (case sensitivity) | Fixed selector logic (case-insensitive) |
| Headers duplicate after multiple loads | Direct `innerHTML +=` in populate functions | Reload page or adjust populate to clear first (future improvement) |
| Trend triangles misaligned | Position or trend fields missing | Ensure position (1-5) and trend (-1,0,1) both set |

## Recommended JSON Paste Shape (Minimal Example)
```json
{
  "step1": {"documentTitle": "Monthly CIO Update", "documentMonth": "Oct 2025", "disclaimer": "..."},
  "step2": {"summary": {"components": []}, "tableData": {"headers": {"assetClassHeader": "Asset Class", "cioViewHeader": "CIO View"}, "footnote": "", "data": []}},
  "step3": {"tableData": {"data": []}},
  "step7": {"tableData": {"header": [], "data": [], "footnote": ""}, "rightContainer": {"title": "Economic Forecasts", "content": "", "tableData": {"header": [], "subheader": [], "data": [], "footnote": ""}}}
}
```

## Development Notes / Next Improvements

- Normalize populate functions to clear headers before appending to avoid duplication.
- Extract inline styles flagged by linters into a shared stylesheet.
- Add schema validator & graceful partial merge for pasted JSON.
- Provide add/remove row controls inside bulk modals.

## License
Internal usage example – add licensing details if distributing.

---
For questions or enhancements, open an issue or extend the component logic in `format.html` and rendering functions in `document.html`.