import { test, expect } from '@playwright/test';

test.describe('Debug blank page issue', () => {
  test('check homepage renders', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'networkidle' });

    // Take a screenshot
    await page.screenshot({ path: 'test-results/homepage-debug.png', fullPage: true });

    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit for any errors to appear
    await page.waitForTimeout(2000);

    // Get page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text length:', bodyText?.length || 0);
    console.log('First 200 chars:', bodyText?.slice(0, 200));

    // Check for specific elements
    const header = await page.locator('header').count();
    console.log('Header found:', header > 0);

    const h1 = await page.locator('h1').count();
    console.log('H1 elements found:', h1);

    const mainContent = await page.locator('main, section').count();
    console.log('Main/section elements found:', mainContent);

    // Log any console errors
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    }

    // Get full HTML for inspection
    const html = await page.content();
    console.log('HTML length:', html.length);
    console.log('Contains MotionProvider:', html.includes('MotionProvider'));
    console.log('Contains LazyMotion:', html.includes('LazyMotion'));

    // Check if body is actually empty
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('check product page renders', async ({ page }) => {
    await page.goto('/products/sofas/3-seater-sheesham-wood-sofa', { waitUntil: 'networkidle' });

    await page.screenshot({ path: 'test-results/product-debug.png', fullPage: true });

    const bodyText = await page.locator('body').textContent();
    console.log('Product page body length:', bodyText?.length || 0);

    const h1 = await page.locator('h1').textContent();
    console.log('Product H1:', h1);

    expect(bodyText?.length).toBeGreaterThan(100);
  });
});
