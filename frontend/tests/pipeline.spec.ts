import { test, expect } from '@playwright/test';

test('redirects to login', async ({ page }) => {
  await page.goto('/');
  // Should redirect to login page
  await expect(page).toHaveURL(/.*\/login/);
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();
});
