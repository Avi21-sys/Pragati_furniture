// Playwright diagnostic script to capture errors on localhost:3000
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const errors = [];
  const consoleMessages = [];
  const failedRequests = [];

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${text}`);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack
    });
    console.log(`\n[PAGE ERROR] ${error.message}`);
    if (error.stack) {
      console.log(error.stack);
    }
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    const failure = {
      url: request.url(),
      method: request.method(),
      errorText: request.failure()?.errorText
    };
    failedRequests.push(failure);
    console.log(`\n[REQUEST FAILED] ${request.method()} ${request.url()}`);
    console.log(`Error: ${request.failure()?.errorText}`);
  });

  // Capture response errors (4xx, 5xx)
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`\n[HTTP ERROR] ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('Navigating to http://localhost:3000...\n');

    const response = await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log(`Response status: ${response.status()}`);
    console.log(`Page loaded: ${page.url()}\n`);

    // Wait for network to settle
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('Note: Network did not become idle within 10s');
    });

    // Wait a bit more to capture any runtime errors
    await page.waitForTimeout(2000);

    // Get page title
    const title = await page.title();

    // Check if there's any visible error text on the page
    const bodyText = await page.locator('body').textContent();
    const hasErrorText = bodyText.toLowerCase().includes('error') ||
                        bodyText.toLowerCase().includes('failed');

    // Take screenshots
    const screenshotPath = 'D:\\Pragati-furniture\\screenshot.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log('\n=== DIAGNOSIS SUMMARY ===');
    console.log(`Title: ${title}`);
    console.log(`URL: ${page.url()}`);
    console.log(`Page errors: ${errors.length}`);
    console.log(`Console errors: ${consoleMessages.filter(m => m.type === 'error').length}`);
    console.log(`Console warnings: ${consoleMessages.filter(m => m.type === 'warning').length}`);
    console.log(`Failed requests: ${failedRequests.length}`);
    console.log(`Visible error text detected: ${hasErrorText}`);

    if (errors.length > 0) {
      console.log('\n=== PAGE ERRORS ===');
      errors.forEach((err, i) => {
        console.log(`\n${i + 1}. ${err.message}`);
        if (err.stack) console.log(err.stack);
      });
    }

    if (consoleMessages.filter(m => m.type === 'error').length > 0) {
      console.log('\n=== CONSOLE ERRORS ===');
      consoleMessages
        .filter(m => m.type === 'error')
        .forEach((msg, i) => console.log(`${i + 1}. ${msg.text}`));
    }

    if (consoleMessages.filter(m => m.type === 'warning').length > 0) {
      console.log('\n=== CONSOLE WARNINGS (first 5) ===');
      consoleMessages
        .filter(m => m.type === 'warning')
        .slice(0, 5)
        .forEach((msg, i) => console.log(`${i + 1}. ${msg.text}`));
    }

    if (failedRequests.length > 0) {
      console.log('\n=== FAILED REQUESTS ===');
      failedRequests.forEach((req, i) => {
        console.log(`${i + 1}. ${req.method} ${req.url}`);
        console.log(`   Error: ${req.errorText}`);
      });
    }

    console.log(`\nScreenshot saved to: ${screenshotPath}`);
    console.log('\nBrowser will close in 5 seconds...');

    await page.waitForTimeout(5000);
    await browser.close();

  } catch (error) {
    console.error('\n[FATAL ERROR]', error.message);
    if (error.stack) console.error(error.stack);
    await browser.close();
    process.exit(1);
  }
})();
