# PDF Annotator Documentation

## Overview

The PDF Annotator is a client-side island component built with React and react-pdf-highlighter that allows users to view, highlight, and annotate PDF documents. It's designed to work within the Cloudflare Workers environment with optimal performance through code splitting and lazy loading.

## Features

### Core Functionality
- **PDF Viewing**: Display PDF documents with zoom and page navigation controls
- **Text Highlighting**: Select text to create colored highlights
- **Area Selection**: Hold Alt and drag to create area highlights
- **Annotations**: Add comments and notes to highlights
- **Multiple Colors**: Choose from 5 different highlight colors (Yellow, Green, Blue, Pink, Purple)
- **Import/Export**: Save and load annotations as JSON files
- **Persistence**: Automatically save annotations to D1 database
- **Read-only Mode**: Support for viewing annotations without editing

### UI Components
- **Toolbar**: Color selector, zoom controls, page navigation, action buttons
- **Sidebar**: View all annotations, statistics, and color distribution
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Installation

The required packages have been installed:
```bash
npm install react-pdf-highlighter pdfjs-dist
```

## Usage

### Basic Implementation

Navigate to `/pdf-viewer` to use the PDF annotator with the default sample PDF.

### With Custom PDF

Pass a PDF URL as a query parameter:
```
/pdf-viewer?pdf=https://example.com/document.pdf
```

### Read-only Mode

To display a PDF with annotations in read-only mode:
```
/pdf-viewer?pdf=document.pdf&readonly=true
```

### Embedding in Forms

You can integrate the PDF annotator into existing forms:

```astro
---
import PDFAnnotator from '../components/pdf/PDFAnnotator.astro';
---

<PDFAnnotator 
  pdfUrl="/path/to/document.pdf"
  initialAnnotations={savedAnnotations}
  readOnly={false}
  showToolbar={true}
  height="600px"
/>
```

## API Endpoints

### GET /api/pdf-annotations
Retrieve annotations for a specific PDF.

**Query Parameters:**
- `pdfUrl` (required): URL of the PDF document

**Response:**
```json
{
  "annotations": [...],
  "updatedAt": "2025-01-07T12:00:00Z"
}
```

### POST /api/pdf-annotations
Save annotations for a PDF.

**Request Body:**
```json
{
  "pdfUrl": "document.pdf",
  "annotations": [
    {
      "id": "highlight-123",
      "content": { "text": "highlighted text" },
      "position": {...},
      "comment": { "text": "My note" },
      "color": "#ffeb3b",
      "createdAt": "2025-01-07T12:00:00Z"
    }
  ]
}
```

### DELETE /api/pdf-annotations
Delete all annotations for a PDF.

**Query Parameters:**
- `pdfUrl` (required): URL of the PDF document

## Component Architecture

### File Structure
```
src/components/pdf/
├── PDFAnnotator.astro          # Astro wrapper component
├── PDFAnnotatorIsland.tsx      # Original React component (deprecated)
├── PDFAnnotatorIslandLoader.tsx # Dynamic loader for React components
├── PDFAnnotatorWrapper.tsx     # Main wrapper with UI controls
└── PDFHighlighterClient.tsx    # Core PDF highlighter implementation
```

### Key Components

1. **PDFAnnotator.astro**: Server-side rendered wrapper that handles initial setup
2. **PDFAnnotatorWrapper.tsx**: Contains toolbar, sidebar, and layout
3. **PDFHighlighterClient.tsx**: Integrates with react-pdf-highlighter library
4. **PDFAnnotatorIslandLoader.tsx**: Handles dynamic loading and event management

## Database Schema

The PDF annotations are stored in the `pdf_annotations` table:

```sql
CREATE TABLE pdf_annotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pdf_url TEXT NOT NULL,
  user_id TEXT,
  annotations TEXT NOT NULL,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Optimizations

### Code Splitting
- PDF components are lazy-loaded using dynamic imports
- Heavy dependencies (pdfjs-dist) are loaded only when needed
- React components are wrapped in Suspense boundaries

### Bundle Optimization
- PDF.js worker is loaded from CDN
- Separate chunks for PDF-related code
- Tree-shaking for unused components

### Cloudflare Workers Compatibility
- No server-side PDF processing
- Client-side only implementation
- Worker-safe PDF.js configuration
- Efficient D1 database queries

## Testing

Run the test suite:
```bash
npm run test:pdf
```

Test files are located in `tests/pdf/pdf-annotator.test.ts`

### Test Coverage
- Component rendering
- API endpoints
- Annotation CRUD operations
- Accessibility compliance
- Performance metrics

## Keyboard Shortcuts

- **Tab**: Navigate between UI elements
- **Space**: Activate selected button
- **Alt + Drag**: Create area highlight
- **Delete**: Remove selected highlight (when not read-only)
- **Ctrl/Cmd + Z**: Undo last action
- **Ctrl/Cmd + Y**: Redo action

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. **File Size**: Large PDFs (>50MB) may experience slower loading
2. **Complex PDFs**: Some complex PDF features may not render perfectly
3. **Mobile**: Touch interactions for highlighting need refinement
4. **Offline**: Requires internet connection for CDN resources

## Troubleshooting

### PDF Not Loading
- Check if PDF URL is accessible
- Verify CORS headers allow cross-origin requests
- Ensure PDF.js worker is loading from CDN

### Annotations Not Saving
- Check browser console for API errors
- Verify D1 database is properly configured
- Ensure migrations have been run

### Performance Issues
- Reduce PDF file size if possible
- Enable browser caching
- Use production build for optimal performance

## Future Enhancements

- [ ] Collaborative annotations with real-time sync
- [ ] Drawing tools for freehand annotations
- [ ] Text search within PDF
- [ ] Annotation categories and tags
- [ ] Export annotations to PDF
- [ ] Mobile touch gesture support
- [ ] Offline mode with service workers
- [ ] Integration with AI for smart highlighting

## Migration Guide

If migrating from another PDF annotation solution:

1. Export existing annotations in JSON format
2. Transform to match our annotation schema
3. Use the import feature or API to load annotations
4. Verify all annotations are correctly positioned

## Security Considerations

- PDFs are loaded client-side only
- No server-side PDF processing or storage
- Annotations are stored separately from PDFs
- User authentication can be added via middleware
- CORS policies should be configured appropriately

## Support

For issues or questions:
1. Check this documentation
2. Review test files for usage examples
3. Check browser console for errors
4. File an issue with reproduction steps

## License

This component uses:
- react-pdf-highlighter (MIT License)
- pdfjs-dist (Apache 2.0 License)