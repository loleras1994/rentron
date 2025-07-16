<?php
// Ρυθμίσεις
$to = "alexandris.alex@hotmail.com";  // βάλε εδώ το δικό σου email
$subject = "Νέο μήνυμα από τη φόρμα επικοινωνίας Rentron.gr";

// Παραλαβή δεδομένων
$name = htmlspecialchars($_POST["name"]);
$company = htmlspecialchars($_POST["company"]);
$email = htmlspecialchars($_POST["email"]);
$message = htmlspecialchars($_POST["message"]);

// Δημιουργία σώματος email
$body = "Ονοματεπώνυμο: $name\n";
$body .= "Εταιρεία: $company\n";
$body .= "Email: $email\n\n";
$body .= "Μήνυμα:\n$message";

// Headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Αποστολή email
if (mail($to, $subject, $body, $headers)) {
    echo "<h2>Το μήνυμά σας στάλθηκε με επιτυχία.</h2>";
} else {
    echo "<h2>Σφάλμα κατά την αποστολή. Παρακαλώ δοκιμάστε ξανά.</h2>";
}
?>
