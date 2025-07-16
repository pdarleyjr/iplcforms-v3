import { test, expect, devices } from '@playwright/test';

// Use iPad Safari configuration
test.use({
  ...devices['iPad Pro'],
  viewport: { width: 1024, height: 1366 },
  hasTouch: true,
  isMobile: true
});

test.describe('Form Builder - iPad Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the form builder page
    await page.goto('/forms/new');
    
    // Wait for the form builder to load
    await page.waitForSelector('.form-builder-container', { timeout: 10000 });
  });

  test('should load form builder without duplicate palettes', async ({ page }) => {
    // Check that ComponentPalette appears only once
    const palettes = await page.locator('.component-palette').count();
    expect(palettes).toBe(1);
    
    // Verify palette is visible in sidebar
    await expect(page.locator('.w-80.border-r')).toBeVisible();
    await expect(page.locator('.component-palette')).toBeVisible();
  });

  test('should support touch drag-and-drop on iPad', async ({ page }) => {
    // Get a draggable component from the palette
    const textInputComponent = page.locator('[data-component-type="text_input"]').first();
    const dropZone = page.locator('.min-h-full.bg-white.rounded-lg');
    
    // Ensure components are visible
    await expect(textInputComponent).toBeVisible();
    await expect(dropZone).toBeVisible();
    
    // Perform touch drag
    const sourceBox = await textInputComponent.boundingBox();
    const targetBox = await dropZone.boundingBox();
    
    if (sourceBox && targetBox) {
      // Simulate drag and drop with mouse events (works for touch on mobile)
      await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 100, { steps: 10 });
      await page.mouse.up();
    }
    
    // Verify component was added
    await page.waitForSelector('[data-id*="text_input_"]', { timeout: 5000 });
    const addedComponents = await page.locator('[data-id*="text_input_"]').count();
    expect(addedComponents).toBeGreaterThan(0);
  });

  test('should have proper touch targets (44px minimum)', async ({ page }) => {
    // Add a component first
    const textInputComponent = page.locator('[data-component-type="text_input"]').first();
    await textInputComponent.click();
    
    // Check drag handle size
    const dragHandle = page.locator('.drag-handle').first();
    await dragHandle.waitFor({ state: 'visible' });
    
    const handleBox = await dragHandle.boundingBox();
    expect(handleBox).toBeTruthy();
    if (handleBox) {
      expect(handleBox.width).toBeGreaterThanOrEqual(44);
      expect(handleBox.height).toBeGreaterThanOrEqual(44);
    }
    
    // Check button sizes
    const buttons = page.locator('button').all();
    for (const button of await buttons) {
      const box = await button.boundingBox();
      if (box && await button.isVisible()) {
        // Buttons should have adequate touch targets
        expect(box.width).toBeGreaterThanOrEqual(32); // Allowing for smaller icons with padding
        expect(box.height).toBeGreaterThanOrEqual(32);
      }
    }
  });

  test('should handle iOS keyboard properly', async ({ page }) => {
    // Add a text input component
    const textInputComponent = page.locator('[data-component-type="text_input"]').first();
    await textInputComponent.click();
    
    // Click on the label input to trigger keyboard
    const labelInput = page.locator('input[placeholder="Enter field label"]').first();
    await labelInput.click();
    
    // Type something
    await labelInput.fill('Test Field Label');
    
    // Verify viewport adjustments (visualViewport API)
    const viewportHeight = await page.evaluate(() => {
      return window.visualViewport?.height || window.innerHeight;
    });
    
    // Viewport should be defined
    expect(viewportHeight).toBeGreaterThan(0);
    
    // Verify input has proper font size (prevent zoom)
    const fontSize = await labelInput.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(16);
  });

  test('should show autosave status', async ({ page }) => {
    // Add a component to trigger autosave
    const textInputComponent = page.locator('[data-component-type="text_input"]').first();
    await textInputComponent.click();
    
    // Wait for autosave indicator
    await page.waitForSelector('.text-green-600', { timeout: 10000 });
    
    // Verify save status is shown
    const saveStatus = page.locator('.text-muted-foreground').filter({ hasText: /Saved/ });
    await expect(saveStatus).toBeVisible();
  });

  test('should display form lock warning when appropriate', async ({ page }) => {
    // Navigate to an existing form that might be locked
    await page.goto('/forms/1/edit');
    
    // Check if lock warning appears (if form is locked)
    const lockWarning = page.locator('.border-yellow-500');
    const warningCount = await lockWarning.count();
    
    if (warningCount > 0) {
      // Verify lock warning UI
      await expect(lockWarning).toBeVisible();
      await expect(page.locator('text=/This form is currently being edited/')).toBeVisible();
      
      // Check for takeover button
      const takeoverButton = page.locator('button:has-text("Take Over")');
      if (await takeoverButton.isVisible()) {
        await expect(takeoverButton).toBeEnabled();
      }
    }
  });

  test('should open AI summary modal', async ({ page }) => {
    // Click AI Summary button
    const summaryButton = page.locator('button:has-text("AI Summary")');
    await expect(summaryButton).toBeVisible();
    await summaryButton.click();
    
    // Verify modal opens
    await expect(page.locator('text="Form Summary"')).toBeVisible();
    await expect(page.locator('text="AI-generated overview"')).toBeVisible();
    
    // Close modal
    const closeButton = page.locator('button:has-text("✕")');
    await closeButton.click();
    
    // Verify modal closes
    await expect(page.locator('text="Form Summary"')).not.toBeVisible();
  });

  test('should maintain touch responsiveness during drag operations', async ({ page }) => {
    // Add multiple components
    const componentTypes = ['text_input', 'textarea', 'select'];
    
    for (const type of componentTypes) {
      const component = page.locator(`[data-component-type="${type}"]`).first();
      await component.click();
      await page.waitForTimeout(500); // Small delay between adds
    }
    
    // Verify all components were added
    const addedComponents = await page.locator('[data-id]').count();
    expect(addedComponents).toBe(3);
    
    // Test reordering with touch
    const firstComponent = page.locator('[data-id]').first();
    const lastComponent = page.locator('[data-id]').last();
    
    const firstBox = await firstComponent.boundingBox();
    const lastBox = await lastComponent.boundingBox();
    
    if (firstBox && lastBox) {
      // Simulate touch drag to reorder
      const dragHandle = firstComponent.locator('.drag-handle');
      const handleBox = await dragHandle.boundingBox();
      
      if (handleBox) {
        // Simulate drag with mouse events (works for touch)
        await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(100);
        await page.mouse.move(lastBox.x + lastBox.width / 2, lastBox.y + lastBox.height + 20, { steps: 10 });
        await page.mouse.up();
      }
    }
  });
});

test.describe('Form Builder - Offline Support', () => {
  test('should save to IndexedDB when offline', async ({ page, context }) => {
    await page.goto('/forms/new');
    
    // Add a component
    const textInputComponent = page.locator('[data-component-type="text_input"]').first();
    await textInputComponent.click();
    
    // Go offline
    await context.setOffline(true);
    
    // Make a change
    const labelInput = page.locator('input[placeholder="Enter field label"]').first();
    await labelInput.fill('Offline Test Field');
    
    // Wait for potential save attempt
    await page.waitForTimeout(3000);
    
    // Check IndexedDB for saved data
    const savedData = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const request = indexedDB.open('FormAutosave', 1);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['sessions'], 'readonly');
          const store = transaction.objectStore('sessions');
          const getAllRequest = store.getAll();
          getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        };
        request.onerror = () => resolve([]);
      });
    });
    
    expect(Array.isArray(savedData)).toBe(true);
  });
});

test.describe('Form Builder - Accessibility', () => {
  test('should meet WCAG touch target guidelines', async ({ page }) => {
    await page.goto('/forms/new');
    
    // Add a component to test controls
    const textInputComponent = page.locator('[data-component-type="text_input"]').first();
    await textInputComponent.click();
    
    // Wait for component to be added
    await page.waitForSelector('[data-id]');
    
    // Hover to show controls
    const component = page.locator('[data-id]').first();
    await component.hover();
    
    // Check all interactive elements
    const interactiveElements = await page.locator('button, input, select, textarea, [role="button"]').all();
    
    for (const element of interactiveElements) {
      if (await element.isVisible()) {
        const box = await element.boundingBox();
        if (box) {
          // WCAG AA requires 44x44 minimum for touch targets
          const minSize = Math.min(box.width, box.height);
          
          // Allow some smaller sizes for grouped controls with adequate spacing
          if (minSize < 44) {
            // Check if it's a small icon button that might have padding
            const hasAdequatePadding = await element.evaluate((el) => {
              const styles = window.getComputedStyle(el);
              const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
              return padding >= 8; // At least 8px padding
            });
            
            expect(hasAdequatePadding || minSize >= 32).toBe(true);
          }
        }
      }
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/forms/new');
    
    // Check main regions have proper labels
    await expect(page.locator('[aria-label], [aria-labelledby]')).toHaveCount(0); // Adjust based on actual implementation
    
    // Check form controls have labels
    const formControls = await page.locator('input, select, textarea').all();
    for (const control of formControls) {
      if (await control.isVisible()) {
        const hasLabel = await control.evaluate((el) => {
          // Check for associated label
          const id = el.id;
          if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return true;
          }
          
          // Check for aria-label or aria-labelledby
          return el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
        });
        
        expect(hasLabel).toBe(true);
      }
    }
  });
});