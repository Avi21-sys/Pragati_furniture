import { test } from '@playwright/test';

test('capture browser console and network errors', async ({ page }) => {
  const consoleMessages: Array<{ type: string; text: string }> = [];
  const pageErrors: string[] = [];
  const failedRequests: Array<{ url: string; status: number }> = [];

  // Listen to all console events
  page.on('console', (msg) => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });

  // Listen to page errors
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  // Listen to failed requests
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  // Navigate to homepage
  console.log('\n=== HOMEPAGE ===');
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\n--- Console Messages ---');
  consoleMessages.forEach(msg => {
    if (msg.type === 'error' || msg.type === 'warning') {
      console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
    }
  });

  console.log('\n--- Page Errors ---');
  pageErrors.forEach(err => console.log(err));

  console.log('\n--- Failed Requests ---');
  failedRequests.forEach(req => console.log(`${req.status}: ${req.url}`));

  // Check if motion components are working
  const motionDivs = await page.locator('[class*="motion"]').count();
  console.log('\n--- Motion Elements ---');
  console.log('Elements with motion classes:', motionDivs);

  // Check if MotionProvider wrapper exists in the DOM
  const layoutTree = await page.evaluate(() => {
    const body = document.body;
    return {
      bodyChildren: body.children.length,
      firstChildTag: body.children[0]?.tagName,
      hasMain: !!document.querySelector('main'),
      hasSections: document.querySelectorAll('section').length
    };
  });
  console.log('Layout tree:', layoutTree);

  // Check specific animation components
  const animationChecks = await page.evaluate(() => {
    return {
      faqAccordion: !!document.querySelector('[data-open]'),
      whatsappButton: !!document.querySelector('.whatsapp-pulse'),
      header: !!document.querySelector('header'),
      productGallery: window.location.pathname.includes('/products/')
    };
  });
  console.log('Animation components:', animationChecks);

  await page.screenshot({ path: 'test-results/console-debug-home.png', fullPage: true });

  // Now check a product page
  console.log('\n\n=== PRODUCT PAGE ===');
  consoleMessages.length = 0;
  pageErrors.length = 0;
  failedRequests.length = 0;

  await page.goto('/products/sofas/3-seater-sheesham-wood-sofa', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\n--- Console Messages ---');
  consoleMessages.forEach(msg => {
    if (msg.type === 'error' || msg.type === 'warning') {
      console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
    }
  });

  console.log('\n--- Page Errors ---');
  pageErrors.forEach(err => console.log(err));

  console.log('\n--- Failed Requests ---');
  failedRequests.forEach(req => console.log(`${req.status}: ${req.url}`));

  await page.screenshot({ path: 'test-results/console-debug-product.png', fullPage: true });
});
