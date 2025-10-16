# CIO Viewpoint Dashboard

A comprehensive, interactive dashboard for displaying CIO (Chief Investment Officer) viewpoints across equity factors, asset classes, and sectors.

## Features

- **Three Interactive Tables**: Equity Factors, Asset Class Views, and Sector Views
- **Real-time Editing**: Double-click any cell to edit content
- **Weight Indicators**: Visual dots showing investment positions (1-5 scale)
- **Trend Visualization**: Triangular indicators for upward/downward trends
- **JSON Export**: Preview and copy current dashboard data
- **Persistent Storage**: Changes saved automatically to localStorage
- **Professional UI**: Clean, responsive design with Tailwind CSS

## Quick Start

1. Open `index.html` in your web browser
2. Use the top-right buttons to view or copy JSON data
3. Double-click any content to edit
4. Click weight dots to change positions
5. Your changes are saved automatically

## JSON Data Structure

The dashboard uses `combined_dashboard_data.json` with the following structure:

### Root Structure
```json
{
  "dashboardInfo": {
    "title": "CIO Viewpoint Dashboard",
    "subtitle": "Key Drivers of Equities",
    "lastUpdated": "October 2025"
  },
  "equityFactors": { /* Table 1 data */ },
  "assetClassViews": { /* Table 2 data */ },
  "table3Views": { /* Table 3 data */ }
}
```

### Table 1: Equity Factors (`equityFactors.factors`)
```json
{
  "factor": "Growth",           // Factor name
  "1wk": "+",                  // 1-week outlook (+, -, or =)
  "1mth": "-",                 // 1-month outlook
  "3mth": "=",                 // 3-month outlook
  "separate": 0                // Visual separator (0 or 1)
}
```

### Table 2: Asset Classes (`assetClassViews.assetClasses`)
```json
{
  "assetClass": "US Equities",  // Asset class name
  "position": 4,               // Weight position (1-5 scale)
  "comments": "Overweight",    // Comments/description
  "separate": 0                // Visual separator (0 or 1)
}
```

**Position Scale:**
- `1-2`: Underweight (red dots)
- `3`: Neutral (yellow dot)
- `4-5`: Overweight (green dots)
- `-1`: Hidden (no dots shown)

### Table 3: Sectors (`table3Views.sectores`)
```json
{
  "sector": "Technology",      // Sector name
  "position": 3,              // Weight position (1-5 scale)
  "trend": 1,                 // Trend direction (1=up, -1=down, 0=none)
  "comments": "Neutral view",  // Comments/description
  "separate": 0               // Visual separator (0 or 1)
}
```

**Trend Values:**
- `1`: Upward trend (shows ▲ triangle)
- `-1`: Downward trend (shows ▼ triangle)
- `0`: No trend (no triangle)

## Visual Indicators

### Weight Dots
- **Red**: Underweight positions (1-2)
- **Yellow**: Neutral position (3)
- **Green**: Overweight positions (4-5)
- **Hidden**: When position = -1

### Trend Triangles (Table 3 only)
- **Green ▲**: Upward trend (left of current position)
- **Red ▼**: Downward trend (right of current position)

### Row Highlighting
- **Red background**: Rows with any trend (up or down)
- **Border lines**: Visual separators when `separate: 1`

## Editing Features

- **Text Editing**: Double-click any text cell
- **Weight Changes**: Click dots to change positions
- **Trend Editing**: Double-click triangles in Table 3
- **Bulk Operations**: Edit multiple items via detailed modals

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Storage**: localStorage for persistence
- **Data Format**: JSON
- **Browser Support**: Modern browsers with ES6+ support

## File Structure

```
├── index.html                     # Main dashboard file
├── combined_dashboard_data.json   # Data source
└── README.md                     # This file
```