import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { AnnotationState, Annotation } from '../../../lib/pdf/annotations';
import { addAnnotation, updateAnnotation, removeAnnotation } from '../../../lib/pdf/annotations';
import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight
} from 'react-pdf-highlighter';
import type {
  IHighlight,
  NewHighlight,
  ScaledPosition,
  Content,
  ViewportHighlight
} from 'react-pdf-highlighter';

// Import pdfjs and configure worker
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.js', import.meta.url).toString();

interface PdfAnnotatorProps {
  src: string | ArrayBuffer;
  onChange?: (s: AnnotationState) => void;
  initial?: AnnotationState;
}

// Convert our annotation format to react-pdf-highlighter format
function annotationToHighlight(annotation: Annotation): IHighlight {
  return {
    id: annotation.id,
    position: {
      boundingRect: {
        x1: annotation.rect[0],
        y1: annotation.rect[1],
        x2: annotation.rect[2],
        y2: annotation.rect[3],
        width: annotation.rect[2] - annotation.rect[0],
        height: annotation.rect[3] - annotation.rect[1],
        pageNumber: annotation.page
      },
      rects: [{
        x1: annotation.rect[0],
        y1: annotation.rect[1],
        x2: annotation.rect[2],
        y2: annotation.rect[3],
        width: annotation.rect[2] - annotation.rect[0],
        height: annotation.rect[3] - annotation.rect[1],
        pageNumber: annotation.page
      }],
      pageNumber: annotation.page
    },
    content: {
      text: annotation.note || ''
    },
    comment: {
      text: annotation.note || '',
      emoji: ''
    }
  };
}

// Convert react-pdf-highlighter format to our annotation format
function highlightToAnnotation(highlight: NewHighlight): Annotation {
  const rect = highlight.position.boundingRect;
  return {
    id: Math.random().toString(36).substr(2, 9),
    page: highlight.position.pageNumber || 1,
    rect: [rect.x1, rect.y1, rect.x2, rect.y2],
    note: highlight.content?.text || '',
    color: '#ffeb3b'
  };
}

export default function PdfAnnotatorIsland({ src, onChange, initial }: PdfAnnotatorProps) {
  const [annotationState, setAnnotationState] = useState<AnnotationState>(
    initial || { byId: {}, order: [] }
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Convert ArrayBuffer to URL if needed
  useEffect(() => {
    if (typeof src === 'string') {
      setPdfUrl(src);
    } else {
      const blob = new Blob([src], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [src]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(annotationState);
    }
  }, [annotationState, onChange]);

  // Convert annotations to highlights
  const highlights = Object.values(annotationState.byId).map(annotationToHighlight);

  const handleAddHighlight = useCallback((highlight: NewHighlight) => {
    const annotation = highlightToAnnotation(highlight);
    setAnnotationState(state => addAnnotation(state, annotation));
  }, []);

  const handleUpdateHighlight = useCallback((highlightId: string, position: ScaledPosition, content: Content) => {
    const rect = position.boundingRect;
    setAnnotationState(state => updateAnnotation(state, {
      id: highlightId,
      rect: [rect.x1, rect.y1, rect.x2, rect.y2],
      note: content.text || ''
    }));
  }, []);

  const handleDeleteHighlight = useCallback((highlightId: string) => {
    setAnnotationState(state => removeAnnotation(state, highlightId));
  }, []);

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: highlight.position.boundingRect.y1,
        behavior: 'smooth'
      });
    }
  }, [highlights]);

  const getHighlightById = (id: string) => {
    return highlights.find(h => h.id === id);
  };

  const parseIdFromHash = () => {
    return window.location.hash.slice('#highlight-'.length);
  };

  const resetHighlights = () => {
    setAnnotationState({ byId: {}, order: [] });
  };

  if (!pdfUrl) {
    return (
      <div data-testid="pdf-annotator" aria-label="PDF Annotator" className="pdf-annotator-container">
        <div className="pdf-error">No PDF source provided</div>
      </div>
    );
  }

  return (
    <div 
      data-testid="pdf-annotator" 
      aria-label="PDF Annotator" 
      className="pdf-annotator-container"
      style={{
        height: '750px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        padding: '10px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div>
          <strong>PDF Annotator</strong>
          {highlights.length > 0 && (
            <span style={{ marginLeft: '10px', color: '#666' }}>
              ({highlights.length} annotation{highlights.length !== 1 ? 's' : ''})
            </span>
          )}
        </div>
        <button
          onClick={resetHighlights}
          disabled={highlights.length === 0}
          style={{
            padding: '5px 10px',
            backgroundColor: highlights.length > 0 ? '#dc3545' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: highlights.length > 0 ? 'pointer' : 'not-allowed',
            fontSize: '14px'
          }}
        >
          Clear All
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }} ref={scrollRef}>
        <PdfLoader 
          url={pdfUrl} 
          beforeLoad={<div className="pdf-loading">Loading PDF...</div>}
          onError={(error: Error) => {
            setError(error.message);
            setIsLoading(false);
          }}
        >
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={scrollToHighlightFromHash}
              scrollRef={(scrollTo) => {
                // Store scroll function if needed
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <div
                  style={{
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Add a note..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          const note = input.value.trim();
                          if (position && content) {
                            handleAddHighlight({
                              content: { ...content, text: note },
                              position,
                              comment: { text: note, emoji: '' }
                            });
                            hideTipAndSelection();
                          }
                        }
                      }}
                      style={{
                        width: '200px',
                        padding: '5px',
                        border: '1px solid #ddd',
                        borderRadius: '3px'
                      }}
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => {
                        if (position && content) {
                          handleAddHighlight({
                            content,
                            position,
                            comment: { text: '', emoji: '' }
                          });
                          hideTipAndSelection();
                        }
                      }}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={hideTipAndSelection}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !(highlight.content && highlight.content.image);

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      // Convert LTWHP (left, top, width, height) to Scaled format
                      const scaledPosition: ScaledPosition = {
                        boundingRect: {
                          x1: boundingRect.left,
                          y1: boundingRect.top,
                          x2: boundingRect.left + boundingRect.width,
                          y2: boundingRect.top + boundingRect.height,
                          width: boundingRect.width,
                          height: boundingRect.height,
                          pageNumber: boundingRect.pageNumber || highlight.position.pageNumber
                        },
                        rects: [],
                        pageNumber: boundingRect.pageNumber || highlight.position.pageNumber
                      };
                      handleUpdateHighlight(
                        highlight.id,
                        scaledPosition,
                        highlight.content
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={
                      <div style={{ padding: '10px', maxWidth: '250px' }}>
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Annotation</strong>
                        </div>
                        {highlight.comment?.text && (
                          <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                            {highlight.comment.text}
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteHighlight(highlight.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    }
                    onMouseOver={(popupContent) => setTip(highlight, () => popupContent)}
                    onMouseOut={hideTip}
                    key={index}
                  >
                    {component}
                  </Popup>
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderTop: '1px solid #f5c6cb'
        }}>
          Error loading PDF: {error}
        </div>
      )}
    </div>
  );
}