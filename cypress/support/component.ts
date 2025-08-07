/// <reference types="cypress" />

// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Custom mount command for React component testing
declare global {
  namespace Cypress {
    interface Chainable {
      mount(component: React.ReactNode): Chainable<any>;
    }
  }
}

// Simple mount implementation for React components
Cypress.Commands.add('mount', (component: React.ReactNode) => {
  // Create a container element
  const container = document.createElement('div');
  container.id = 'cypress-root';
  document.body.appendChild(container);
  
  // Import React and ReactDOM dynamically
  return cy.window().then((win: any) => {
    const React = win.React || require('react');
    const ReactDOM = win.ReactDOM || require('react-dom/client');
    
    // Render the component
    const root = ReactDOM.createRoot(container);
    root.render(component);
    
    // Return the container for chaining
    return cy.get('#cypress-root');
  });
});