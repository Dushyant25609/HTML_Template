<div align="center">
<h1>CIO Viewpoint & Multi‑Section Report Builder</h1>
<p><strong>Create, edit, and publish a print‑ready CIO investment viewpoint with structured JSON data, inline dialogs, and bulk-edit modals.</strong></p>
</div>

---

## 1. Overview

This codebase supports two complementary workflows:

1. Authoring & Structuring (via `format.html`) – build the report JSON using guided components (bullet lists, subsections, tables, comparison modules, bottom-line and numbered-bottom-line blocks, asset class tables, etc.).
2. Editing, Layout & Publishing (via `document.html`) – load or paste JSON, refine every section inline or in bulk dialogs, and print/export the final multi-page A4 report.

An optional lightweight “dashboard” experience (historically `index.html`) can show a reduced set of tables; if missing locally, you can adapt from `document.html` table rendering logic.

---

## 2. Key Features

- 12-step data model (step1 .. step12) mapped to distinct sections (Title, Executive Summary, Dashboard, Equities, Fixed Income, Alternatives, Asset Class Views, Sector Views, Thematic Investing, Definitions, Disclosures, etc.).
- Rich component system (paragraph, header, bullet-points, subsections, numbered-bottom-line, bottom-line, compare-table, table-data) with JSON serialization in `format.html`.
- Inline editing (double-click anywhere marked editable) with multi-field dialogs for complex entities (e.g., sector valuation rows, numbered bullet points, bottom-line blocks).
- Bulk edit modals: Factors table (Section 2) & Section 6 Economic Forecasts dual tables + sidebar content.
- Visual weight indicators (1–5 dots) + trend markers (up/down/neutral) across multiple tables.
- Automatic localStorage persistence (`documentData` key) and manual JSON paste/import dialog.
- Print optimizations (A4 sizing, first-page fixed footer, overflow splitting to new pages).
- Implication auto-calculation for factors based on numeric value (0/25 = Negative, 50 = Neutral, 75/100 = Positive).
- Accessibility improvements: focus trapping, Esc handling, small keyboard hints.

---

## 3. File & Directory Structure

```
├── document.html          # Primary multi-section editable report
├── format.html            # Component-driven JSON builder (authoring UI)
├── data.json              # Example full multi-step JSON data (steps 1–12)
├── combined_dashboard_data.json (optional / legacy) # Simplified dashboard JSON
├── assets/                # Images & fonts
└── README.md              # Documentation
```

If `index.html` is absent, you can derive a slim dashboard by extracting the factors, asset class views, and sector rendering functions from `document.html`.

---

## 4. Data Model (High-Level)

Each top-level `stepN` object encapsulates a logical section. Notable examples from `data.json`:

| Step | Purpose | Key Fields |
|------|---------|------------|
| step1 | Cover meta | documentTitle, documentMonth, disclaimer |
| step2 | Executive summary & asset class view sidebar | inBrief[], cioAssetClassViews, hyperlinks[], summary.components[], tableData (asset classes) |
| step3 | Factors dashboard | title, description, tableData.headers, data[] (factor, trend, value, cioView) |
| step4 | Equities narrative | title, subsections[], rightContainer.equityWatchList[], riskConsiderations[], sectorValuation.data[] + axisConfig |
| step5 | Fixed Income | subsections[] (heading, content) |
| step6 | Alternatives strategies & subsections | container content, altStrategies[], subsection[] |
| step7 | Economic forecasts + sidebar (bulk editable) | tableData (header[], data[][], footnote), rightContainer (title, content, tableData second table) |
| step8 | Asset Class Views extended (weight indicators + trends) | data[] rows with position, trend, comments |
| step9 | Thematic Investing | headers[], data[] thematic blocks |
| step10 | Index Definitions | disclaimer, definitions[] |
| step11 | Additional definitions / disclaimers | title, subsection data |
| step12 | Important Disclosures | disclosures[], copyright |

### Component Types (format.html serialization)
```
paragraph              -> { type, content }
header                 -> { type, heading }
bullet-points          -> { type, heading, leftPoints[], rightPoints[] }
subsections            -> { type, subsections:[{ heading, content }] }
numbered-bottom-line   -> { type, mainHeading, bulletPoints:[{ subheading, content }], bottomLine:{ heading, content } }
bottom-line            -> { type, subsections:[{ subheading, content }], bottomLine: "text" }
compare-table          -> { type, mainHeading1, subHeading1, mainHeading2, subHeading2, leftPoints[], rightPoints[] }
table-data             -> { type, headers:{ assetClassHeader, cioViewHeader }, assetClasses:[...] }
```
Recent fix: numbered-bottom-line bottomLine.heading & bottomLine.content reliably captured (case-insensitive placeholder matching).

---

## 5. Editing Interaction Reference

| Interaction | Trigger | Result |
|-------------|---------|--------|
| Inline text | Double-click element | Opens dialog (single or multi-field) |
| Factor value/trend | Double-click factor row or range handle | Popover to adjust numeric value & trend |
| Bulk factors | Click “Edit All Factors” | Modal lists all rows, Save All commits |
| Section 6 bulk | Click “Edit All Section 6 Data” | Modal for both tables + sidebar |
| Weight indicator | Click dot | Updates position & recalculates weight category |
| Trend triangle | Double-click or part of row edit | Adjusts directional trend (-1,0,1) |
| Paste JSON | Paste button → dialog | Parses, replaces `documentData`, instant re-render |
| Copy JSON | Copy button | Places current JSON on clipboard |
| Save updates | Save button | Writes JSON to localStorage (and optionally file if integrated) |

Keyboard: Esc cancels dialogs, Enter/Ctrl+Enter commits (varies by field), Tab cycles focus (trapped in modals).

---

## 6. Import / Export Workflow

### From `format.html` → `document.html`
1. Open `format.html` and assemble components across steps.
2. Use the JSON viewer to copy generated structure.
3. Open `document.html`, click Paste JSON, insert copied JSON, Load JSON.
4. Refine layout and wording with inline editors.

### Direct JSON Paste (document.html)
1. Click Paste JSON button.
2. Paste a full JSON object with step keys.
3. Press Load JSON – immediate render (no page refresh required post-fix).
4. Optionally Print / Export after review.

### Persistence
Local edits automatically saved into `localStorage` under key `documentData` (capitalization unified across logic after recent patch).

---

## 7. Printing & Layout Notes

- A4 page sizing & margins defined in CSS with media print rules.
- First page footer fixed; overflow content is programmatically split into subsequent pages.
- Keep long paragraphs concise to avoid awkward page breaks; consider strategic subsectioning.

---

## 8. Extending the System

| Goal | Approach |
|------|----------|
| Add new component type | Define markup & collection logic in `format.html` (update `collectComponentData`) + rendering & edit handling in `document.html` |
| Add bulk edit for another section | Create modal markup + traversal of data arrays + safe save routine + re-render call |
| Validate pasted JSON | Implement schema (e.g., AJV) & soft warnings for missing steps |
| Remove inline styles | Consolidate into shared stylesheet / Tailwind utility classes |
| Support partial JSON merges | Deep merge by step keys instead of wholesale replacement |

---

## 9. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|-----------|
| Paste dialog loads but nothing changes | JSON parsed but selectors earlier only updated `DocumentData` | Fixed: both `DocumentData` & `documentData` now sync, re-render immediately |
| Duplicate headers after multiple pastes | Populate functions append via `innerHTML +=` | Clear header containers before repopulate (future enhancement) |
| Bottom-line fields missing in JSON | Placeholder case mismatch | Fixed with case-insensitive attribute selectors |
| Trend visuals off | Missing trend/position | Ensure value + trend present; neutral = 0 / 50 |
| Factors implication not matching expectation | Value mapping differs | Adjust logic (value thresholds) in bulk save routine if needed |

---

## 10. Minimal Valid JSON Skeleton
```json
{
  "step1": {"documentTitle": "Title", "documentMonth": "Month", "disclaimer": "..."},
  "step2": {"inBrief": [], "cioAssetClassViews": "", "hyperlinks": [], "summary": {"components": []}, "tableData": {"headers": {"assetClassHeader": "Asset Class", "cioViewHeader": "CIO View"}, "footnote": "", "data": []}},
  "step3": {"title": "Dashboard", "description": "", "tableData": {"headers": {"factorHeader": "Factor", "implicationHeader": "Implication", "cioViewHeader": "CIO View"}, "subtitle": "", "data": []}},
  "step7": {"tableData": {"header": [], "data": [], "footnote": ""}, "rightContainer": {"title": "Economic Forecasts", "content": "", "tableData": {"header": [], "subheader": [], "data": [], "footnote": ""}}}
}
```

---

## 11. Development Checklist

- [ ] Add clearing logic before repopulating headers
- [ ] Externalize inline styles flagged by lint
- [ ] Implement schema validation for paste
- [ ] Add row add/remove inside bulk modals
- [ ] Provide dark mode variant (Tailwind theme extension)

---

## 12. License & Attribution

Internal illustrative tooling. Add license text if this is distributed externally.

---

## 13. Quick Start (TL;DR)

1. Open `format.html` → build content → copy JSON.
2. Open `document.html` → Paste JSON → refine with inline/bulk editors.
3. (Optional) Adjust factors & economic forecast tables in bulk modals.
4. Copy / print / export final report.

---

For enhancements, modify component collection (`format.html`) and section population or dialog rendering logic (`document.html`).