# Crime Shoppers — Shopify Theme

> "See Something? Buy Something!"

A fully custom dark-mode Shopify theme for Crime Shoppers, built to match the architecture of the **Horizon** theme. Features the Crime Shoppers design system: dark backgrounds, Bebas Neue headings, Inter body text, gold (#FFD700) accents, and crime-tape yellow/black stripe dividers.

### Horizon Compatibility Notes
- Uses **section groups** (`header-group`, `footer-group`) as Horizon requires — `layout/theme.liquid` calls `{% sections %}` (plural), not `{% section %}`.
- All Horizon color scheme classes (`.color-scheme-1` through `.color-scheme-5`) are overridden in `assets/crime-shoppers.css` so no section renders with a light palette.
- `config/settings_data.json` includes both flat and per-scheme color keys (`colors_scheme_1_*`) that Horizon reads.
- Horizon's native component classes (`.card`, `.button`, `.header`, `.price`, etc.) are all overridden to match the Crime Shoppers dark theme.

---

## Installation

### Option 1: Upload via Shopify Admin (Recommended)

1. Open a terminal in this directory and zip the **contents** of the `shopify/` folder:

   **Mac/Linux:**
   ```bash
   cd /path/to/crimeshoppers/shopify
   zip -r ../crime-shoppers-theme.zip .
   ```

   **Windows (PowerShell):**
   ```powershell
   cd C:\code\crimeshoppers\shopify
   Compress-Archive -Path .\* -DestinationPath ..\crime-shoppers-theme.zip
   ```

   > Important: Zip the **contents** of the folder, not the folder itself. The zip should contain `assets/`, `config/`, `layout/`, etc. at the root level — not a `shopify/` subfolder.

2. Log in to your Shopify Admin.

3. Go to **Online Store > Themes**.

4. Click **Add theme > Upload zip file**.

5. Select `crime-shoppers-theme.zip`.

6. Once uploaded, click **Customize** to preview, or **Publish** to make it live.

---

### Option 2: Shopify CLI (Developer)

If you have [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) installed:

```bash
cd C:\code\crimeshoppers\shopify
shopify theme push --store your-store.myshopify.com
```

---

## File Structure

```
shopify/
├── assets/
│   ├── crime-shoppers.css          Main design system CSS
│   ├── crime-shoppers.js           UI interactions (cart drawer, animations, filters)
│   └── crime-shoppers-theme.js     Shopify cart/product AJAX API
├── config/
│   ├── settings_schema.json        Theme settings definitions
│   └── settings_data.json          Pre-filled Crime Shoppers values
├── layout/
│   └── theme.liquid                Master layout (Google Fonts, head, body wrapper)
├── sections/
│   ├── header.liquid               Sticky dark navbar with logo + cart
│   ├── footer.liquid               4-column dark footer
│   ├── announcement-bar.liquid     Yellow top bar (free shipping etc.)
│   ├── cs-hero.liquid              Full hero ("SEE SOMETHING? BUY SOMETHING!")
│   ├── cs-featured-collection.liquid   Product grid section
│   ├── cs-features-grid.liquid     3-column USP feature cards
│   ├── cs-newsletter.liquid        Email signup section
│   └── cs-crime-tape.liquid        Yellow/black stripe divider
├── snippets/
│   ├── product-card.liquid         Dark product card with badge support
│   ├── cart-drawer.liquid          Slide-in cart sidebar
│   └── crime-tape-divider.liquid   Inline stripe divider
├── templates/
│   ├── index.json                  Homepage with all CS sections
│   ├── collection.json             Collection/shop page
│   ├── product.json                Product detail page
│   ├── cart.json                   Cart page
│   ├── page.about.json             About page
│   └── page.contact.json          Contact page
└── locales/
    └── en.default.json             All translatable strings
```

---

## Design System

| Token | Value |
|---|---|
| Background primary | `#0d0d0d` |
| Background secondary | `#1a1a1a` |
| Background card | `#222222` |
| Accent yellow | `#FFD700` |
| Accent red | `#CC0000` |
| Text primary | `#f0f0f0` |
| Text secondary | `#aaaaaa` |
| Text muted | `#666666` |
| Border | `#333333` |
| Font heading | Bebas Neue (Google Fonts) |
| Font body | Inter (Google Fonts) |
| Border radius sm/md/lg | 4px / 8px / 16px |

---

## Customising the Theme

### Via Shopify Theme Editor

After uploading, go to **Online Store > Themes > Customize** to:

- Edit all section content (hero text, stats, feature cards, newsletter text)
- Change colors in **Theme settings > Colors**
- Toggle the announcement bar on/off and edit its text
- Select which collection appears in the Featured Collection section
- Add/remove feature blocks in the features grid

### Adding a Navigation Menu

1. Go to **Online Store > Navigation**
2. Create or edit a menu called **"Main menu"** (handle: `main-menu`)
3. Add links: Home, Collections, About, Contact
4. The header will automatically pick it up

### Product Badges

Products automatically get badges based on tags:

- Tag `best-seller` (or `bestseller`) → gold "BEST SELLER" badge
- Tag `wanted` or `featured` → red "WANTED" ribbon

Add tags in **Products > [product] > Tags**.

---

## Dependencies

This theme loads these external resources:

- **Google Fonts** — Bebas Neue + Inter (loaded in `<head>` via `theme.liquid`)
- No other external JS libraries

---

## Browser Support

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- Mobile: iOS Safari 14+, Chrome Android 90+

---

## Support

For theme issues, contact: support@crimeshoppers.com
