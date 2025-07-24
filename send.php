<?php
// CONFIG
$recaptcha_secret = "YOUR_SECRET_KEY_HERE";

// Sanitize inputs
$name = htmlspecialchars(strip_tags($_POST['name'] ?? ''));
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$message = htmlspecialchars(strip_tags($_POST['message'] ?? ''));
$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

// Validate inputs
if (!$name || !$email || !$message) {
  die("Please complete all required fields.");
}

// Verify reCAPTCHA
$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}");
$response_data = json_decode($verify);
if (!$response_data->success) {
  die("reCAPTCHA verification failed. Please try again.");
}

// Prepare email
$to = "info@rentron.gr";
$subject = "New Contact Form Submission";
$headers = "From: " . $email . "\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "Content-Type: text/plain; charset=UTF-8";
$body = "Name: $name\nEmail: $email\nMessage:\n$message";

// Send email
if (mail($to, $subject, $body, $headers)) {
  echo "Message sent successfully!";
} else {
  echo "Message delivery failed.";
}
?>