import React from 'react';
import ReactDOM from 'react-dom/client';
import PDFAnnotatorWrapper from './PDFAnnotatorWrapper';

export default function loadPDFAnnotator(container: HTMLElement, props: any) {
  const root = ReactDOM.createRoot(container);
  
  // Clear loading message
  container.innerHTML = '';
  
  root.render(
    <React.StrictMode>
      <PDFAnnotatorWrapper
        pdfUrl={props.pdfUrl}
        initialAnnotations={props.initialAnnotations}
        readOnly={props.readOnly}
        showToolbar={props.showToolbar}
        height={props.height}
        onAnnotationsChange={(annotations) => {
          // Dispatch custom event for parent components to listen to
          const event = new CustomEvent('pdf-annotations-change', {
            detail: { annotations },
            bubbles: true
          });
          container.dispatchEvent(event);
        }}
        onSave={async (annotations) => {
          // Dispatch custom event for saving
          const event = new CustomEvent('pdf-annotations-save', {
            detail: { annotations },
            bubbles: true
          });
          container.dispatchEvent(event);
          
          // You can also make an API call here
          try {
            const response = await fetch('/api/pdf-annotations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ annotations }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to save annotations');
            }
            
            return await response.json();
          } catch (error) {
            console.error('Error saving annotations:', error);
            throw error;
          }
        }}
      />
    </React.StrictMode>
  );
}