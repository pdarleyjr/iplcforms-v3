import React, { useState, useEffect } from 'react';
import { useFormAutosave } from '../../src/hooks/useFormAutosave';

// Mock component to test the hook
const TestComponent: React.FC<{
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
  debounceMs?: number;
}> = ({ onSaveSuccess, onSaveError, debounceMs = 2000 }) => {
  const [inputValue, setInputValue] = useState('');
  const [saveCount, setSaveCount] = useState(0);
  
  const { save, status } = useFormAutosave({
    sessionId: 'test-session-123',
    formId: '1',
    userId: 'test-user',
    userName: 'Test User',
    onSaveSuccess: () => {
      setSaveCount(prev => prev + 1);
      onSaveSuccess?.();
    },
    onSaveError,
    debounceMs
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    save({ fieldValue: value });
  };

  return (
    <div>
      <input
        data-cy="test-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type to test autosave"
      />
      <div data-cy="save-count">Save count: {saveCount}</div>
      <div data-cy="save-status">
        {status.saving && 'Saving...'}
        {status.lastSaved && `Last saved: ${status.lastSaved.toISOString()}`}
        {status.error && `Error: ${status.error.message}`}
      </div>
    </div>
  );
};

describe('useFormAutosave Hook', () => {
  beforeEach(() => {
    // Mock the fetch API
    cy.intercept('POST', '/api/form-sessions', {
      statusCode: 200,
      body: { success: true },
      delay: 100 // Simulate network delay
    }).as('saveRequest');
  });

  it('should not trigger save immediately on keystroke', () => {
    cy.mount(<TestComponent debounceMs={2000} />);
    
    // Type a character
    cy.get('[data-cy=test-input]').type('a');
    
    // Wait a short time (less than debounce delay)
    cy.wait(500);
    
    // Verify no save request was made
    cy.get('@saveRequest.all').should('have.length', 0);
    
    // Verify save count is still 0
    cy.get('[data-cy=save-count]').should('contain', 'Save count: 0');
  });

  it('should trigger save after debounce delay', () => {
    cy.mount(<TestComponent debounceMs={2000} />);
    
    // Type a character
    cy.get('[data-cy=test-input]').type('a');
    
    // Wait for debounce delay
    cy.wait(2100);
    
    // Verify save request was made
    cy.wait('@saveRequest').then((interception) => {
      expect(interception.request.body).to.deep.include({
        sessionId: 'test-session-123',
        templateId: 1,
        userName: 'Test User'
      });
      expect(interception.request.body.formData).to.deep.equal({
        fieldValue: 'a'
      });
    });
    
    // Verify save count increased
    cy.get('[data-cy=save-count]').should('contain', 'Save count: 1');
  });

  it('should only trigger one save for multiple rapid keystrokes', () => {
    cy.mount(<TestComponent debounceMs={2000} />);
    
    // Type multiple characters rapidly
    cy.get('[data-cy=test-input]').type('hello');
    
    // Wait for debounce delay
    cy.wait(2100);
    
    // Verify only one save request was made
    cy.get('@saveRequest.all').should('have.length', 1);
    
    // Verify the save contains the final value
    cy.wait('@saveRequest').then((interception) => {
      expect(interception.request.body.formData).to.deep.equal({
        fieldValue: 'hello'
      });
    });
    
    // Verify save count is 1
    cy.get('[data-cy=save-count]').should('contain', 'Save count: 1');
  });

  it('should reset debounce timer on new keystrokes', () => {
    cy.mount(<TestComponent debounceMs={2000} />);
    
    // Type first character
    cy.get('[data-cy=test-input]').type('a');
    
    // Wait 1.5 seconds (less than debounce)
    cy.wait(1500);
    
    // Type another character (should reset the timer)
    cy.get('[data-cy=test-input]').type('b');
    
    // Wait 1 second more (total 2.5s from first keystroke)
    cy.wait(1000);
    
    // Still no save should have occurred
    cy.get('@saveRequest.all').should('have.length', 0);
    
    // Wait another 1.5 seconds (2s from last keystroke)
    cy.wait(1500);
    
    // Now save should occur
    cy.wait('@saveRequest').then((interception) => {
      expect(interception.request.body.formData).to.deep.equal({
        fieldValue: 'ab'
      });
    });
    
    cy.get('[data-cy=save-count]').should('contain', 'Save count: 1');
  });

  it('should handle save errors gracefully', () => {
    // Mock a failed request
    cy.intercept('POST', '/api/form-sessions', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('failedSaveRequest');
    
    const onSaveError = cy.stub();
    
    cy.mount(<TestComponent onSaveError={onSaveError} debounceMs={2000} />);
    
    // Type and trigger save
    cy.get('[data-cy=test-input]').type('test');
    
    // Wait for debounce and request
    cy.wait(2100);
    cy.wait('@failedSaveRequest');
    
    // Verify error callback was called
    cy.wrap(onSaveError).should('have.been.called');
    
    // Verify error is displayed
    cy.get('[data-cy=save-status]').should('contain', 'Error');
  });

  it('should handle multiple separate save operations correctly', () => {
    cy.mount(<TestComponent debounceMs={1000} />);
    
    // First save operation
    cy.get('[data-cy=test-input]').type('first');
    cy.wait(1100);
    cy.wait('@saveRequest');
    cy.get('[data-cy=save-count]').should('contain', 'Save count: 1');
    
    // Wait a bit before next operation
    cy.wait(500);
    
    // Second save operation
    cy.get('[data-cy=test-input]').clear().type('second');
    cy.wait(1100);
    cy.wait('@saveRequest');
    cy.get('[data-cy=save-count]').should('contain', 'Save count: 2');
    
    // Verify both saves happened
    cy.get('@saveRequest.all').should('have.length', 2);
  });
});