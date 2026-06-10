<?php
/* =============================================
   mesaj_sil.php
   POST { id, token } → mesajı DB'den siler
   Güvenlik: sadece token sahibi kendi mesajını silebilir
   ============================================= */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['basarili' => false, 'hata' => 'Sadece POST kabul edilir.']);
    exit;
}

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$id    = intval($input['id']    ?? 0);
$token = trim($input['token']   ?? '');

if ($id <= 0 || empty($token)) {
    http_response_code(400);
    echo json_encode(['basarili' => false, 'hata' => 'Geçersiz istek.']);
    exit;
}

$conn = baglan();

// Sadece token eşleşirse sil — başkasının mesajını silemez
$stmt = $conn->prepare("DELETE FROM iletisim WHERE id = ? AND tarayici_token = ?");
$stmt->bind_param('is', $id, $token);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    http_response_code(403);
    echo json_encode(['basarili' => false, 'hata' => 'Kayıt bulunamadı veya yetkiniz yok.']);
    $stmt->close(); $conn->close();
    exit;
}

$stmt->close();
$conn->close();

echo json_encode(['basarili' => true]);
