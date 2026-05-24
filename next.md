# KHU Enterprise – Website Project Reference

> Hand this file to any new chat session and it will know exactly where the project stands and what to do next.

---

## 1. Business Overview

| Field | Details |
|---|---|
| **Brand** | KHU Enterprise |
| **Founded** | 2010 |
| **Location** | Lahore, Punjab, Pakistan |
| **Business type** | Direct-from-factory manufacturer & exporter |
| **Primary market** | EU, UK, USA (wholesale first, then retail) |
| **Physical stores** | None outside Pakistan — all orders ship internationally |
| **WhatsApp** | +923340049278 |
| **Email** | info@khu-enterprise.com |
| **Domain** | https://khu-enterprise.com |
| **MOQ** | 50 pcs per style |
| **Lead time** | 20–25 working days |
| **Customisation** | Logo / Label / Colour / Packaging (all products) |
| **Shipping** | DHL & FedEx — EU 8–12 days, USA 10–14 days |
| **Payment** | Bank Transfer (TT/Wire), PayPal, Wise, WhatsApp confirm |

### Product categories (active)
Hosiery & sportswear: summer tracksuits, winter tracksuits, sports tracksuits, puffer jackets, gym sets, compression, gym shorts, sports bra, biker shorts, leggings/tights, running, yoga, football, womens swim, mens swim

Leather: leather jackets, leather vests, leather bags, leather belts, leather wallets, accessories (keychains etc)

### Removed categories (do NOT add back)
- Tropical Bikini Set (id:30) — removed
- Surf Rash Guard – Unisex (id:34) — removed
- Leather Coats / Hooded Leather Jacket (id:38) — removed
- Sheer Stockings – Women (id:16) — removed (session 5)
- Sports Ankle Socks (id:17) — removed (session 5)
- Compression Crew Socks (id:18) — removed (session 5)

---

## 2. Tech Stack

| File | Role |
|---|---|
| `index.html` | Single-page app shell — all sections, SEO head, JSON-LD schema |
| `style.css` | All styles — dark nav, product cards, modals, responsive |
| `app.js` | All JS — product data array, rendering, filters, cart, WhatsApp/email |
| `sitemap.xml` | SEO sitemap (9 URLs + 3 product images) |
| `robots.txt` | Allow all, disallow utility scripts, sitemap pointer |
| `next.md` | This file — project reference |

### Key JS constants (top of app.js)
```js
const PKR_RATE = 278;       // legacy, kept but not displayed
const WA_NUMBER = '923340049278';
const KHU_EMAIL = 'info@khu-enterprise.com';
```

### Currency switcher (live rates)
- State: `state.currency` (default `'USD'`), `state.rates` (`{USD:1, GBP:x, EUR:y}`)
- Rates fetched on load via **Frankfurter API** (free, no key): `https://api.frankfurter.app/latest?from=USD&to=GBP,EUR`
- Function: `setCurrency('USD'|'GBP'|'EUR')` — re-renders all visible prices
- PKR removed from all display (not shown to customers)

### EmailJS wiring
- CDN added to index.html head: `@emailjs/browser@3`
- Functions: `submitContact(e)` and `submitWholesale(e)` use `emailjs.sendForm()`
- **ACTION NEEDED**: Replace 3 placeholders in app.js with real IDs from emailjs.com:
  - `YOUR_SERVICE_ID` → your EmailJS service ID
  - `YOUR_CONTACT_TEMPLATE_ID` → template for contact form
  - `YOUR_WHOLESALE_TEMPLATE_ID` → template for wholesale form
- Fallback: if EmailJS not loaded/configured, both forms redirect to WhatsApp

### Section IDs in index.html
`homeSection`, `productsSection`, `productDetailSection`, `saleSection`, `wholesaleSection`, `aboutSection`, `contactSection`, `checkoutSection`

### Navigation function
`showSection('sectionName')` — call this to switch between pages

---

## 3. Image Folders

```
images/                    ← original downloaded category folders (keep untouched)
  lj-*/                    ← leather jacket images
  wa_*/                    ← WhatsApp-received product photos
  wallet-*/                ← wallet images
  belt-*/                  ← belt images
  acc-*/                   ← accessory images
  puffer-*/                ← puffer jacket images
  hero-*.jpg               ← hero slider backgrounds
  cat-*.jpg                ← category grid cards
  promo-*.jpg              ← promotional banners
  menu-*.jpg               ← mega menu preview images
  ...various categories

images/products/           ← CANONICAL folder for all active product images
  sports-bra-women-1.jpg   ... (4 files)
  gym-shorts-men-1.jpg     ... (5 files)
  biker-shorts-women-1.jpg ... (7 files)
  compression-tights-1.jpg ... (3 files)
  running-set-1.jpg        ... (3 files)
  football-kit-men-1.jpg   ... (6 files)
  yoga-zen-women-1.jpg     ... (3 files)
  swim-trunks-men-1.jpg    ... (3 files)
  jammers-men-1.jpg        ... (3 files)
  swimsuit-onepiece-1.jpg  ... (3 files)
  tankini-women-1.jpg      ... (6 files)
  bag-messenger-1.jpg      ... (6 files)
  bag-crossbody-women-1.jpg ... (5 files)
  vest-leather-men-1.jpg   ... (5 files)
  vest-leather-women-1.jpg ... (6 files)
  gym-set-women-1.jpg      ... (5 files)
  yoga-flow-women-1.jpg    ... (5 files)
  gym-set-men-1.jpg        ... (6 files)
```

**All images in `images/products/` have "© KHU Enterprise" watermark** (bottom-right, dark pill).

Watermark tool: Python + Pillow. Script pattern:
```python
from PIL import Image, ImageDraw, ImageFont
# font: DejaVuSans-Bold.ttf (system font)
# text: "© KHU Enterprise"
# position: bottom-right, 10px margin
# style: RGBA overlay, rounded-rect pill
```

---

## 4. Product Array (app.js)

Total: **44 products** (ids 1–50, with ids 16, 17, 18, 30, 34, 38 removed)

### Product object structure
```js
{
  id: Number,
  name: "String",
  category: "category-slug",   // see category slugs below
  group: "hosiery" | "leather",
  priceUSD: Number,            // retail price (EU/UK/USA market)
  origUSD: Number,             // original/crossed-out price
  image: "images/products/filename.jpg",
  cdnImage: "images/products/filename.jpg",
  images: ["img1.jpg", "img2.jpg", ...],
  rating: 4.5,
  reviews: Number,
  badge: "NEW" | "SALE" | "HOT" | "BESTSELLER" | null,
  sizes: ["XS","S","M","L","XL","XXL"],
  colors: ["Black","Navy","..."],
  description: "String",
  specs: {
    Material: "String",
    Sizes: "XS–XXL",
    MOQ: "50 pcs per style",
    "Lead Time": "15–20 working days",
    Customise: "Logo / Label / Colour / Packaging"
  },
  featured: true | false,
  bestseller: true | false,
  onSale: true | false
}
```

### Category slugs
| Slug | Group | Section |
|---|---|---|
| summer-tracksuits | hosiery | Tracksuits |
| winter-tracksuits | hosiery | Tracksuits |
| sports-tracksuits | hosiery | Tracksuits |
| puffer-jackets | hosiery | Puffer Jackets |
| uppers | hosiery | Hosiery |
| trousers | hosiery | Hosiery |
| leggings | hosiery | Hosiery |
| tights | hosiery | Hosiery |
| gym-sets | hosiery | Gym Wear |
| compression | hosiery | Gym Wear |
| gym-shorts | hosiery | Gym Wear |
| sports-bra | hosiery | Gym Wear |
| biker-shorts | hosiery | Gym Wear |
| running | hosiery | Gym Wear |
| yoga | hosiery | Gym Wear |
| football | hosiery | Sports |
| womens-swim | hosiery | Swimwear |
| mens-swim | hosiery | Swimwear |
| leather-jackets | leather | Leather |
| leather-vests | leather | Leather |
| leather-bags | leather | Leather |
| leather-belts | leather | Leather |
| leather-wallets | leather | Leather |

### Product ID quick reference
| ID | Name | Category | Local Images |
|---|---|---|---|
| 1 | Breeze Summer Tracksuit – Men | summer-tracksuits | images/product-p1.jpg (CDN fallback) |
| 2 | Breeze Summer Tracksuit – Women | summer-tracksuits | images/product-p2.jpg (CDN fallback) |
| 3 | Classic Polo Tracksuit – Unisex | summer-tracksuits | images/product-p3.jpg (CDN fallback) |
| 4 | Thermal Winter Tracksuit – Men | winter-tracksuits | images/product-p4.jpg (CDN fallback) |
| 5 | Cozy Fleece Tracksuit – Women | winter-tracksuits | images/product-p5.jpg (CDN fallback) |
| 6 | Pro Winter Set – Unisex | winter-tracksuits | images/product-p6.jpg (CDN fallback) |
| 7 | Elite Sports Tracksuit – Men | sports-tracksuits | images/product-p7.jpg (CDN fallback) |
| 8 | Arctic Puffer Jacket – Men | puffer-jackets | images/product-p8.jpg (CDN fallback) |
| 9 | Quilted Puffer Jacket – Women | puffer-jackets | CDN only |
| 10 | Classic Hoodie – Unisex | uppers | CDN only |
| 11 | Athletic Sweatshirt – Men | uppers | CDN only |
| 12 | Jogger Trousers – Unisex | trousers | images/product-p12.jpg |
| 13 | High-Waist Leggings – Women | leggings | images/product-p13.jpg |
| 14 | Printed Leggings – Women | leggings | images/product-p14.jpg |
| 15 | Thermal Running Tights – Men | tights | images/product-p15.jpg |
| ~~16~~ | ~~Sheer Stockings – Women~~ | ~~stockings~~ | **DELETED** |
| ~~17~~ | ~~Sports Ankle Socks~~ | ~~socks~~ | **DELETED** |
| ~~18~~ | ~~Compression Crew Socks~~ | ~~socks~~ | **DELETED** |
| 19 | Power Gym Set – Women | gym-sets | images/products/gym-set-women-1…5.jpg ✅ |
| 20 | Core Training Set – Men | gym-sets | images/products/gym-set-men-1…6.jpg ✅ |
| 21 | Yoga Flow Set – Women | yoga | images/products/yoga-flow-women-1…5.jpg ✅ |
| 22 | Pro Compression Tights – Unisex | compression | images/products/compression-tights-1…3.jpg ✅ |
| 23 | Performance Gym Shorts – Men | gym-shorts | images/products/gym-shorts-men-1…5.jpg ✅ |
| 24 | Biker Shorts – Women | gym-shorts | images/products/biker-shorts-women-1…7.jpg ✅ |
| 25 | Impact Sports Bra – Women | sports-bra | images/products/sports-bra-women-1…4.jpg ✅ |
| 26 | Marathon Running Set – Unisex | running | images/products/running-set-1…3.jpg ✅ |
| 27 | Zen Yoga Collection – Women | yoga | images/products/yoga-zen-women-1…3.jpg ✅ |
| 28 | Pro Football Kit – Men | football | images/products/football-kit-men-1…6.jpg ✅ |
| 29 | Paradise One-Piece Swimsuit | womens-swim | images/products/swimsuit-onepiece-1…3.jpg ✅ |
| ~~30~~ | ~~Tropical Bikini~~ | | **DELETED** |
| 31 | Sport Tankini – Women | womens-swim | images/products/tankini-women-1…6.jpg ✅ |
| 32 | Elite Swim Trunks – Men | mens-swim | images/products/swim-trunks-men-1…3.jpg ✅ |
| 33 | Pro Competition Jammers – Men | mens-swim | images/products/jammers-men-1…3.jpg ✅ |
| ~~34~~ | ~~Surf Rash Guard~~ | | **DELETED** |
| 35 | Classic Biker Jacket – Men | leather-jackets | images/lj-biker-black-front.jpg |
| 36 | Bomber Leather Jacket – Men | leather-jackets | images/lj-bomber-brown-man.jpg |
| 37 | Moto Leather Jacket – Women | leather-jackets | images/lj-women-moto-burgundy.jpg |
| ~~38~~ | ~~Leather Coat~~ | | **DELETED** |
| 39 | Cafe Racer Jacket – Men | leather-jackets | images/lj-cafe-racer-khaki.jpg |
| 40 | Voyager Leather Duffle | leather-bags | images/products/duffle-leather-1…6.jpg ✅ |
| 41 | Classic Messenger Bag | leather-bags | images/products/bag-messenger-1…6.jpg ✅ |
| 42 | Mini Crossbody Bag – Women | leather-bags | images/products/bag-crossbody-women-1…5.jpg ✅ |
| 43 | Premium Leather Belt – Unisex | leather-belts | images/products/belt-leather-1…5.jpg ✅ |
| 44 | Bifold Leather Wallet – Men | leather-wallets | images/wallet-black-bifold.jpg |
| 45 | Croc-Embossed Wallet – Women | leather-wallets | images/wallet-croc-blue-long.jpg |
| 46 | Hooded Puffer Vest – Men | puffer-jackets | images/product-p46.jpg |
| 47 | Long Down Puffer Coat – Women | puffer-jackets | images/product-p47.jpg |
| 48 | Packable Lightweight Puffer – Unisex | puffer-jackets | images/product-p48.jpg |
| 49 | Classic Biker Vest – Men | leather-vests | images/products/vest-leather-men-1…5.jpg ✅ |
| 50 | Fashion Leather Vest – Women | leather-vests | images/products/vest-leather-women-1…6.jpg ✅ |

**✅ = fully updated to local images/products/ files with full gallery**

---

## 5. Pricing Strategy

**Positioning**: Mid-premium EU/UK/USA market — Zara / H&M / Superdry tier. NOT budget, NOT luxury.

### Retail price ranges (USD)
| Category | Retail range |
|---|---|
| Summer tracksuits | $48–$54 |
| Winter tracksuits | $72–$80 |
| Sports tracksuits | $68 |
| Puffer jackets | $72–$108 |
| Gym sets | $28–$36 |
| Compression/biker shorts | $18–$22 |
| Sports bra | $22 |
| Gym shorts | $18 |
| Leggings/tights | $24–$28 |
| Running/yoga sets | $32–$38 |
| Football kit | $52 |
| Swimwear | $38–$58 |
| Leather jackets | $132–$158 |
| Leather vests | $92–$98 |
| Leather bags | $92–$125 |
| Leather wallets | $38–$48 |
| Leather belts | $42–$48 |
| Accessories | $22–$28 |

### Wholesale price tiers (USD)
| Product | 50–100 pcs | 100–500 pcs | 500+ pcs |
|---|---|---|---|
| Summer Tracksuits | $24–30 | $19–25 | $15–20 |
| Winter Tracksuits | $36–44 | $29–36 | $22–28 |
| Gym Sets & Activewear | $14–18 | $11–15 | $8–12 |
| Puffer Jackets | $36–55 | $28–44 | $22–36 |
| Leather Jackets | $66–80 | $52–65 | $40–55 |
| Leather Bags & Accessories | $46–64 | $36–52 | $28–42 |
| Swimwear Sets | $18–24 | $14–20 | $10–16 |

---

## 6. SEO Setup

### index.html head contains:
- Title: "KHU Enterprise – Genuine Leather Jackets, Hosiery & Sportswear | Pakistan Wholesale"
- Meta description targeting EU/UK/USA wholesale buyers
- Canonical: https://khu-enterprise.com/
- hreflang: en (global)
- geo.region: PK (Pakistan)
- theme-color: #1a1a2e
- Open Graph: absolute image URLs to khu-enterprise.com/images/
- Twitter card
- JSON-LD schemas: Organization, Store (LocalBusiness), WebSite (SearchAction), FAQPage (6 questions)

### sitemap.xml: 9 URLs
- / (priority 1.0, with 5 product images — updated 2026-05-22)
- /#leather-jackets (0.9), /#leather-vests (0.8), /#tracksuits (0.8), /#puffer-jackets (0.8)
- /#gym-wear (0.8), /#swimwear (0.7), /#leather-bags (0.8)
- /#wholesale (0.9), /#about (0.6), /#contact (0.7)

### robots.txt
- Allow all
- Disallow: /download_images.py, /download_images.ps1, /download_images.bat
- Sitemap: https://khu-enterprise.com/sitemap.xml

---

## 7. What Has Been Done (Session History)

1. Built complete SPA website from scratch: index.html, style.css, app.js
2. Added 47 products across all categories with dual PKR/USD pricing
3. Downloaded 233 real product photos to images/ folder
4. Watermarked all images with "© KHU Enterprise" (Pillow, Python)
5. Re-watermarked after brand name correction (was "KHU Enterprises" with S)
6. Deep-searched and fixed ALL instances of "KHU Enterprises" → "KHU Enterprise"
7. Full SEO pass: schemas, meta tags, sitemap, robots.txt
8. Added 18 new category image folders from user; watermarked 84 images to images/products/
9. Updated 18 products to use new real images from images/products/ (main + full gallery)
10. Added 2 new leather vest products (id:49, id:50)
11. Removed 6 products total: Tropical Bikini (30), Surf Rash Guard (34), Leather Coat (38), Sheer Stockings (16), Ankle Socks (17), Compression Socks (18)
12. Updated ALL products with wholesale specs (MOQ, lead time, customisation)
13. Updated pricing to EU/UK/USA mid-premium positioning
14. Changed all "Order" language → "Inquiry" / "Send Inquiry"
15. Added dual inquiry buttons: WhatsApp + Email (in product detail view)
16. Fixed back button in product detail view
17. Updated all sections: wholesale, about, contact, checkout for international market
18. Hero slides: 2026 dates, EU/UK/USA messaging
19. Trust strip: EU/UK/USA delivery, DHL/FedEx, inquiry language
20. Created check.js — 22-check permanent validation script (run after every edit)
21. Fixed sections not opening: root cause was href="#" resetting hash → showSection('home')
22. All 100 href="#" nav links changed to href="javascript:void(0)"
23. Updated all 18 product gallery images[] arrays to use full local file sets
24. Processed Elite Sports Tracksuit – Men images (6 photos, tracksuit-sports-men-*.jpg)
25. Watermarked & processed 17 new hosiery/puffer/tracksuit product folders (96 new images)
26. Removed socks & stockings from all nav locations (mega menu, mobile nav, footer)
27. Updated ALL product prices to premium level (Gymshark/Zara/Superdry tier)
28. Updated wholesale price table in index.html to match new premium pricing
29. Changed all lead times: 15–20 → 20–25 working days (45 places in app.js)
30. Created deploy/ folder — 302 images, 5 website files, zero missing references
31. Updated sitemap.xml — now 12 URLs, 13 product images, lastmod 2026-05-22
32. Added WhatsApp floating button (green circle, bottom-right, always visible, all pages)
33. Added live currency switcher USD/GBP/EUR — Frankfurter API, ECB rates, no API key needed
34. Removed PKR from all price displays across app.js (product cards, cart, detail view)
35. Added "Request a Sample" CTA (WhatsApp, pre-filled) on every product detail page
36. Added "Single custom piece available — premium pricing applies" note on product detail
37. Wired EmailJS for contact-form + wholesale-form — needs 3 placeholder IDs replaced
38. EmailJS fallback: if not configured, both forms redirect to WhatsApp automatically
39. Synced deploy/ folder with all updated files (app.js, index.html, style.css)
40. Fixed mobile header — topbar scrolls away on mobile, header/nav stays sticky at top:0
41. Watermarked Voyager Leather Duffle (6 images) and Premium Leather Belt (5 images) → images/products/
42. Updated id:40 duffle and id:43 belt in app.js with full local image galleries
43. Redesigned hero slider: Ken Burns zoom, slide-in text animations, premium overlays, gold accents
44. Copied 65 missing images from image/ to images/ (hero-*.jpg, cat-*.jpg, menu-*.jpg, product-p*.jpg)
45. Fixed filter section: Sports & Gym filter now works, multi-checkbox properly supported
46. Fixed H1 issue: reduced from 11 H1s to 1 (hero slide 1 only), others become H2 with CSS styling
47. SEO fixes: title shortened to 55 chars, description to 153 chars, LCP preload hint added
48. Added Product ItemList JSON-LD schema (3 featured products with ratings and pricing)
49. Added lazy loading to all static img tags in index.html
50. Synced deploy/ with all new images (duffle x6, belt x5, hero x4, menu x3)
51. Promo-trio section redesigned — real product photos replace grey placeholders
52. Added full CSS for promo-bg, promo-shimmer, promo-badge-sale, promo-eyebrow, promo-sub, promo-dark, promo-overlay-right, promo-tall
53. Cleaned duplicate CSS rules; promo-text z-index corrected to 3 (above shimmer and overlays)
54. deploy/ synced: index.html 71 KB, style.css 54 KB, app.js 97 KB — 22/22 checks pass

---

## 8. Known Remaining Issues / TODOs

### High priority (do these next)
- [ ] **Activate EmailJS** — open app.js, find `YOUR_SERVICE_ID`, `YOUR_CONTACT_TEMPLATE_ID`, `YOUR_WHOLESALE_TEMPLATE_ID` and replace with your real IDs from emailjs.com (free, 200 emails/month)
- [x] ~~**Menu images**~~ — Fixed: menu-tracksuits.jpg, menu-gym.jpg, menu-leather.jpg now in images/ folder
- [x] ~~**Leather duffle real image**~~ — Fixed: 6 real duffle images watermarked and added
- [ ] **Deploy to live hosting** — upload `deploy/` folder contents to your hosting provider (see Section 10)

### Medium priority
- [ ] Add leather jacket gallery images for ids 35–39 (extra angles, different colours)
- [ ] Add Google Analytics (GA4) — paste tracking ID, I'll add the script tag
- [ ] Add size guide modal per category
- [ ] Video/lookbook hero section (PENDING — marked for future session)

### Completed (session 6)
- [x] WhatsApp floating button (green bubble, bottom-right, always visible)
- [x] Currency switcher USD / GBP / EUR with live Frankfurter API rates
- [x] PKR removed from all price displays
- [x] "Request a Sample" CTA on every product detail page (WhatsApp pre-filled)
- [x] Single piece note on product detail ("premium pricing applies")
- [x] EmailJS wiring for contact + wholesale forms (needs your 3 IDs to activate)
- [x] Shipping text: "Shipping cost varies with order quantity and destination — contact us for a quote"

### Completed (session 7)
- [x] Mobile header fixed — announcement bar scrolls, nav stays sticky
- [x] Duffle bag images (6) and belt images (5) watermarked and added to app.js galleries
- [x] Hero banners redesigned: Ken Burns zoom, staggered text animations, gold accent bar, premium overlays
- [x] 65 missing images copied from image/ to images/ — hero, menu, category, product images now load
- [x] Filter section fixed: Sports & Gym checkbox now works, multi-select supported
- [x] SEO: single H1, title 55 chars, description 153 chars, LCP preload, Product ItemList schema
- [x] deploy/ fully synced with all changes

### Completed (session 8)
- [x] Promo-trio section redesigned — replaced grey placeholder cards with real product photos
  - Card 1 (left): Summer Tracksuits → `tracksuit-summer-men-1.jpg`, left-fade overlay
  - Card 2 (centre, tall): SALE → `lj-biker-black-front.jpg`, deep dark overlay, red fire badge
  - Card 3 (right): Gym & Sport Sets → `gym-set-women-1.jpg`, right-fade overlay
- [x] Added all missing promo CSS classes to style.css:
  - `.promo-bg` — background-image div with scale(1.05) hover zoom, smooth 0.6s transition
  - `.promo-shimmer` — diagonal gloss overlay (fades out on hover)
  - `.promo-overlay-right` — right-to-left gradient for Card 3
  - `.promo-dark` — deep dark overlay for Sale card
  - `.promo-badge-sale` — red pill badge top-right, z-index:4
  - `.promo-eyebrow` — gold uppercase tracking label above H3
  - `.promo-sub` — muted subtitle line
  - `.promo-tall` — 440px desktop / 320px mobile for centre card
- [x] Cleaned duplicate CSS rules (promo-overlay, promo-text, promo-text h3)
- [x] deploy/ synced (app.js 97 KB, index.html 71 KB, style.css 54 KB)
- [x] check.js: 22/22 PASS

### Low priority
- [ ] Create dedicated product pages for SEO (currently hash-anchored)
- [ ] Instagram feed integration
- [ ] Live chat widget (Tidio)
- [ ] Blog / lookbook section for SEO content

---

## 9. Deploy to Hosting — What to Upload

The `deploy/` folder in `D:\website\website\deploy\` contains everything your hosting needs.

### Folder structure to upload:
```
deploy/
  index.html        ← main website file
  style.css         ← all styles
  app.js            ← all products + JavaScript
  sitemap.xml       ← SEO sitemap
  robots.txt        ← search engine rules
  images/           ← 112 root images (leather jackets, wallets, belts)
    products/       ← 190 watermarked product images
```

### How to upload (any cPanel / FTP hosting):
1. Open your hosting File Manager or FTP client (FileZilla etc.)
2. Navigate to `public_html/` (or `www/` — the web root)
3. Upload ALL contents of `deploy/` directly into the web root
4. Point your domain DNS to your hosting server IP
5. Wait 1–24 hrs for DNS propagation — site will be live

### Recommended hosting for this site:
- **Hostinger** ($2.99/mo) — fastest for EU/Asia traffic, cPanel, easy file manager
- **SiteGround** ($3.99/mo) — excellent UK/EU performance
- **Cloudflare Pages** (free) — excellent CDN, connect GitHub repo

### Domain tips:
- Buy `khu-enterprise.com` (or `.co.uk` for UK focus)
- Recommended registrars: Namecheap, Cloudflare Registrar (cheapest renewal)
- After buying, point nameservers to your hosting provider

### After going live, submit to Google:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://khu-enterprise.com/`
3. Verify ownership (HTML file method — easiest)
4. Submit sitemap: `https://khu-enterprise.com/sitemap.xml`

---

## 10. How to Add a New Product

In `app.js`, find the `const products = [...]` array. Add a new object following this template:

```js
{
  id: 51,                                    // next available ID
  name: "Product Name – Gender",
  category: "category-slug",                // see section 4 for slugs
  group: "hosiery",                         // or "leather"
  priceUSD: 48,
  origUSD: 62,
  image: "images/products/filename-1.jpg",
  cdnImage: "images/products/filename-1.jpg",
  images: [
    "images/products/filename-1.jpg",
    "images/products/filename-2.jpg",
    "images/products/filename-3.jpg"
  ],
  rating: 4.6,
  reviews: 48,
  badge: "NEW",
  sizes: ["XS","S","M","L","XL","XXL"],
  colors: ["Black","Navy","Grey"],
  description: "Description text.",
  specs: {
    Material: "Fabric info",
    Sizes: "XS–XXL",
    MOQ: "50 pcs per style",
    "Lead Time": "15–20 working days",
    Customise: "Logo / Label / Colour / Packaging"
  },
  featured: true,
  bestseller: false,
  onSale: false
},
```

---

## 10. Next Session: Hosiery Expansion

### What the user wants
Expand the hosiery section with more products, images, and detail. Categories to focus on:
- Tights & leggings (women)
- Socks (men, women, unisex)
- Stockings (women)
- Compression wear

### Steps to take
1. Ask user to add images to a new folder (e.g. `images/hosiery-new/`) or review existing hosiery images in `imag