<?php
/* =============================================
   mesaj_guncelle.php
   POST { id, mesaj, token } → mesaj metnini günceller
   Güvenlik: sadece token sahibi kendi mesajını güncelleyebilir
   Not: Yanıt gelmiş mesajlar güncellenemez
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
$mesaj = trim($input['mesaj']   ?? '');
$token = trim($input['token']   ?? '');

if ($id <= 0 || strlen($mesaj) < 5 || empty($token)) {
    http_response_code(400);
    echo json_encode(['basarili' => false, 'hata' => 'Geçersiz istek.']);
    exit;
}

$mesaj = htmlspecialchars(strip_tags($mesaj), ENT_QUOTES, 'UTF-8');

$conn = baglan();

// Yanıt gelmişse güncellemeyi engelle
$kontrol = $conn->prepare("SELECT cevap FROM iletisim WHERE id = ? AND tarayici_token = ?");
$kontrol->bind_param('is', $id, $token);
$kontrol->execute();
$satir = $kontrol->get_result()->fetch_assoc();
$kontrol->close();

if (!$satir) {
    http_response_code(403);
    echo json_encode(['basarili' => false, 'hata' => 'Kayıt bulunamadı veya yetkiniz yok.']);
    $conn->close();
    exit;
}

if (!empty($satir['cevap'])) {
    http_response_code(403);
    echo json_encode(['basarili' => false, 'hata' => 'Yanıt gelen mesajlar düzenlenemez.']);
    $conn->close();
    exit;
}

// Güncelle
$stmt = $conn->prepare("UPDATE iletisim SET mesaj = ?, guncelleme_tarihi = NOW() WHERE id = ? AND tarayici_token = ?");
$stmt->bind_param('sis', $mesaj, $id, $token);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    http_response_code(403);
    echo json_encode(['basarili' => false, 'hata' => 'Güncelleme yapılamadı.']);
    $stmt->close(); $conn->close();
    exit;
}

$stmt->close();
$conn->close();

echo json_encode(['basarili' => true]);
