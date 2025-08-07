import { test, expect } from '@playwright/test';

test('Phase-0 smoke: dev page renders key sections', async ({ page }) => {
  await page.goto('/dev/phase0-smoke');
  await expect(page.getByTestId('dnd-demo')).toBeVisible();
  await expect(page.getByTestId('survey-demo')).toBeVisible();
  await expect(page.getByTestId('pdf-demo')).toBeVisible();
  await expect(page.getByTestId('analytics-demo')).toBeVisible();
  await expect(page.getByTestId('rbac-demo')).toBeVisible();
});

test('Phase-0 smoke: analytics button exists', async ({ page }) => {
  await page.goto('/dev/phase0-smoke');
  const btn = page.getByTestId('analytics-fire');
  await expect(btn).toBeVisible();
  // Optional click, proxy returns 204 in E2E mode
  await btn.click();
  // No strict assertion on network; absence of error is sufficient
  await expect(btn).toBeEnabled();
});