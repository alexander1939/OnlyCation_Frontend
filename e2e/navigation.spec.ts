import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OnlyCation/);
  });

  test('should navigate to teachers page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/teachers"]');
    await expect(page).toHaveURL(/.*teachers/);
  }); 

  test('should navigate to about us page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/about-us"]');
    await expect(page).toHaveURL(/.*about-us/);
  });

  test('footer should be visible on all pages', async ({ page }) => {
    const pages = ['/', '/teachers', '/about-us'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await expect(page.locator('footer')).toBeVisible();
    }
  });
});
