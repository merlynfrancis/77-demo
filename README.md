# 77 Marine — UAE Marine Engineering & Manufacturing Website

Production-ready marketing site for **77 Marine** (Seven Seven Marine).
Static front-end with two interchangeable contact-form back-ends — Node
or PHP — so it works on any host.

- **Brand:** 77 Marine · 7 Seas · 7 Emirates
- **Contact:** info@sevensevenmarine.com · +971 52 292 7079

---

## What's new in this build

- **29 real fleet photos** integrated across the site — homepage gallery,
  manufacturing workshop section, model cards, project case studies,
  maintenance, services, about.
- **Eight boat models renamed** with Arabic-rooted Gulf heritage names:
  Shaheen, Saqr, Lulu, Dabran, Sanbooq, Baggara, Bahar, Bateel — each
  with Arabic glyph, English class, and a one-line meaning on its card.
- **Navbar** sits flush to the screen edges (no more inline padding),
  with extra breathing room between links.
- **Client ribbon** is significantly bigger and bolder — logos roughly
  40% larger, more vertical space, wider gaps.
- **Contact form** pre-fills boat type and message when a visitor clicks
  "Request Specs" from a model card (passes `?model=...`), validates
  inputs, and tries `/api/contact` (Node) then `/api/contact.php` (PHP).
- **Two working back-ends** for the contact form so you can ship on
  Vercel, on cPanel/LAMP shared hosting, or anywhere in between.

---

## Quick start (local dev with Node)

```bash
# 1. install dependencies (just nodemailer)
npm install

# 2. configure email
cp .env.example .env
# edit .env and fill in SMTP_HOST / SMTP_USER / SMTP_PASS

# 3. run
node server.js
# -> http://localhost:3000
```

The dev server serves the static site **and** wires `POST /api/contact`
to `api/contact.js` — submitting the contact form sends a real email
when `.env` is configured.

---

## Deployment options

### Option A — Vercel (recommended, free tier works)

1. Push this folder to a GitHub repo.
2. Import the repo in Vercel.
3. Add Environment Variables in the Vercel project settings:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
   - `CONTACT_TO`, `CONTACT_FROM` (optional)
4. Deploy. `vercel.json` already declares `api/contact.js` as a
   Node 20 serverless function.

### Option B — Shared hosting (cPanel / LAMP)

1. Upload the entire folder to your hosting (typically `public_html/`).
2. The PHP fallback `api/contact.php` handles form submissions using
   either PHPMailer (if installed via Composer) or PHP's built-in
   `mail()` (works on most cPanel hosts).
3. If you want authenticated SMTP (recommended for deliverability),
   install PHPMailer:
   ```bash
   composer require phpmailer/phpmailer
   ```
   And set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`,
   `SMTP_SECURE` as real environment variables (cPanel: Software →
   "MultiPHP INI Editor" or your provider's env-var UI) — or create
   `api/.contact-config.php` with `putenv("SMTP_HOST=...")` calls.

### Option C — Static only (no contact form)

Drop everything into any static host (Cloudflare Pages, Netlify,
S3 + CloudFront, etc.). The form will silently fail — but the WhatsApp
button at the top of every page still works.

---

## File layout

```
├── index.html              homepage with hero + fleet gallery
├── about.html              About 77 Marine
├── manufacturing.html      Manufacturing + in-workshop gallery
├── models.html             Boat models filter grid (8 models)
├── services.html           All services
├── maintenance.html        Maintenance programs
├── projects.html           Case studies + ribbon
├── seven-seas.html         77 Philosophy
├── contact.html            Contact form (?model=... pre-fills)
├── 404.html
│
├── api/
│   ├── contact.js          Node serverless function (nodemailer)
│   └── contact.php         PHP fallback (PHPMailer or mail())
│
├── assets/
│   ├── images/boats/       29 processed fleet photos
│   ├── logos/              77 Marine logo lockups
│   └── logos/clients/      Government / industry client logos for ribbon
│
├── css/
│   ├── themes.css          Three colour themes (ocean / steel / gulf)
│   ├── styles.css          Tokens, typography, components
│   └── responsive.css      Breakpoints
│
├── js/
│   ├── data.js             All editable content (models, services, etc.)
│   ├── theme.js            Theme switcher
│   ├── main.js             Header, nav, ribbon
│   ├── models.js           Model card rendering + filter
│   ├── animations.js       Scroll-reveal observer
│   └── hero-canvas.js      Animated wave background on hero
│
├── server.js               Zero-dependency Node dev server
├── package.json            npm dependencies
├── vercel.json             Vercel deployment config
├── .env.example            Template for SMTP config
├── robots.txt
└── sitemap.xml
```

---

## Editing content

All text and images are in `js/data.js` and the HTML files. No build
step. Edit, save, refresh.

To swap a boat image: drop a new file in `assets/images/boats/` and
update the `image:` field for that model in `js/data.js`.

To change the model name, Arabic glyph, meaning, or spec: edit the
matching entry in `window.KHA.models` inside `js/data.js`.

---

## License / credits

- Site code: © 77 Marine
- Fonts: Fraunces, Plus Jakarta Sans, JetBrains Mono (all Google Fonts,
  SIL Open Font License)
- Fleet photography: provided by 77 Marine
