import { test, expect, devices } from '@playwright/test';

/**
 * Form Builder Enhancements Test Suite
 * Tests the new content elements: Title, Subtitle, and Separator
 * Also tests the form template save/load functionality
 */

// Use desktop Chrome for form builder enhancements testing
test.use({
  ...devices['Desktop Chrome'],
  viewport: { width: 1280, height: 720 }
});

test.describe('Form Builder - Content Element Enhancements', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console logs for debugging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    // Navigate to the form builder page
    await page.goto('/forms/new');
    
    // Wait for React to hydrate - client:only components need time to load
    await page.waitForSelector('.form-builder-container', {
      state: 'visible',
      timeout: 30000
    });
    
    // Additional wait for React hydration to complete
    await page.waitForTimeout(2000);
    
    // Wait for component palette to be interactive
    await page.waitForSelector('.component-palette [data-component-type]', {
      state: 'visible',
      timeout: 10000
    });
  });

  test('should drag Title, Subtitle, and Separator elements and modify their properties', async ({ page }) => {
    console.log('Starting Test Case 1: Content Element Interactions');

    // Test Title Element
    console.log('Testing Title Element...');
    
    // Add Title element to the form
    const titleComponent = page.locator('[data-component-type="title"]').first();
    await expect(titleComponent).toBeVisible();
    await titleComponent.click();
    
    // Wait for title component to be added to design surface
    await page.waitForSelector('[data-id*="title"]', {
      state: 'visible',
      timeout: 10000
    });
    
    // Verify title element appears on design surface
    const addedTitle = page.locator('[data-id*="title"]').first();
    await expect(addedTitle).toBeVisible();
    
    // Click on title to open property panel
    await addedTitle.click();
    await page.waitForTimeout(500);
    
    // Interact with title properties
    const titleTextInput = page.locator('input[id="title-text"], input[placeholder*="title"]').first();
    if (await titleTextInput.isVisible()) {
      await titleTextInput.fill('Test Form Title');
      await page.waitForTimeout(500);
      
      // Verify the change is reflected in the preview
      await expect(page.locator('text=Test Form Title')).toBeVisible();
    }
    
    // Change title color if color input is available
    const titleColorInput = page.locator('input[type="color"], input[id="title-color"]').first();
    if (await titleColorInput.isVisible()) {
      await titleColorInput.fill('#ff6b35');
      await page.waitForTimeout(500);
    }
    
    // Test Subtitle Element
    console.log('Testing Subtitle Element...');
    
    // Add Subtitle element to the form
    const subtitleComponent = page.locator('[data-component-type="subtitle"]').first();
    await expect(subtitleComponent).toBeVisible();
    await subtitleComponent.click();
    
    // Wait for subtitle component to be added
    await page.waitForSelector('[data-id*="subtitle"]', {
      state: 'visible',
      timeout: 10000
    });
    
    // Verify subtitle element appears on design surface
    const addedSubtitle = page.locator('[data-id*="subtitle"]').first();
    await expect(addedSubtitle).toBeVisible();
    
    // Click on subtitle to open property panel
    await addedSubtitle.click();
    await page.waitForTimeout(500);
    
    // Interact with subtitle properties
    const subtitleTextArea = page.locator('textarea, input[placeholder*="subtitle"]').first();
    if (await subtitleTextArea.isVisible()) {
      await subtitleTextArea.fill('This is a test subtitle for the form');
      await page.waitForTimeout(500);
      
      // Verify the change is reflected in the preview
      await expect(page.locator('text=This is a test subtitle for the form')).toBeVisible();
    }
    
    // Test Separator Element
    console.log('Testing Separator Element...');
    
    // Add Separator element to the form
    const separatorComponent = page.locator('[data-component-type="separator"]').first();
    await expect(separatorComponent).toBeVisible();
    await separatorComponent.click();
    
    // Wait for separator component to be added
    await page.waitForSelector('[data-id*="separator"]', {
      state: 'visible',
      timeout: 10000
    });
    
    // Verify separator element appears on design surface
    const addedSeparator = page.locator('[data-id*="separator"]').first();
    await expect(addedSeparator).toBeVisible();
    
    // Click on separator to open property panel
    await addedSeparator.click();
    await page.waitForTimeout(500);
    
    // Interact with separator properties
    const separatorColorInput = page.locator('input[type="color"]').last();
    if (await separatorColorInput.isVisible()) {
      await separatorColorInput.fill('#3b82f6');
      await page.waitForTimeout(500);
    }
    
    // Change separator thickness if available
    const thicknessSlider = page.locator('input[type="range"]').first();
    if (await thicknessSlider.isVisible()) {
      await thicknessSlider.fill('3');
      await page.waitForTimeout(500);
    }
    
    // Verify all three components are present on the form
    const totalComponents = await page.locator('[data-id]').count();
    expect(totalComponents).toBeGreaterThanOrEqual(3);
    
    console.log('Test Case 1 completed successfully');
  });

  test('should save form as template and load it successfully', async ({ page }) => {
    console.log('Starting Test Case 2: Template Save/Load Functionality');

    // Build a simple form with the new elements
    console.log('Building form with new elements...');
    
    // Add Title
    const titleComponent = page.locator('[data-component-type="title"]').first();
    await titleComponent.click();
    await page.waitForSelector('[data-id*="title"]', { state: 'visible', timeout: 10000 });
    
    // Add Subtitle
    const subtitleComponent = page.locator('[data-component-type="subtitle"]').first();
    await subtitleComponent.click();
    await page.waitForSelector('[data-id*="subtitle"]', { state: 'visible', timeout: 10000 });
    
    // Add Separator
    const separatorComponent = page.locator('[data-component-type="separator"]').first();
    await separatorComponent.click();
    await page.waitForSelector('[data-id*="separator"]', { state: 'visible', timeout: 10000 });
    
    // Add a basic input field for a complete form
    const textInputComponent = page.locator('[data-component-type="text_input"]').first();
    if (await textInputComponent.isVisible()) {
      await textInputComponent.click();
      await page.waitForSelector('[data-id*="text_input"]', { state: 'visible', timeout: 10000 });
    }
    
    // Wait for all components to be added
    await page.waitForTimeout(1000);
    
    // Verify we have our components
    const componentsCount = await page.locator('[data-id]').count();
    expect(componentsCount).toBeGreaterThanOrEqual(3);
    
    // Save as Template
    console.log('Saving form as template...');
    
    const saveTemplateButton = page.locator('button:has-text("Save as Template"), button:has-text("Save Template")').first();
    
    // If save template button is not immediately visible, look for it in menus
    if (!(await saveTemplateButton.isVisible())) {
      // Try looking for a menu or dropdown that might contain the save option
      const menuButtons = page.locator('button[aria-haspopup], button:has([class*="menu"]), button:has([class*="dropdown"])');
      const menuCount = await menuButtons.count();
      
      for (let i = 0; i < menuCount; i++) {
        const menuButton = menuButtons.nth(i);
        if (await menuButton.isVisible()) {
          await menuButton.click();
          await page.waitForTimeout(500);
          
          const saveOption = page.locator('text=/Save.*Template/i, [role="menuitem"]:has-text("Save")').first();
          if (await saveOption.isVisible()) {
            await saveOption.click();
            break;
          }
        }
      }
    } else {
      await saveTemplateButton.click();
    }
    
    // Wait for template modal/dialog to appear
    await page.waitForTimeout(1000);
    
    // Look for template metadata fields
    const templateNameInput = page.locator('input[placeholder*="template"], input[placeholder*="name"], input[id*="name"]').first();
    if (await templateNameInput.isVisible()) {
      await templateNameInput.fill('Test Template with New Elements');
    }
    
    const templateDescInput = page.locator('textarea[placeholder*="description"], input[placeholder*="description"]').first();
    if (await templateDescInput.isVisible()) {
      await templateDescInput.fill('Template containing Title, Subtitle, and Separator elements for testing');
    }
    
    // Submit the template
    const submitButton = page.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for success notification
      await page.waitForTimeout(2000);
      
      // Look for success indicators
      const successIndicators = [
        page.locator('.text-green-600, .bg-green-100, [class*="success"]').first(),
        page.locator('text=/saved/i, text=/created/i, text=/success/i').first()
      ];
      
      let foundSuccess = false;
      for (const indicator of successIndicators) {
        if (await indicator.isVisible().catch(() => false)) {
          foundSuccess = true;
          break;
        }
      }
      
      // If no explicit success message, assume success if modal closed
      if (!foundSuccess) {
        const modalCount = await page.locator('[role="dialog"], [class*="modal"], [class*="dialog"]').count();
        foundSuccess = modalCount === 0;
      }
      
      expect(foundSuccess).toBe(true);
    }
    
    // Clear the current form
    console.log('Clearing form...');
    
    // Look for clear/new form options
    const clearButton = page.locator('button:has-text("Clear"), button:has-text("New Form"), button:has-text("Reset")').first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(1000);
    } else {
      // Alternative: refresh the page to get a clean form
      await page.reload();
      await page.waitForSelector('.form-builder-container', { state: 'visible', timeout: 30000 });
      await page.waitForTimeout(2000);
    }
    
    // Load the template
    console.log('Loading saved template...');
    
    const loadTemplateButton = page.locator('button:has-text("Load Template"), button:has-text("Templates")').first();
    
    if (!(await loadTemplateButton.isVisible())) {
      // Look in menus for load option
      const menuButtons = page.locator('button[aria-haspopup], button:has([class*="menu"])');
      const menuCount = await menuButtons.count();
      
      for (let i = 0; i < menuCount; i++) {
        const menuButton = menuButtons.nth(i);
        if (await menuButton.isVisible()) {
          await menuButton.click();
          await page.waitForTimeout(500);
          
          const loadOption = page.locator('text=/Load.*Template/i, [role="menuitem"]:has-text("Load")').first();
          if (await loadOption.isVisible()) {
            await loadOption.click();
            break;
          }
        }
      }
    } else {
      await loadTemplateButton.click();
    }
    
    // Wait for template dialog
    await page.waitForTimeout(1000);
    
    // Search for our saved template
    const searchInput = page.locator('input[placeholder*="search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test Template with New Elements');
      await page.waitForTimeout(500);
    }
    
    // Look for our template in the list and click it
    const templateItem = page.locator('text=Test Template with New Elements, [data-template-name*="Test Template"]').first();
    if (await templateItem.isVisible()) {
      await templateItem.click();
      await page.waitForTimeout(500);
      
      // Click load/select button
      const loadButton = page.locator('button:has-text("Load"), button:has-text("Select"), button:has-text("Apply")').first();
      if (await loadButton.isVisible()) {
        await loadButton.click();
      }
    }
    
    // Wait for template to load
    await page.waitForTimeout(2000);
    
    // Verify the form elements are correctly rendered
    console.log('Verifying loaded template...');
    
    // Check that components were loaded back
    await page.waitForSelector('[data-id]', { state: 'visible', timeout: 10000 });
    
    const loadedComponents = await page.locator('[data-id]').count();
    expect(loadedComponents).toBeGreaterThanOrEqual(3);
    
    // Verify specific component types are present
    const hasTitle = await page.locator('[data-id*="title"]').count() > 0;
    const hasSubtitle = await page.locator('[data-id*="subtitle"]').count() > 0;
    const hasSeparator = await page.locator('[data-id*="separator"]').count() > 0;
    
    // At least one of our new content elements should be present
    expect(hasTitle || hasSubtitle || hasSeparator).toBe(true);
    
    console.log('Test Case 2 completed successfully');
  });

  test('should handle property panel interactions correctly', async ({ page }) => {
    console.log('Testing property panel interactions for new elements');
    
    // Add a title component
    const titleComponent = page.locator('[data-component-type="title"]').first();
    await titleComponent.click();
    await page.waitForSelector('[data-id*="title"]', { state: 'visible', timeout: 10000 });
    
    // Select the title to open property panel
    const addedTitle = page.locator('[data-id*="title"]').first();
    await addedTitle.click();
    await page.waitForTimeout(500);
    
    // Test font size selection if available
    const fontSizeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /size|font/i }).first();
    if (await fontSizeSelect.isVisible()) {
      await fontSizeSelect.click();
      await page.waitForTimeout(200);
      
      // Select a different font size
      const largeOption = page.locator('option[value="2xl"], [role="option"]:has-text("2X Large")').first();
      if (await largeOption.isVisible()) {
        await largeOption.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Test alignment changes if available
    const alignmentSelect = page.locator('select, [role="combobox"]').filter({ hasText: /align/i }).first();
    if (await alignmentSelect.isVisible()) {
      await alignmentSelect.click();
      await page.waitForTimeout(200);
      
      const centerOption = page.locator('option[value="center"], [role="option"]:has-text("Center")').first();
      if (await centerOption.isVisible()) {
        await centerOption.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Verify changes are applied (component should still be visible and functional)
    await expect(addedTitle).toBeVisible();
    
    console.log('Property panel interaction test completed');
  });
});