# Apryse UI Customization Guide

## Hiding the Default Toolbar

The default Apryse toolbar is now **hidden** to showcase custom controls. This is configured in `PDFViewer.js`.

### Current Configuration

```javascript
WebViewer({
  // ... other options
  disabledElements: [
    'header',           // Main header/toolbar
    'toolsHeader',      // Tools toolbar
    'searchButton',     // Search button
    'menuButton',       // Menu button
    'ribbons',          // Ribbon UI
    'toggleNotesButton', // Notes panel toggle
  ],
  fullAPI: true,
  enableFilePicker: false,
})
```

---

## Show/Hide Options

### Option 1: Show Full Default Toolbar

Remove or comment out the `disabledElements` array:

```javascript
WebViewer({
  path: '/webviewer',
  initialDoc: '/sample.pdf',
  licenseKey: 'YOUR_LICENSE_KEY',
  // disabledElements: [...], // Commented out
})
```

### Option 2: Show Partial Toolbar

Keep some elements, remove others:

```javascript
disabledElements: [
  'toolsHeader',      // Hide annotation tools
  'ribbons',          // Hide ribbon UI
  // Keep 'header' visible for basic controls
]
```

### Option 3: Hide Only Specific Elements

Fine-grained control:

```javascript
disabledElements: [
  'printButton',
  'downloadButton',
  'searchButton',
  // Keep other elements visible
]
```

---

## Available UI Elements to Hide/Show

### Header Elements
- `'header'` - Entire top toolbar
- `'toolsHeader'` - Annotation tools bar
- `'viewControlsButton'` - View controls
- `'searchButton'` - Search functionality
- `'menuButton'` - Main menu
- `'panToolButton'` - Pan tool
- `'selectToolButton'` - Select tool

### Panel Elements
- `'leftPanel'` - Thumbnails/bookmarks panel
- `'notesPanel'` - Annotations/notes panel
- `'searchPanel'` - Search results panel
- `'toggleNotesButton'` - Notes toggle button

### Control Elements
- `'zoomOverlay'` - Zoom controls overlay
- `'printButton'` - Print button
- `'downloadButton'` - Download button
- `'ribbons'` - Ribbon UI elements

---

## Dynamic Show/Hide (After Initialization)

You can toggle UI elements after WebViewer loads:

```javascript
// Inside .then((inst) => { ... })

// Hide elements
inst.UI.disableElements(['header', 'leftPanel']);

// Show elements
inst.UI.enableElements(['header', 'leftPanel']);

// Toggle specific button
inst.UI.disableElements(['printButton', 'downloadButton']);
```

---

## Recommended Configurations

### Minimal UI (Current Setup)
Perfect for custom controls:

```javascript
disabledElements: [
  'header',
  'toolsHeader',
  'searchButton',
  'menuButton',
  'ribbons',
  'toggleNotesButton',
]
```

### Basic PDF Viewer
Simple viewing with navigation:

```javascript
disabledElements: [
  'toolsHeader',
  'ribbons',
  'menuButton',
]
```

### Full-Featured Viewer
Keep all default functionality:

```javascript
// Don't set disabledElements
// Or set it to empty array
disabledElements: []
```

### View-Only Mode
No editing or downloading:

```javascript
disabledElements: [
  'toolsHeader',
  'ribbons',
  'downloadButton',
  'printButton',
]
```

---

## Custom Controls Integration

When hiding the default toolbar (as in this demo), you need custom controls for:

- ✅ **Rotation** - Custom buttons implemented
- ✅ **Zoom** - Custom buttons implemented  
- ✅ **Page Navigation** - Custom buttons implemented
- ✅ **Highlights** - Custom button implemented

See `PDFViewer.js` for implementation examples.

---

## Styling the Viewer

### Full Width Viewer

```css
.webviewer {
  width: 100%;
  height: 100vh; /* Full height */
}
```

### Remove Borders

```javascript
inst.UI.setTheme({
  '@primary-color': '#667eea',
  '@secondary-color': '#764ba2',
});
```

### Dark Mode

```javascript
inst.UI.setTheme('dark');
```

---

## Common Use Cases

### Use Case 1: Embedded Viewer (No Chrome)

```javascript
disabledElements: [
  'header',
  'toolsHeader',
  'leftPanel',
  'searchPanel',
  'notesPanel',
]
```

### Use Case 2: Review/Annotation Mode

```javascript
disabledElements: [
  'downloadButton',
  'printButton',
  // Keep annotation tools visible
]
```

### Use Case 3: Kiosk/Public Display

```javascript
disabledElements: [
  'header',
  'toolsHeader',
  'downloadButton',
  'printButton',
  'searchButton',
],
enableFilePicker: false,
```

---

## Testing Visibility Changes

After modifying `disabledElements`, refresh your browser to see changes.

### Quick Test

1. Comment out `disabledElements` array
2. Save the file
3. Refresh browser
4. You should see the full Apryse toolbar

---

## API Reference

- [Apryse UI Customization](https://docs.apryse.com/documentation/web/guides/customizing-ui/)
- [disableElements API](https://docs.apryse.com/api/web/UI.html#disableElements)
- [enableElements API](https://docs.apryse.com/api/web/UI.html#enableElements)

---

## Current Demo Setup

The demo uses **minimal UI** to highlight the custom control panel on the left. This demonstrates:

1. Complete control over PDF interactions
2. Custom UI design
3. Integration with your app's design system

All PDF functionality is available through the custom buttons - no Apryse toolbar needed!

---

**To restore the default Apryse toolbar:**  
Comment out the `disabledElements` array in `PDFViewer.js` (line ~40).
