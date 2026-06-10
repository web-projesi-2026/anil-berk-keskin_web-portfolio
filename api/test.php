<?php
header('Content-Type: application/json; charset=utf-8');

$sonuc = [];

// 1. PHPMailer dosyaları var mı?
$sonuc['phpmailer_exception'] = file_exists(__DIR__ . '/PHPMailer/src/Exception.php');
$sonuc['phpmailer_core']      = file_exists(__DIR__ . '/PHPMailer/src/PHPMailer.php');
$sonuc['phpmailer_smtp']      = file_exists(__DIR__ . '/PHPMailer/src/SMTP.php');

// 2. db.php var mı?
$sonuc['db_php'] = file_exists(__DIR__ . '/db.php');

// 3. PHP versiyonu
$sonuc['php_version'] = PHP_VERSION;

// 4. mail() fonksiyonu aktif mi?
$sonuc['mail_func'] = function_exists('mail');

echo json_encode($sonuc, JSON_PRETTY_PRINT);
