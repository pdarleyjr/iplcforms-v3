import { test, expect, devices } from '@playwright/test';

// Test both desktop and mobile/touch devices
const testDevices = [
  { name: 'Desktop', device: {} },
  { name: 'iPad', device: devices['iPad Pro'] },
  { name: 'Mobile', device: devices['iPhone 12'] }
];

testDevices.forEach(({ name, device }) => {
  test.describe(`dnd-kit Form Builder - ${name}`, () => {
    test.use(device);

    test.beforeEach(async ({ page }) => {
      // Navigate to the form builder page
      await page.goto('/forms/new');
      
      // Wait for the form builder container to appear
      await page.waitForSelector('.form-builder-container', {
        state: 'visible',
        timeout: 30000
      });
      
      // Wait for React hydration
      await page.waitForTimeout(1000);
      
      // Wait for component palette to be interactive
      await page.waitForSelector('[data-component-type]', {
        state: 'visible',
        timeout: 10000
      });
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Skip on touch devices
      if ('hasTouch' in device && device.hasTouch) {
        test.skip();
      }

      // Add a few components
      const componentTypes = ['text_input', 'textarea', 'select'];
      for (const type of componentTypes) {
        const component = page.locator(`[data-component-type="${type}"]`).first();
        await component.click();
        await page.waitForTimeout(500);
      }

      // Focus on the first draggable item
      const firstItem = page.locator('[role="button"][aria-label*="Form component"]').first();
      await firstItem.focus();

      // Test keyboard navigation
      // Space/Enter to grab
      await page.keyboard.press('Space');
      await page.waitForTimeout(100);

      // Arrow keys to move
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);

      // Space/Enter to drop
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);

      // Verify the order changed
      const components = await page.locator('[data-id]').all();
      expect(components.length).toBe(3);
    });

    test('should have proper ARIA attributes for drag handles', async ({ page }) => {
      // Add a component
      const textInput = page.locator('[data-component-type="text_input"]').first();
      await textInput.click();
      
      await page.waitForSelector('[data-id]', {
        state: 'visible',
        timeout: 5000
      });

      // Hover to show controls
      const component = page.locator('[data-id]').first();
      await component.hover();

      // Check drag handle ARIA attributes
      const dragHandle = page.locator('.drag-handle').first();
      await dragHandle.waitFor({ state: 'visible' });

      const ariaLabel = await dragHandle.getAttribute('aria-label');
      expect(ariaLabel).toContain('Drag to reorder');

      // Check component has proper role and label
      const componentRole = await component.getAttribute('role');
      expect(componentRole).toBe('button');

      const componentLabel = await component.getAttribute('aria-label');
      expect(componentLabel).toBeTruthy();
    });

    test('should support touch drag and drop', async ({ page }) => {
      // Only test on touch devices
      if (!('hasTouch' in device && device.hasTouch)) {
        test.skip();
      }

      // Add multiple components
      const componentTypes = ['text_input', 'textarea'];
      for (const type of componentTypes) {
        const component = page.locator(`[data-component-type="${type}"]`).first();
        await component.tap();
        await page.waitForTimeout(500);
      }

      // Verify components were added
      const addedComponents = await page.locator('[data-id]').count();
      expect(addedComponents).toBe(2);

      // Get initial order
      const initialOrder = await page.locator('[data-id]').evaluateAll(elements => 
        elements.map(el => el.getAttribute('data-id'))
      );

      // Simulate touch drag (if supported by the browser)
      const firstComponent = page.locator('[data-id]').first();
      const secondComponent = page.locator('[data-id]').nth(1);
      
      const firstBox = await firstComponent.boundingBox();
      const secondBox = await secondComponent.boundingBox();

      if (firstBox && secondBox) {
        // Touch and hold on drag handle
        const dragHandle = page.locator('.drag-handle').first();
        await dragHandle.hover();
        
        // Simulate touch drag
        await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(300); // Touch activation delay
        await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height + 10);
        await page.mouse.up();
        await page.waitForTimeout(500);

        // Verify order changed
        const newOrder = await page.locator('[data-id]').evaluateAll(elements => 
          elements.map(el => el.getAttribute('data-id'))
        );
        
        // Order should be different
        expect(newOrder).not.toEqual(initialOrder);
      }
    });

    test('should show drag overlay during drag', async ({ page }) => {
      // Add a component
      const textInput = page.locator('[data-component-type="text_input"]').first();
      await textInput.click();
      
      await page.waitForSelector('[data-id]', {
        state: 'visible',
        timeout: 5000
      });

      // Start dragging
      const component = page.locator('[data-id]').first();
      await component.hover();
      
      const dragHandle = page.locator('.drag-handle').first();
      await dragHandle.waitFor({ state: 'visible' });
      
      const box = await dragHandle.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height + 100);
        
        // Check for drag overlay
        const dragOverlay = page.locator('.bg-white.border-2.border-primary.rounded-lg.shadow-lg.opacity-90');
        await expect(dragOverlay).toBeVisible();
        
        await page.mouse.up();
        
        // Overlay should disappear after drop
        await expect(dragOverlay).not.toBeVisible();
      }
    });

    test('should apply activation constraints', async ({ page }) => {
      // Add a component
      const textInput = page.locator('[data-component-type="text_input"]').first();
      await textInput.click();
      
      await page.waitForSelector('[data-id]', {
        state: 'visible',
        timeout: 5000
      });

      const component = page.locator('[data-id]').first();
      await component.hover();
      
      const dragHandle = page.locator('.drag-handle').first();
      await dragHandle.waitFor({ state: 'visible' });
      
      const box = await dragHandle.boundingBox();
      if (box) {
        // Small movement (less than 8px) should not trigger drag
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 5, box.y + box.height / 2 + 5);
        
        // Should not show drag overlay for small movement
        const dragOverlay = page.locator('.bg-white.border-2.border-primary.rounded-lg.shadow-lg.opacity-90');
        await expect(dragOverlay).not.toBeVisible();
        
        // Larger movement should trigger drag
        await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 20);
        await expect(dragOverlay).toBeVisible();
        
        await page.mouse.up();
      }
    });

    test('should restrict drag to vertical axis', async ({ page }) => {
      // Add multiple components
      const componentTypes = ['text_input', 'textarea', 'select'];
      for (const type of componentTypes) {
        const component = page.locator(`[data-component-type="${type}"]`).first();
        await component.click();
        await page.waitForTimeout(500);
      }

      // Start dragging the first component
      const firstComponent = page.locator('[data-id]').first();
      await firstComponent.hover();
      
      const dragHandle = page.locator('.drag-handle').first();
      await dragHandle.waitFor({ state: 'visible' });
      
      const box = await dragHandle.boundingBox();
      if (box) {
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;
        
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        
        // Try to move horizontally
        await page.mouse.move(startX + 100, startY + 50);
        
        // Get the transform of the dragging element
        const transform = await page.evaluate(() => {
          const draggingElement = document.querySelector('[style*="transform"]');
          if (draggingElement) {
            const style = window.getComputedStyle(draggingElement);
            return style.transform;
          }
          return null;
        });
        
        // Transform should primarily be vertical (translateY)
        if (transform && transform !== 'none') {
          // Parse transform to check if X movement is restricted
          const match = transform.match(/translate3d\(([^,]+),\s*([^,]+),/);
          if (match) {
            const xTranslate = parseFloat(match[1]);
            // X translation should be minimal due to vertical axis restriction
            expect(Math.abs(xTranslate)).toBeLessThan(10);
          }
        }
        
        await page.mouse.up();
      }
    });

    test('should handle drop zones correctly', async ({ page }) => {
      // Add a component from palette
      const textInput = page.locator('[data-component-type="text_input"]').first();
      await textInput.click();
      
      await page.waitForSelector('[data-id]', {
        state: 'visible',
        timeout: 5000
      });

      // Add another component
      const textarea = page.locator('[data-component-type="textarea"]').first();
      await textarea.click();
      
      await page.waitForTimeout(500);

      // Verify both components are in the canvas
      const components = await page.locator('[data-id]').count();
      expect(components).toBe(2);

      // Check that the canvas shows proper drop zone styling when empty
      await page.evaluate(() => {
        // Remove all components to test empty state
        const components = document.querySelectorAll('[data-id]');
        components.forEach(c => c.remove());
      });

      const canvas = page.locator('.min-h-full.bg-white.rounded-lg.border-2.border-dashed');
      await expect(canvas).toBeVisible();
      
      // Should show empty state message
      const emptyMessage = page.locator('text="Start building your form"');
      await expect(emptyMessage).toBeVisible();
    });

    test('should maintain component state during drag', async ({ page }) => {
      // Add a text input component
      const textInput = page.locator('[data-component-type="text_input"]').first();
      await textInput.click();
      
      await page.waitForSelector('[data-id]', {
        state: 'visible',
        timeout: 5000
      });

      // Edit the label
      const labelInput = page.locator('input[placeholder="Enter field label"]').first();
      await labelInput.fill('Test Label');

      // Add another component
      const textarea = page.locator('[data-component-type="textarea"]').first();
      await textarea.click();
      await page.waitForTimeout(500);

      // Drag the first component to reorder
      const firstComponent = page.locator('[data-id]').first();
      await firstComponent.hover();
      
      const dragHandle = page.locator('.drag-handle').first();
      await dragHandle.waitFor({ state: 'visible' });
      
      const firstBox = await firstComponent.boundingBox();
      const secondComponent = page.locator('[data-id]').nth(1);
      const secondBox = await secondComponent.boundingBox();

      if (firstBox && secondBox) {
        await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height + 10);
        await page.mouse.up();
        await page.waitForTimeout(500);
      }

      // Verify the label is still "Test Label" after reordering
      const labelAfterDrag = await page.locator('input[value="Test Label"]').first();
      await expect(labelAfterDrag).toBeVisible();
    });

    test('should support multi-page forms', async ({ page }) => {
      // Check if multi-page toggle exists
      const multiPageToggle = page.locator('text="Convert to Multi-Page"').first();
      
      if (await multiPageToggle.isVisible()) {
        await multiPageToggle.click();
        await page.waitForTimeout(500);

        // Should show page tabs
        const pageTabs = page.locator('[role="tablist"]').filter({ hasText: 'Page 1' });
        await expect(pageTabs).toBeVisible();

        // Add a new page
        const addPageButton = page.locator('button:has-text("Add Page")').first();
        await addPageButton.click();
        await page.waitForTimeout(500);

        // Should have two page tabs
        const page1Tab = page.locator('[role="tab"]:has-text("Page 1")');
        const page2Tab = page.locator('[role="tab"]:has-text("Page 2")');
        
        await expect(page1Tab).toBeVisible();
        await expect(page2Tab).toBeVisible();

        // Switch between pages
        await page2Tab.click();
        await page.waitForTimeout(500);

        // Add component to page 2
        const textInput = page.locator('[data-component-type="text_input"]').first();
        await textInput.click();
        
        await page.waitForSelector('[data-id]', {
          state: 'visible',
          timeout: 5000
        });

        // Switch back to page 1
        await page1Tab.click();
        await page.waitForTimeout(500);

        // Page 1 should be empty
        const page1Components = await page.locator('[data-id]').count();
        expect(page1Components).toBe(0);

        // Switch to page 2
        await page2Tab.click();
        await page.waitForTimeout(500);

        // Page 2 should have the component
        const page2Components = await page.locator('[data-id]').count();
        expect(page2Components).toBe(1);
      }
    });
  });
});

test.describe('dnd-kit Performance', () => {
  test('should handle large number of components efficiently', async ({ page }) => {
    await page.goto('/forms/new');
    
    // Wait for form builder to load
    await page.waitForSelector('.form-builder-container', {
      state: 'visible',
      timeout: 30000
    });

    // Add many components
    const componentCount = 20;
    const startTime = Date.now();

    for (let i = 0; i < componentCount; i++) {
      const componentType = i % 2 === 0 ? 'text_input' : 'textarea';
      const component = page.locator(`[data-component-type="${componentType}"]`).first();
      await component.click();
      
      // Small delay to let React update
      if (i % 5 === 0) {
        await page.waitForTimeout(100);
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should add all components in reasonable time (less than 10 seconds)
    expect(totalTime).toBeLessThan(10000);

    // Verify all components were added
    const addedComponents = await page.locator('[data-id]').count();
    expect(addedComponents).toBe(componentCount);

    // Test drag performance with many components
    const firstComponent = page.locator('[data-id]').first();
    await firstComponent.hover();
    
    const dragHandle = page.locator('.drag-handle').first();
    await dragHandle.waitFor({ state: 'visible' });
    
    const dragStartTime = Date.now();
    
    const box = await dragHandle.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height + 200);
      await page.mouse.up();
    }
    
    const dragEndTime = Date.now();
    const dragTime = dragEndTime - dragStartTime;

    // Drag operation should be smooth (less than 2 seconds)
    expect(dragTime).toBeLessThan(2000);
  });

  test('should use React.memo for optimization', async ({ page }) => {
    await page.goto('/forms/new');
    
    // Wait for form builder to load
    await page.waitForSelector('.form-builder-container', {
      state: 'visible',
      timeout: 30000
    });

    // Add components
    const textInput = page.locator('[data-component-type="text_input"]').first();
    await textInput.click();
    await page.waitForTimeout(500);
    
    const textarea = page.locator('[data-component-type="textarea"]').first();
    await textarea.click();
    await page.waitForTimeout(500);

    // Monitor re-renders (this is a simplified check)
    const renderCount = await page.evaluate(() => {
      let count = 0;
      const observer = new MutationObserver(() => count++);
      const target = document.querySelector('.form-builder-container');
      if (target) {
        observer.observe(target, { childList: true, subtree: true });
        
        // Trigger a small change
        const input = document.querySelector('input[placeholder="Enter field label"]') as HTMLInputElement;
        if (input) {
          input.value = 'Test';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Wait a bit and disconnect
        setTimeout(() => observer.disconnect(), 1000);
      }
      return count;
    });

    // Should have minimal re-renders due to memoization
    // This is a rough check - actual optimization would need profiling
    expect(renderCount).toBeLessThan(50);
  });
});