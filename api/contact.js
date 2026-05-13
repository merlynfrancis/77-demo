/**
 * 77 Marine — Contact Form API Route
 * ----------------------------------------------------------------------
 * Vercel-style serverless function. Receives JSON POSTs from contact.html
 * and forwards the inquiry to info@sevensevenmarine.com over SMTP.
 *
 * Configure via environment variables (.env / Vercel project env):
 *
 *   SMTP_HOST         (e.g. smtp.titan.email, smtp.zoho.com, smtp.gmail.com)
 *   SMTP_PORT         (e.g. 465 for SSL, 587 for STARTTLS)
 *   SMTP_SECURE       ("true" for 465, "false" for 587)
 *   SMTP_USER         info@sevensevenmarine.com
 *   SMTP_PASS         <inbox password / app password>
 *   CONTACT_TO        info@sevensevenmarine.com
 *   CONTACT_FROM      "77 Marine Website <info@sevensevenmarine.com>"
 *   CONTACT_REPLY_TO  (optional override)
 *
 * No external dependency on a Vercel runtime — works on Node 18+
 * because it imports nodemailer directly. `npm install` once.
 */

// nodemailer is required lazily so the static dev server can boot
// even before `npm install` has been run.
let nodemailer = null;
function getNodemailer() {
  if (!nodemailer) nodemailer = require("nodemailer");
  return nodemailer;
}

const REQUIRED_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

function checkEnv() {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    return `Server is missing SMTP configuration: ${missing.join(", ")}`;
  }
  return null;
}

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") return resolve(req.body);
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  // CORS / preflight for safety
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
  }

  res.setHeader("Content-Type", "application/json");

  const envError = checkEnv();
  if (envError) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ ok: false, error: envError }));
  }

  let body;
  try {
    body = await parseBody(req);
  } catch (e) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ ok: false, error: "Invalid request body" }));
  }

  const name = (body.name || "").toString().trim();
  const email = (body.email || "").toString().trim();
  const phone = (body.phone || "").toString().trim();
  const boat = (body.boat || "").toString().trim();
  const service = (body.service || "").toString().trim();
  const message = (body.message || "").toString().trim();

  // Honeypot — bots fill this hidden field
  if (body.website && String(body.website).trim() !== "") {
    return res.end(JSON.stringify({ ok: true })); // silent success
  }

  if (!name || !phone || !isEmail(email)) {
    res.statusCode = 400;
    return res.end(
      JSON.stringify({
        ok: false,
        error: "Please provide your name, phone, and a valid email.",
      })
    );
  }

  if (name.length > 200 || message.length > 5000) {
    res.statusCode = 413;
    return res.end(
      JSON.stringify({ ok: false, error: "Submission exceeds size limit." })
    );
  }

  const to = process.env.CONTACT_TO || "info@sevensevenmarine.com";
  const from =
    process.env.CONTACT_FROM ||
    `77 Marine Website <${process.env.SMTP_USER}>`;
  const replyTo = process.env.CONTACT_REPLY_TO || email;

  const transporter = getNodemailer().createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = `New inquiry — ${name}${boat ? " (" + boat + ")" : ""}`;

  const text =
    `New project inquiry via 77 Marine website\n\n` +
    `Name:    ${name}\n` +
    `Email:   ${email}\n` +
    `Phone:   ${phone}\n` +
    `Boat:    ${boat || "—"}\n` +
    `Service: ${service || "—"}\n\n` +
    `Message:\n${message || "(no message)"}\n`;

  const html = `
    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;background:#f4f6fa;padding:24px;color:#0a1f3d;">
      <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;border:1px solid #e2e7ee;">
        <h2 style="margin:0 0 6px;font-family:'Fraunces',Georgia,serif;font-weight:600;color:#0a1f3d;">New Project Inquiry</h2>
        <p style="margin:0 0 24px;color:#4a5a72;font-size:14px;letter-spacing:.08em;text-transform:uppercase;">77 Marine — Contact Form</p>
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:8px 0;color:#4a5a72;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#4a5a72;">Email</td><td style="padding:8px 0;"><a style="color:#0a1f3d;" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#4a5a72;">Phone</td><td style="padding:8px 0;"><a style="color:#0a1f3d;" href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#4a5a72;">Boat Type</td><td style="padding:8px 0;">${escapeHtml(boat) || "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#4a5a72;">Interest</td><td style="padding:8px 0;">${escapeHtml(service) || "—"}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #e2e7ee;margin:24px 0;">
        <p style="margin:0 0 6px;color:#4a5a72;font-size:13px;letter-spacing:.08em;text-transform:uppercase;">Message</p>
        <p style="white-space:pre-wrap;line-height:1.6;color:#0a1f3d;margin:0;">${escapeHtml(message) || "(no message)"}</p>
      </div>
      <p style="text-align:center;font-size:12px;color:#90a0b8;margin-top:18px;">Delivered automatically from sevensevenmarine.com</p>
    </div>`;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo,
      subject,
      text,
      html,
    });
    return res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("[77-marine contact] sendMail failed:", err);
    res.statusCode = 502;
    return res.end(
      JSON.stringify({
        ok: false,
        error: "Mail server rejected the request. Please WhatsApp us instead.",
      })
    );
  }
};
