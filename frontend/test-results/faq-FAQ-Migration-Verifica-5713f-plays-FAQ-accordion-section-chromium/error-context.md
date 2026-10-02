# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: faq.spec.ts >> FAQ Migration Verification >> homepage displays FAQ accordion section
- Location: tests\faq.spec.ts:24:7

# Error details

```
Error: expect(locator).toHaveCSS(expected) failed

Locator: locator('details').first().locator('summary svg')
Expected pattern: /matrix/
Received string:  "none"
Timeout: 5000ms

Call log:
  - Expect "toHaveCSS" locator('details').first().locator('summary svg') with timeout 5000ms
  - waiting for locator('details').first().locator('summary svg')
    14 × locator resolved to <svg fill="none" stroke-width="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5 shrink-0 text-brand-primary transition-transform group-open:rotate-180">…</svg>
       - unexpected value "none"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "pf Pragati Furniture" [ref=e5] [cursor=pointer]:
          - /url: /
          - generic [ref=e6]: pf
          - generic [ref=e7]: Pragati Furniture
        - navigation "Main navigation" [ref=e8]:
          - link "Home" [ref=e9] [cursor=pointer]:
            - /url: /
          - link "Beds" [ref=e10] [cursor=pointer]:
            - /url: /products/beds
          - link "Chairs" [ref=e11] [cursor=pointer]:
            - /url: /products/chairs
          - link "Dining Sets" [ref=e12] [cursor=pointer]:
            - /url: /products/dining-sets
          - link "Sofas" [ref=e13] [cursor=pointer]:
            - /url: /products/sofas
          - link "Wardrobes" [ref=e14] [cursor=pointer]:
            - /url: /products/wardrobes
          - link "About" [ref=e15] [cursor=pointer]:
            - /url: /about
          - link "Contact" [ref=e16] [cursor=pointer]:
            - /url: /contact
        - link "WhatsApp" [ref=e18] [cursor=pointer]:
          - /url: https://wa.me/91XXXXXXXXXX?text=Hello%20Pragati%20Furniture!%20I'd%20like%20to%20know%20more%20about%20your%20furniture.
    - main [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e24]:
          - heading "Quality wooden furniture for every Indian home" [level=1] [ref=e25]
          - paragraph [ref=e27]: A family-run furniture store in Muzaffarnagar, Uttar Pradesh — hand-picked sofas, beds, dining sets and more. Built to last, priced honestly.
          - generic [ref=e28]:
            - link "Browse furniture" [ref=e29] [cursor=pointer]:
              - /url: /products/beds
            - link "Chat with us" [ref=e30] [cursor=pointer]:
              - /url: https://wa.me/91XXXXXXXXXX?text=Hello%20Pragati%20Furniture!%20I'd%20like%20to%20know%20more%20about%20your%20furniture.
        - generic [ref=e31]:
          - generic [ref=e32]:
            - heading "Browse by category" [level=2] [ref=e33]
            - paragraph [ref=e35]: Explore our range of furniture for every room in your home.
          - generic [ref=e36]:
            - link [ref=e38] [cursor=pointer]:
              - /url: /products/beds
              - img "Beds at Pragati Furniture, Muzaffarnagar" [ref=e40]
              - generic [ref=e41]:
                - heading "Beds" [level=3] [ref=e42]
                - paragraph [ref=e43]: Wooden beds in every size — single, double, queen and king — crafted from the best-quality sheesham and teak wood at Pragati Furniture, Muzaffarnagar.
                - paragraph [ref=e44]: 1 product
            - link "pf Chairs Comfortable and sturdy chairs for the dining room, study, office and balcony — now available at Pragati Furniture in Muzaffarnagar. 0 products" [ref=e46] [cursor=pointer]:
              - /url: /products/chairs
              - generic [ref=e47]: pf
              - generic [ref=e50]:
                - heading "Chairs" [level=3] [ref=e51]
                - paragraph [ref=e52]: Comfortable and sturdy chairs for the dining room, study, office and balcony — now available at Pragati Furniture in Muzaffarnagar.
                - paragraph [ref=e53]: 0 products
            - link [ref=e55] [cursor=pointer]:
              - /url: /products/dining-sets
              - img "Dining Sets at Pragati Furniture, Muzaffarnagar" [ref=e57]
              - generic [ref=e58]:
                - heading "Dining Sets" [level=3] [ref=e59]
                - paragraph [ref=e60]: Solid wood dining tables and chair sets for every home and budget. Visit Pragati Furniture in Muzaffarnagar to see the full range in person.
                - paragraph [ref=e61]: 1 product
            - link [ref=e63] [cursor=pointer]:
              - /url: /products/sofas
              - img "Sofas at Pragati Furniture, Muzaffarnagar" [ref=e65]
              - generic [ref=e66]:
                - heading "Sofas" [level=3] [ref=e67]
                - paragraph [ref=e68]: Explore Pragati Furniture's range of sofas in Muzaffarnagar — solid wood frames, comfortable cushioning and durable finishes built for Indian homes and family living rooms.
                - paragraph [ref=e69]: 2 products
            - link "pf Wardrobes Spacious, durable wardrobes in a variety of finishes and sizes, made to order by Pragati Furniture in Muzaffarnagar, Uttar Pradesh. 0 products" [ref=e71] [cursor=pointer]:
              - /url: /products/wardrobes
              - generic [ref=e72]: pf
              - generic [ref=e75]:
                - heading "Wardrobes" [level=3] [ref=e76]
                - paragraph [ref=e77]: Spacious, durable wardrobes in a variety of finishes and sizes, made to order by Pragati Furniture in Muzaffarnagar, Uttar Pradesh.
                - paragraph [ref=e78]: 0 products
        - generic [ref=e80]:
          - generic [ref=e81]:
            - heading "New arrivals" [level=2] [ref=e82]
            - paragraph [ref=e84]: The latest pieces ready and waiting for you.
          - generic [ref=e85]:
            - link [ref=e87] [cursor=pointer]:
              - /url: /products/dining-sets/6-seater-dining-table-set
              - img "6-Seater Dining Table Set, Dining Sets at Pragati Furniture" [ref=e89]
              - generic [ref=e90]:
                - paragraph [ref=e91]: Dining Sets
                - heading "6-Seater Dining Table Set" [level=3] [ref=e92]
                - paragraph [ref=e93]: Enquire for details
            - link [ref=e95] [cursor=pointer]:
              - /url: /products/beds/double-bed-with-storage-sheesham
              - img "Double Bed with Storage (Sheesham), Beds at Pragati Furniture" [ref=e97]
              - generic [ref=e98]:
                - paragraph [ref=e99]: Beds
                - heading "Double Bed with Storage (Sheesham)" [level=3] [ref=e100]
                - paragraph [ref=e101]: Enquire for details
            - link [ref=e103] [cursor=pointer]:
              - /url: /products/sofas/2-seater-wooden-sofa-with-cushions
              - img "2-Seater Wooden Sofa with Cushions, Sofas at Pragati Furniture" [ref=e105]
              - generic [ref=e106]:
                - paragraph [ref=e107]: Sofas
                - heading "2-Seater Wooden Sofa with Cushions" [level=3] [ref=e108]
                - paragraph [ref=e109]: Enquire for details
            - link [ref=e111] [cursor=pointer]:
              - /url: /products/sofas/3-seater-sheesham-wood-sofa
              - img "3-Seater Sheesham Wood Sofa, Sofas at Pragati Furniture" [ref=e113]
              - generic [ref=e114]:
                - paragraph [ref=e115]: Sofas
                - heading "3-Seater Sheesham Wood Sofa" [level=3] [ref=e116]
                - paragraph [ref=e117]: Enquire for details
          - link "See the full range" [ref=e119] [cursor=pointer]:
            - /url: /products/beds
        - generic [ref=e121]:
          - generic [ref=e122]:
            - generic [ref=e123]:
              - heading "Furniture that works as hard as you do" [level=2] [ref=e124]
              - paragraph [ref=e126]: For years, Muzaffarnagar families have trusted us with their homes. Every sofa, bed and dining set is chosen for honest materials, strong construction and a fair price — and if you need something special, we make it to order.
            - list [ref=e127]:
              - listitem [ref=e128]:
                - generic [ref=e130]:
                  - paragraph [ref=e131]: Solid wood, not shortcuts
                  - paragraph [ref=e132]: Durable sheesham and teak construction that lasts for generations.
              - listitem [ref=e133]:
                - generic [ref=e135]:
                  - paragraph [ref=e136]: Made to order
                  - paragraph [ref=e137]: Need a custom size or finish? We build what your home needs.
              - listitem [ref=e138]:
                - generic [ref=e140]:
                  - paragraph [ref=e141]: Honest local prices
                  - paragraph [ref=e142]: No middlemen, no inflated showroom margins—just fair local pricing.
            - link "More about us" [ref=e144] [cursor=pointer]:
              - /url: /about
          - complementary [ref=e146]:
            - heading "Visit our store" [level=3] [ref=e147]
            - generic [ref=e148]:
              - generic [ref=e149]: Shop Address Line 1
              - generic [ref=e150]: Muzaffarnagar, Uttar Pradesh
              - generic [ref=e151]: India
              - link "+91-XXXXXXXXXX" [ref=e152] [cursor=pointer]:
                - /url: tel:+91-XXXXXXXXXX
            - paragraph [ref=e153]: Opening hours
            - paragraph [ref=e154]: "Mon–Sun: 10:00 AM – 8:00 PM"
            - link "Message us on WhatsApp" [ref=e155] [cursor=pointer]:
              - /url: https://wa.me/91XXXXXXXXXX?text=Hello%20Pragati%20Furniture!%20I'd%20like%20to%20know%20more%20about%20your%20range.
            - link "Contact page & map" [ref=e157] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e159]:
          - generic [ref=e160]:
            - heading "Frequently asked questions" [level=2] [ref=e161]
            - paragraph [ref=e163]: Common questions about Pragati Furniture, Muzaffarnagar — delivery, customization, materials, warranty and more.
          - generic [ref=e164]:
            - group [ref=e166]:
              - generic "Do you offer home delivery in Muzaffarnagar?" [active] [ref=e167] [cursor=pointer]
              - generic [ref=e170]: Yes, we offer home delivery within Muzaffarnagar. For areas outside the city, please contact us to confirm availability and charges.
            - group [ref=e172]:
              - generic "Can furniture be customized (size, fabric, wood finish)?" [ref=e173] [cursor=pointer]
            - group [ref=e177]:
              - generic "What materials are used in your furniture?" [ref=e178] [cursor=pointer]
            - group [ref=e182]:
              - generic "What are your store timings?" [ref=e183] [cursor=pointer]
            - group [ref=e187]:
              - generic "Do you provide a warranty on furniture?" [ref=e188] [cursor=pointer]
            - group [ref=e192]:
              - generic "What payment methods do you accept?" [ref=e193] [cursor=pointer]
            - group [ref=e197]:
              - generic "How long does delivery take after ordering?" [ref=e198] [cursor=pointer]
            - group [ref=e202]:
              - generic "Can I visit the store to see the furniture in person?" [ref=e203] [cursor=pointer]
    - contentinfo [ref=e206]:
      - generic [ref=e207]:
        - generic [ref=e208]:
          - heading "Pragati Furniture" [level=2] [ref=e209]
          - paragraph [ref=e210]: Quality wooden furniture for every home, made to last. Visit us in Muzaffarnagar, Uttar Pradesh.
          - generic [ref=e211]:
            - generic [ref=e212]: Shop Address Line 1
            - generic [ref=e213]: Muzaffarnagar, Uttar Pradesh
            - generic [ref=e214]: India
            - generic [ref=e215]: +91-XXXXXXXXXX
        - generic [ref=e216]:
          - heading "Explore" [level=2] [ref=e217]
          - list [ref=e218]:
            - listitem [ref=e219]:
              - link "Home" [ref=e220] [cursor=pointer]:
                - /url: /
            - listitem [ref=e221]:
              - link "About us" [ref=e222] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e223]:
              - link "Contact" [ref=e224] [cursor=pointer]:
                - /url: /contact
        - generic [ref=e225]:
          - heading "Categories" [level=2] [ref=e226]
          - list [ref=e227]:
            - listitem [ref=e228]:
              - link "Beds" [ref=e229] [cursor=pointer]:
                - /url: /products/beds
            - listitem [ref=e230]:
              - link "Chairs" [ref=e231] [cursor=pointer]:
                - /url: /products/chairs
            - listitem [ref=e232]:
              - link "Dining Sets" [ref=e233] [cursor=pointer]:
                - /url: /products/dining-sets
            - listitem [ref=e234]:
              - link "Sofas" [ref=e235] [cursor=pointer]:
                - /url: /products/sofas
            - listitem [ref=e236]:
              - link "Wardrobes" [ref=e237] [cursor=pointer]:
                - /url: /products/wardrobes
        - generic [ref=e238]:
          - heading "Reach us" [level=2] [ref=e239]
          - list [ref=e240]:
            - listitem [ref=e241]:
              - text: Opening hours
              - paragraph [ref=e242]: "Mon–Sun: 10:00 AM – 8:00 PM"
            - listitem [ref=e243]:
              - link "Chat on WhatsApp" [ref=e244] [cursor=pointer]:
                - /url: https://wa.me/91XXXXXXXXXX?text=Hello%20Pragati%20Furniture!%20I'd%20like%20to%20ask%20about%20your%20furniture.
            - listitem [ref=e245]:
              - link "Send us an enquiry" [ref=e246] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e248]:
        - paragraph [ref=e249]: © 2026 Pragati Furniture, Muzaffarnagar. All rights reserved.
        - paragraph [ref=e250]: Made with care in Muzaffarnagar, India.
    - link "Chat with Pragati Furniture on WhatsApp" [ref=e251] [cursor=pointer]:
      - /url: https://wa.me/91XXXXXXXXXX?text=Hello%20Pragati%20Furniture!%20I%20found%20your%20website%20and%20would%20like%20to%20know%20more.
  - button "Open Next.js Dev Tools" [ref=e259] [cursor=pointer]
  - alert [ref=e263]
```

# Test source

```ts
  1   | /**
  2   |  * Playwright test to verify:
  3   |  * 1. Visiting /faq directly returns 404 (route deleted)
  4   |  * 2. Homepage shows FAQ accordion section with real content from API
  5   |  */
  6   | 
  7   | import { test, expect } from '@playwright/test';
  8   | 
  9   | test.describe('FAQ Migration Verification', () => {
  10  |   test('/faq route returns 404', async ({ page }) => {
  11  |     // Visit /faq - should show 404 page since route was deleted
  12  |     const response = await page.goto('/faq');
  13  | 
  14  |     // Check that we get a 404 status
  15  |     expect(response?.status()).toBe(404);
  16  | 
  17  |     // Verify the 404 page is shown (Next.js default 404)
  18  |     const bodyText = await page.textContent('body');
  19  |     expect(bodyText).toBeTruthy();
  20  | 
  21  |     console.log('✓ /faq route correctly returns 404');
  22  |   });
  23  | 
  24  |   test('homepage displays FAQ accordion section', async ({ page }) => {
  25  |     await page.goto('/');
  26  |     await page.waitForLoadState('networkidle');
  27  | 
  28  |     // Check for FAQ section heading
  29  |     const faqHeading = page.getByRole('heading', { name: /frequently asked questions/i });
  30  |     await expect(faqHeading).toBeVisible();
  31  | 
  32  |     // Check for FAQ accordion items (details elements)
  33  |     const faqItems = page.locator('details');
  34  |     const count = await faqItems.count();
  35  | 
  36  |     console.log(`Found ${count} FAQ items on homepage`);
  37  |     expect(count).toBeGreaterThan(0);
  38  | 
  39  |     // Verify first FAQ can be expanded
  40  |     const firstFaq = faqItems.first();
  41  |     const questionText = await firstFaq.locator('summary').textContent();
  42  |     console.log(`First FAQ question: ${questionText}`);
  43  | 
  44  |     // Click to expand
  45  |     await firstFaq.locator('summary').click();
  46  | 
  47  |     // Verify answer is now visible
  48  |     const answerContent = await firstFaq.locator('summary + div').textContent();
  49  |     expect(answerContent).toBeTruthy();
  50  |     console.log(`✓ FAQ accordion expands correctly`);
  51  | 
  52  |     // Verify chevron rotation (SVG inside summary)
  53  |     const chevron = firstFaq.locator('summary svg');
> 54  |     await expect(chevron).toHaveCSS('transform', /matrix/); // rotated when open
      |                           ^ Error: expect(locator).toHaveCSS(expected) failed
  55  |   });
  56  | 
  57  |   test('homepage emits FAQPage JSON-LD', async ({ page }) => {
  58  |     await page.goto('/');
  59  | 
  60  |     // Check for JSON-LD script tag with FAQPage schema
  61  |     const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
  62  | 
  63  |     let foundFaqSchema = false;
  64  |     let foundLocalBusinessSchema = false;
  65  | 
  66  |     for (const script of jsonLdScripts) {
  67  |       const content = await script.textContent();
  68  |       if (content) {
  69  |         try {
  70  |           const json = JSON.parse(content);
  71  |           if (json['@type'] === 'FAQPage') {
  72  |             foundFaqSchema = true;
  73  |             expect(json.mainEntity).toBeDefined();
  74  |             expect(Array.isArray(json.mainEntity)).toBeTruthy();
  75  |             console.log(`✓ Found FAQPage JSON-LD with ${json.mainEntity.length} questions`);
  76  |           }
  77  |           if (json['@type'] === 'FurnitureStore') {
  78  |             foundLocalBusinessSchema = true;
  79  |             console.log('✓ Found LocalBusiness JSON-LD');
  80  |           }
  81  |         } catch (e) {
  82  |           // Not JSON, skip
  83  |         }
  84  |       }
  85  |     }
  86  | 
  87  |     expect(foundFaqSchema).toBeTruthy();
  88  |     expect(foundLocalBusinessSchema).toBeTruthy();
  89  |   });
  90  | 
  91  |   test('/api/faqs returns active FAQs', async ({ request }) => {
  92  |     const response = await request.get('/api/faqs');
  93  |     expect(response.ok()).toBeTruthy();
  94  | 
  95  |     const faqs = await response.json();
  96  |     expect(Array.isArray(faqs.data)).toBeTruthy();
  97  | 
  98  |     if (faqs.data.length > 0) {
  99  |       const firstFaq = faqs.data[0];
  100 |       expect(firstFaq).toHaveProperty('id');
  101 |       expect(firstFaq).toHaveProperty('question');
  102 |       expect(firstFaq).toHaveProperty('answer');
  103 |       console.log(`✓ /api/faqs returns ${faqs.data.length} FAQs`);
  104 |     } else {
  105 |       console.log('⚠ No FAQs in database, but API works');
  106 |     }
  107 |   });
  108 | 
  109 |   test('no /faq links remain in navigation', async ({ page }) => {
  110 |     await page.goto('/');
  111 | 
  112 |     // Check all links in the page
  113 |     const links = await page.locator('a[href*="/faq"]').all();
  114 | 
  115 |     // Filter out admin/api routes
  116 |     const publicFaqLinks = [];
  117 |     for (const link of links) {
  118 |       const href = await link.getAttribute('href');
  119 |       if (href && !href.includes('/admin') && !href.includes('/api')) {
  120 |         publicFaqLinks.push(href);
  121 |       }
  122 |     }
  123 | 
  124 |     expect(publicFaqLinks.length).toBe(0);
  125 |     console.log('✓ No public /faq links found in navigation');
  126 |   });
  127 | 
  128 |   test('sitemap does not include /faq', async ({ request }) => {
  129 |     const response = await request.get('/sitemap.xml');
  130 |     const sitemap = await response.text();
  131 | 
  132 |     // Check that /faq is not in the sitemap
  133 |     expect(sitemap).not.toContain('<loc>http://localhost:3000/faq</loc>');
  134 |     expect(sitemap).not.toContain('<loc>https://pragatifurniture.com/faq</loc>');
  135 | 
  136 |     // Verify expected URLs are present
  137 |     expect(sitemap).toContain('<loc>');
  138 |     console.log('✓ Sitemap correctly excludes /faq');
  139 |   });
  140 | });
  141 | 
```