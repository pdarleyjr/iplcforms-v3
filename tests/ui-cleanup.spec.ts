import { test, expect } from '@playwright/test';

test.describe('UI Cleanup Tests', () => {
  test('Landing Page displays live stats from API', async ({ page }) => {
    // Mock the API response with specific values
    await page.route('**/api/dashboard/overview', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          activePatients: 1234,
          formsCreated: 56,
          completionRate: '87.5%'
        })
      });
    });

    // Navigate to landing page
    await page.goto('/');

    // Wait for stats to load
    await page.waitForSelector('[data-testid="dashboard-stats"]', { 
      state: 'visible',
      timeout: 10000 
    });

    // Check that the mocked values are displayed correctly
    await expect(page.locator('text=1,234')).toBeVisible(); // activePatients with comma formatting
    await expect(page.locator('text=56')).toBeVisible(); // formsCreated
    await expect(page.locator('text=87.5%')).toBeVisible(); // completionRate

    // Verify the stats are within the expected card structure
    const statsCard = page.locator('.grid-cols-3').first();
    await expect(statsCard).toContainText('Active Patients');
    await expect(statsCard).toContainText('Forms Created');
    await expect(statsCard).toContainText('Completion Rate');
  });

  test('Header style - no blue box artifact', async ({ page }) => {
    // Navigate to any page with the header
    await page.goto('/admin');

    // Wait for header to be visible
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();

    // Take a visual regression snapshot of the header
    await expect(header).toHaveScreenshot('header-style.png', {
      maxDiffPixels: 100
    });

    // Verify the header has proper gradient styling and no blue box
    const headerElement = page.locator('.gradient-metallic-primary').first();
    await expect(headerElement).toBeVisible();
    
    // Check that the navigation links don't have unexpected blue backgrounds
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      // Check that links don't have solid blue backgrounds
      const bgColor = await link.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).not.toBe('rgb(0, 123, 255)'); // Not solid blue
      expect(bgColor).not.toBe('rgb(0, 0, 255)'); // Not pure blue
    }
  });

  test('Create New Form page has only one primary heading', async ({ page }) => {
    // Navigate to the Create New Form page
    await page.goto('/forms/new');

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');

    // Count h1 elements
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    
    // Count h2 elements that might act as primary headings
    const h2Elements = page.locator('h2');
    const h2Count = await h2Elements.count();
    
    // Verify there's exactly one h1 (the primary heading)
    expect(h1Count).toBe(1);
    
    // Verify the h1 content
    await expect(h1Elements.first()).toHaveText('Create New Form');
    
    // If there are h2 elements, ensure they're not duplicating the primary heading
    if (h2Count > 0) {
      const h2Texts = await h2Elements.allTextContents();
      h2Texts.forEach(text => {
        expect(text.toLowerCase()).not.toContain('create new form');
      });
    }
    
    // Check the page title in the browser tab
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Create New Form');
    
    // Ensure no duplicate title text in the visible page
    const titleOccurrences = await page.locator('text="Create New Form"').count();
    expect(titleOccurrences).toBe(1); // Only the h1 should contain this exact text
  });

  test('AI Summary is in component palette, not in toolbar', async ({ page }) => {
    // Navigate to the form builder
    await page.goto('/forms/new');

    // Wait for the form builder to load
    await page.waitForSelector('[data-testid="form-builder"]', { 
      state: 'visible',
      timeout: 10000 
    });

    // Check toolbar buttons - AI Summary should NOT be here
    const toolbar = page.locator('.border-b.bg-card.p-4').first();
    await expect(toolbar).toBeVisible();
    
    // Verify toolbar only contains expected buttons
    await expect(toolbar).toContainText('Load Template');
    await expect(toolbar).toContainText('Preview');
    await expect(toolbar).toContainText('Settings');
    
    // AI Summary should NOT be in the toolbar
    await expect(toolbar).not.toContainText('AI Summary');
    
    // Check component palette - AI Summary SHOULD be here
    const componentPalette = page.locator('.w-80.border-r.bg-card').first();
    await expect(componentPalette).toBeVisible();
    
    // Look for AI Summary in the component palette
    // It might be under a specific category, so we'll search within the palette
    const aiSummaryComponent = componentPalette.locator('text=/AI Summary|Smart Summary|Summary/i');
    await expect(aiSummaryComponent).toBeVisible();
    
    // Verify it's a draggable component (should have appropriate classes or attributes)
    const draggableAISummary = componentPalette.locator('[data-component-type="ai_summary"], .component-item:has-text("AI Summary")');
    const aiSummaryExists = await draggableAISummary.count() > 0;
    expect(aiSummaryExists).toBeTruthy();
    
    // Additional check: ensure the AI Summary component can be found in Special Elements
    const specialElementsSection = componentPalette.locator('text="Special Elements"');
    if (await specialElementsSection.count() > 0) {
      // If there's a Special Elements section, AI Summary should be within it
      const specialElementsContainer = specialElementsSection.locator('..').locator('..');
      await expect(specialElementsContainer).toContainText(/AI Summary|Smart Summary/i);
    }
  });
});

// Helper test to verify the form builder loads correctly
test('Form builder loads successfully', async ({ page }) => {
  await page.goto('/forms/new');
  
  // Wait for key elements
  await expect(page.locator('[data-testid="form-builder"]')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.w-80.border-r.bg-card')).toBeVisible(); // Component palette
  await expect(page.locator('.form-builder-container')).toBeVisible(); // Main container
});