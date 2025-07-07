# CSS Architecture

This folder contains the organized CSS architecture for the Craft IT website.

## 📁 Folder Structure

```
styles/
├── main.css                    # Main entry point (imports all styles)
├── README.md                   # This documentation
│
├── 📁 base/                    # Foundation styles
│   ├── reset.css              # CSS reset/normalize
│   ├── variables.css          # CSS custom properties (colors, spacing, etc.)
│   └── typography.css         # Font definitions and text styles
│
├── 📁 layout/                  # Global layout components
│   ├── structure.css          # Site structure and grid
│   └── hero.css               # Hero section styles
│
├── 📁 pages/                   # Page-specific styles
│   ├── index.css              # Homepage styles
│   └── moodys.css             # Moody's/banking services page
│
├── 📁 components/              # Reusable UI components
│   ├── header.css             # Site navigation and header
│   ├── content-section.css    # Content section component
│   └── footer.css             # Site footer
│
└── 📁 utils/                   # Utilities and documentation
    └── breakpoints-ref.css     # Breakpoint reference (documentation)
```

## 🎯 Usage

### Single Import
All styles are imported through one main file:

```html
<link rel="stylesheet" href="resources/styles/main.css">
```

### Import Order
Styles are loaded in the following order for optimal cascading:

1. **Base** - Foundation (reset → variables → typography)
2. **Layout** - Global components (header → hero → footer)
3. **Pages** - Page-specific styles
4. **Components** - Reusable components

## 🔧 Adding New Styles

### For a new component:
1. Create `components/new-component.css`
2. Add import to `main.css` under "COMPONENTS" section

### For a new page:
1. Create `pages/new-page.css`
2. Add import to `main.css` under "PAGES" section

### For global styles:
- **Colors/spacing**: Add to `base/variables.css`
- **Typography**: Add to `base/typography.css`
- **Layout elements**: Add to appropriate `layout/` file

## 🎨 Design System

### CSS Custom Properties
All design tokens are centralized in `base/variables.css`:
- Colors: `--primary`, `--surface`, `--on-surface`, etc.
- Spacing: `--text-base`, `--text-lg`, etc.
- Typography: `--font-primary`, `--font-mono`

### Grid System
Global grid system managed by `.site-grid` class:
- Desktop: 12 columns
- Tablet (1080px): 8 columns
- Mobile (768px): 6 columns
- Small (460px): 4 columns

### Component Architecture
Components follow BEM-like naming with semantic structure:
```css
.content-section          /* Block */
.section-header          /* Element */
.section-category        /* Element */
.section-content--full   /* Modifier */
```

## 📱 Responsive Design

Breakpoints are managed centrally:
- Desktop: > 1080px (12 col grid)
- Tablet: ≤ 1080px (8 col grid)
- Mobile: ≤ 768px (6 col grid)
- Small: ≤ 460px (4 col grid)

## 🚀 Performance

- Single HTTP request for all CSS
- Optimized import order
- Modular architecture for easy maintenance
- Minimal CSS specificity conflicts