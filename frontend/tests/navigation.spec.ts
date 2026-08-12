import { test, expect } from '@playwright/test';

test('login form is visible', async ({ page }) => {
  await page.goto('/login');
  const loginForm = page.locator('form');
  await expect(loginForm).toBeVisible();
});
