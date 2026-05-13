<?php
/**
 * 77 Marine — Contact form (PHP fallback)
 * ----------------------------------------------------------------------
 * Drop-in alternative to api/contact.js for hosts that don't run Node
 * (shared LAMP / cPanel). Accepts the same JSON payload from contact.html
 * and emails info@sevensevenmarine.com.
 *
 * Configuration (override via real environment variables or a local
 * /api/.env style require — keep credentials OUT of version control):
 *   CONTACT_TO         info@sevensevenmarine.com
 *   CONTACT_FROM       "77 Marine Website <info@sevensevenmarine.com>"
 *   SMTP_HOST          (optional — used if PHPMailer is installed)
 *   SMTP_PORT          (optional)
 *   SMTP_USER          (optional)
 *   SMTP_PASS          (optional)
 *   SMTP_SECURE        ssl | tls
 *
 * Behaviour:
 *   - If PHPMailer is available via Composer (vendor/autoload.php) AND
 *     SMTP_HOST is set, sends via authenticated SMTP (recommended).
 *   - Otherwise falls back to PHP's built-in mail() (works on most
 *     cPanel hosts; deliverability depends on the host's MTA config).
 *
 * Response: JSON { ok: true } on success, { ok: false, error: "…" } on failure.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . (getenv('CORS_ORIGIN') ?: '*'));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

/* Optionally load a local config file (gitignored) for credentials */
$config_path = __DIR__ . '/.contact-config.php';
if (file_exists($config_path)) {
    require_once $config_path; // expected to setenv() the SMTP_* values
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    /* Maybe a regular form post */
    $body = $_POST;
}

if (empty($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request body']);
    exit;
}

/* Honeypot — bots fill the hidden "website" field */
if (!empty(trim((string)($body['website'] ?? '')))) {
    echo json_encode(['ok' => true]); // silent success
    exit;
}

$name    = trim((string)($body['name']    ?? ''));
$email   = trim((string)($body['email']   ?? ''));
$phone   = trim((string)($body['phone']   ?? ''));
$boat    = trim((string)($body['boat']    ?? ''));
$service = trim((string)($body['service'] ?? ''));
$message = trim((string)($body['message'] ?? ''));

if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'ok'    => false,
        'error' => 'Please provide your name, phone, and a valid email.',
    ]);
    exit;
}

if (strlen($name) > 200 || strlen($message) > 5000) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'Submission exceeds size limit.']);
    exit;
}

$to   = getenv('CONTACT_TO')   ?: 'info@sevensevenmarine.com';
$from = getenv('CONTACT_FROM') ?: '77 Marine Website <info@sevensevenmarine.com>';

$subject = 'New inquiry — ' . $name . ($boat !== '' ? ' (' . $boat . ')' : '');

$lines = [
    'New project inquiry via 77 Marine website',
    '',
    'Name:    ' . $name,
    'Email:   ' . $email,
    'Phone:   ' . $phone,
    'Boat:    ' . ($boat !== '' ? $boat : '—'),
    'Service: ' . ($service !== '' ? $service : '—'),
    '',
    'Message:',
    $message !== '' ? $message : '(no message)',
];
$text = implode("\n", $lines);

function esc_html_77($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

$html = '<div style="font-family:Plus Jakarta Sans,Arial,sans-serif;background:#f4f6fa;padding:24px;color:#0a1f3d;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;border:1px solid #e2e7ee;">
    <h2 style="margin:0 0 6px;font-family:Fraunces,Georgia,serif;font-weight:600;color:#0a1f3d;">New Project Inquiry</h2>
    <p style="margin:0 0 24px;color:#4a5a72;font-size:14px;letter-spacing:.08em;text-transform:uppercase;">77 Marine — Contact Form</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr><td style="padding:8px 0;color:#4a5a72;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">' . esc_html_77($name) . '</td></tr>
      <tr><td style="padding:8px 0;color:#4a5a72;">Email</td><td style="padding:8px 0;"><a style="color:#0a1f3d;" href="mailto:' . esc_html_77($email) . '">' . esc_html_77($email) . '</a></td></tr>
      <tr><td style="padding:8px 0;color:#4a5a72;">Phone</td><td style="padding:8px 0;"><a style="color:#0a1f3d;" href="tel:' . esc_html_77($phone) . '">' . esc_html_77($phone) . '</a></td></tr>
      <tr><td style="padding:8px 0;color:#4a5a72;">Boat Type</td><td style="padding:8px 0;">' . esc_html_77($boat !== '' ? $boat : '—') . '</td></tr>
      <tr><td style="padding:8px 0;color:#4a5a72;">Interest</td><td style="padding:8px 0;">' . esc_html_77($service !== '' ? $service : '—') . '</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #e2e7ee;margin:24px 0;">
    <p style="margin:0 0 6px;color:#4a5a72;font-size:13px;letter-spacing:.08em;text-transform:uppercase;">Message</p>
    <p style="white-space:pre-wrap;line-height:1.6;color:#0a1f3d;margin:0;">' . esc_html_77($message !== '' ? $message : '(no message)') . '</p>
  </div>
  <p style="text-align:center;font-size:12px;color:#90a0b8;margin-top:18px;">Delivered automatically from sevensevenmarine.com</p>
</div>';

/* ----------------------------------------------------------------------
 * Try PHPMailer (if installed via Composer) with SMTP credentials.
 * If not available or not configured, fall back to mail().
 * -------------------------------------------------------------------- */
$smtp_host = getenv('SMTP_HOST');
$autoload  = __DIR__ . '/../vendor/autoload.php';
$sent      = false;

if ($smtp_host && file_exists($autoload)) {
    require_once $autoload;
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = $smtp_host;
            $mail->SMTPAuth   = true;
            $mail->Username   = getenv('SMTP_USER');
            $mail->Password   = getenv('SMTP_PASS');
            $mail->SMTPSecure = (getenv('SMTP_SECURE') ?: 'ssl');
            $mail->Port       = (int)(getenv('SMTP_PORT') ?: 465);
            $mail->CharSet    = 'UTF-8';

            /* Parse "Name <email@host>" or fall back to plain email */
            if (preg_match('/^\s*(.*?)\s*<(.+)>\s*$/', $from, $m)) {
                $mail->setFrom($m[2], $m[1]);
            } else {
                $mail->setFrom($from);
            }
            $mail->addAddress($to);
            $mail->addReplyTo($email, $name);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $html;
            $mail->AltBody = $text;
            $mail->send();
            $sent = true;
        } catch (Throwable $e) {
            error_log('[77-marine contact PHP] PHPMailer failed: ' . $e->getMessage());
        }
    }
}

if (!$sent) {
    /* mail() fallback. Most cPanel hosts route to a working MTA. */
    $headers = [];
    $headers[] = 'From: ' . $from;
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'X-Mailer: 77-marine-contact/1.0';

    $sent = @mail($to, $subject, $html, implode("\r\n", $headers));
}

if (!$sent) {
    http_response_code(502);
    echo json_encode([
        'ok'    => false,
        'error' => 'Mail server rejected the request. Please WhatsApp us at +971 52 292 7079.',
    ]);
    exit;
}

echo json_encode(['ok' => true]);
