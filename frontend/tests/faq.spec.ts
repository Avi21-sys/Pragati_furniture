/**
 * Playwright test to verify:
 * 1. Visiting /faq directly returns 404 (route deleted)
 * 2. Homepage shows FAQ accordion section with real content from API
 */

import { test, expect } from '@playwright/test';

test.describe('FAQ Migration Verification', () => {
  test('/faq route returns 404', async ({ page }) => {
    // Visit /faq - should show 404 page since route was deleted
    const response = await page.goto('/faq');

    // Check that we get a 404 status
    expect(response?.status()).toBe(404);

    // Verify the 404 page is shown (Next.js default 404)
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();

    console.log('✓ /faq route correctly returns 404');
  });

  test('homepage displays FAQ accordion section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for FAQ section heading
    const faqHeading = page.getByRole('heading', { name: /frequently asked questions/i });
    await expect(faqHeading).toBeVisible();

    // Check for FAQ accordion items (details elements)
    const faqItems = page.locator('details');
    const count = await faqItems.count();

    console.log(`Found ${count} FAQ items on homepage`);
    expect(count).toBeGreaterThan(0);

    // Verify first FAQ can be expanded
    const firstFaq = faqItems.first();
    const questionText = await firstFaq.locator('summary').textContent();
    console.log(`First FAQ question: ${questionText}`);

    // Click to expand
    await firstFaq.locator('summary').click();

    // Verify answer is now visible
    const answerContent = await firstFaq.locator('summary + div').textContent();
    expect(answerContent).toBeTruthy();
    console.log(`✓ FAQ accordion expands correctly`);

    // Verify chevron rotation (SVG inside summary)
    const chevron = firstFaq.locator('summary svg');
    await expect(chevron).toHaveCSS('transform', /matrix/); // rotated when open
  });

  test('homepage emits FAQPage JSON-LD', async ({ page }) => {
    await page.goto('/');

    // Check for JSON-LD script tag with FAQPage schema
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();

    let foundFaqSchema = false;
    let foundLocalBusinessSchema = false;

    for (const script of jsonLdScripts) {
      const content = await script.textContent();
      if (content) {
        try {
          const json = JSON.parse(content);
          if (json['@type'] === 'FAQPage') {
            foundFaqSchema = true;
            expect(json.mainEntity).toBeDefined();
            expect(Array.isArray(json.mainEntity)).toBeTruthy();
            console.log(`✓ Found FAQPage JSON-LD with ${json.mainEntity.length} questions`);
          }
          if (json['@type'] === 'FurnitureStore') {
            foundLocalBusinessSchema = true;
            console.log('✓ Found LocalBusiness JSON-LD');
          }
        } catch {
          // Not JSON, skip
        }
      }
    }

    expect(foundFaqSchema).toBeTruthy();
    expect(foundLocalBusinessSchema).toBeTruthy();
  });

  test('/api/faqs returns active FAQs', async ({ request }) => {
    const response = await request.get('/api/faqs');
    expect(response.ok()).toBeTruthy();

    const faqs = await response.json();
    expect(Array.isArray(faqs.data)).toBeTruthy();

    if (faqs.data.length > 0) {
      const firstFaq = faqs.data[0];
      expect(firstFaq).toHaveProperty('id');
      expect(firstFaq).toHaveProperty('question');
      expect(firstFaq).toHaveProperty('answer');
      console.log(`✓ /api/faqs returns ${faqs.data.length} FAQs`);
    } else {
      console.log('⚠ No FAQs in database, but API works');
    }
  });

  test('no /faq links remain in navigation', async ({ page }) => {
    await page.goto('/');

    // Check all links in the page
    const links = await page.locator('a[href*="/faq"]').all();

    // Filter out admin/api routes
    const publicFaqLinks = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.includes('/admin') && !href.includes('/api')) {
        publicFaqLinks.push(href);
      }
    }

    expect(publicFaqLinks.length).toBe(0);
    console.log('✓ No public /faq links found in navigation');
  });

  test('sitemap does not include /faq', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const sitemap = await response.text();

    // Check that /faq is not in the sitemap
    expect(sitemap).not.toContain('<loc>http://localhost:3000/faq</loc>');
    expect(sitemap).not.toContain('<loc>https://pragatifurniture.com/faq</loc>');

    // Verify expected URLs are present
    expect(sitemap).toContain('<loc>');
    console.log('✓ Sitemap correctly excludes /faq');
  });
});
