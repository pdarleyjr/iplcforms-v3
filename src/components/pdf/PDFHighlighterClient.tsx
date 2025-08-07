import React, { useEffect, useRef, useState } from 'react';
import {
  PdfHighlighter,
  Highlight,
  AreaHighlight,
  Tip,
  PdfLoader,
} from 'react-pdf-highlighter';
import type { IHighlight, NewHighlight, ScaledPosition } from 'react-pdf-highlighter';
import { Loader2 } from 'lucide-react';

// Configure PDF.js worker
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for Cloudflare Workers environment
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PDFHighlighterClientProps {
  pdfUrl: string;
  highlights: IHighlight[];
  onAddHighlight: (highlight: IHighlight) => void;
  onUpdateHighlight: (id: string, updates: Partial<IHighlight>) => void;
  onDeleteHighlight: (id: string) => void;
  selectedColor: { name: string; value: string; rgba: string };
  scale: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onTotalPagesChange: (total: number) => void;
  readOnly?: boolean;
}

const getNextId = () => `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const resetHash = () => {
  document.location.hash = "";
};

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji?: string };
}) =>
  comment.text ? (
    <div className="highlight-popup bg-white shadow-lg rounded p-2 text-sm">
      {comment.emoji && <span className="mr-1">{comment.emoji}</span>}
      {comment.text}
    </div>
  ) : null;

const PDFHighlighterClient: React.FC<PDFHighlighterClientProps> = ({
  pdfUrl,
  highlights,
  onAddHighlight,
  onUpdateHighlight,
  onDeleteHighlight,
  selectedColor,
  scale,
  currentPage,
  onPageChange,
  onTotalPagesChange,
  readOnly = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewerTo = useRef<(highlight: IHighlight) => void>(() => {});

  useEffect(() => {
    const highlightFromHash = parseIdFromHash();
    const highlight = highlights.find(h => h.id === highlightFromHash);
    if (highlight && scrollViewerTo.current) {
      scrollViewerTo.current(highlight);
    }
  }, [highlights]);

  const handleHighlightAdd = (highlight: NewHighlight) => {
    if (readOnly) return;
    
    const newHighlight: IHighlight = {
      ...highlight,
      id: getNextId(),
    };
    
    onAddHighlight(newHighlight);
    resetHash();
  };

  const updateHash = (highlight: IHighlight) => {
    document.location.hash = `highlight-${highlight.id}`;
  };

  return (
    <div className="pdf-highlighter-container h-full">
      <PdfLoader 
        url={pdfUrl} 
        beforeLoad={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        }
        onError={(error) => {
          console.error('PDF loading error:', error);
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500">Failed to load PDF</div>
            </div>
          );
        }}
      >
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event) => !readOnly && event.altKey}
            onScrollChange={resetHash}
            scrollRef={(scrollTo) => {
              scrollViewerTo.current = scrollTo;
            }}
            onSelectionFinished={(
              position: ScaledPosition,
              content: { text?: string; image?: string },
              hideTipAndSelection: () => void,
              transformSelection: () => void
            ) =>
              !readOnly ? (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment: { text: string; emoji: string }) => {
                    handleHighlightAdd({
                      content,
                      position,
                      comment,
                    });
                    hideTipAndSelection();
                  }}
                />
              ) : null
            }
            highlightTransform={(
              highlight,
              index,
              setTip,
              hideTip,
              viewportToScaled,
              screenshot,
              isScrolledTo
            ) => {
              const isTextHighlight = !Boolean(
                highlight.content && highlight.content.image
              );

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
                    if (!readOnly) {
                      onUpdateHighlight(highlight.id, {
                        position: { ...highlight.position, boundingRect } as any,
                      });
                    }
                  }}
                />
              );

              return (
                <div
                  key={index}
                  onMouseEnter={() =>
                    setTip(highlight, (highlight) => (
                      <HighlightPopup comment={highlight.comment} />
                    ))
                  }
                  onMouseLeave={hideTip}
                  onClick={() => updateHash(highlight)}
                  style={{
                    background: selectedColor.rgba,
                    position: 'relative',
                  }}
                >
                  {component}
                </div>
              );
            }}
            highlights={highlights}
          />
        )}
      </PdfLoader>
    </div>
  );
};

export default PDFHighlighterClient;