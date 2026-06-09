<?php
/* =============================================
   db.php — Veritabanı bağlantı ayarları
   Hassas bilgiler .env dosyasından okunur.
   ============================================= */

$env = parse_ini_file(__DIR__ . '/../.env');

define('DB_HOST', $env['DB_HOST'] ?? 'localhost');
define('DB_USER', $env['DB_USER'] ?? '');
define('DB_PASS', $env['DB_PASS'] ?? '');
define('DB_NAME', $env['DB_NAME'] ?? '');

function baglan(): mysqli {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['basarili' => false, 'hata' => 'Veritabanına bağlanılamadı.']);
        exit;
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}
