<?php
require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$recaptcha_secret = $_ENV['RECAPTCHA_SECRET'] ?? null;
if (!$recaptcha_secret) {
  error_log('[send.php] Missing RECAPTCHA_SECRET from .env');
  http_response_code(500);
  exit('Server configuration error.');
}

// Σαν παράδειγμα: δέχεται το POST από τη φόρμα
$name    = htmlspecialchars(strip_tags($_POST['name']    ?? ''));
$company = htmlspecialchars(strip_tags($_POST['company'] ?? ''));
$email   = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$message = htmlspecialchars(strip_tags($_POST['message'] ?? ''));
$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

if (!$name || !$email || !$message || !$recaptcha_response) {
  die("Please complete all required fields and CAPTCHA.");
}

// ReCAPTCHA verification
$ch = curl_init();
curl_setopt_array($ch, [
  CURLOPT_URL            => 'https://www.google.com/recaptcha/api/siteverify',
  CURLOPT_POST           => true,
  CURLOPT_POSTFIELDS     => http_build_query([
    'secret'   => $recaptcha_secret,
    'response' => $recaptcha_response
  ]),
  CURLOPT_RETURNTRANSFER => true,
]);
$verify = curl_exec($ch);
curl_close($ch);
$response_data = json_decode($verify);
if (empty($response_data->success)) {
  die("reCAPTCHA verification failed. Please try again.");
}

// Prepare email
$to      = "ergo@rentron.gr";
$subject = "New Contact Form Submission";
$headers = "From: $email\r\n"
         . "Reply-To: $email\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

$body  = "Name:    $name\n";
$body .= "Company: $company\n";
$body .= "Email:   $email\n\n";
$body .= "Message:\n$message";

$lang = $_POST['lang'] ?? 'en'; // default to English

if (mail($to, $subject, $body, $headers)) {
  echo $lang === 'el'
    ? "Το μήνυμά σας στάλθηκε με επιτυχία!"
    : "Message sent successfully!";
} else {
  echo $lang === 'el'
    ? "Αποτυχία αποστολής μηνύματος."
    : "Message delivery failed.";
}

