# Web Aura Clothing

Web Aura Clothing is a responsive e-commerce storefront for a premium streetwear brand. It is built with plain HTML, CSS, and JavaScript, so it can run locally or deploy directly to GitHub Pages.

## Features

- Premium streetwear landing hero
- Product catalog with search, category filters, and sorting
- Product size selection
- Shopping cart drawer with quantity controls
- Demo coupon code: `AURA30`
- COD checkout call-to-action
- Fit guide section
- Newsletter signup interaction
- Fully responsive layout for desktop and mobile

## Project Files

```text
index.html   Main page structure
styles.css   Storefront styling and responsive layout
script.js    Products, filters, cart, coupon, and interactions
```

## Run Locally

From the project folder, start a simple local server:

```bash
python3 -m http.server 4174
```

Then open:

```text
http://127.0.0.1:4174
```

## Deploy With GitHub Pages

1. Push this project to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under **Build and deployment**, select `Deploy from a branch`.
5. Choose:
   - Branch: `main`
   - Folder: `/root`
6. Click `Save`.

Your live site will be available at:

```text
https://mohdaakib1.github.io/Web-Aura/
```

## Notes

This is a static demo storefront. For real orders and payments, connect it to a backend or platform such as Shopify, WooCommerce, Razorpay, or another checkout service.
