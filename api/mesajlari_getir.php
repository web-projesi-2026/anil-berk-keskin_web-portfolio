<?php
/* =============================================
   mesajlari_getir.php
   GET ?token=XXX  →  O token'a ait mesajları döner
   JSON döner: { basarili, mesajlar: [...] }
   ============================================= */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['basarili' => false, 'hata' => 'Sadece GET kabul edilir.']);
    exit;
}

$token = trim($_GET['token'] ?? '');

if (empty($token)) {
    echo json_encode(['basarili' => true, 'mesajlar' => []]);
    exit;
}

require_once 'db.php';
$conn = baglan();

$stmt = $conn->prepare("
    SELECT
        id,
        ad,
        soyad,
        email,
        konu,
        mesaj,
        cevap,
        DATE_FORMAT(olusturma_tarihi, '%d.%m.%Y %H:%i') AS tarih
    FROM iletisim
    WHERE tarayici_token = ?
    ORDER BY olusturma_tarihi DESC
    LIMIT 50
");
$stmt->bind_param('s', $token);
$stmt->execute();
$result = $stmt->get_result();

$mesajlar = [];
while ($row = $result->fetch_assoc()) {
    $mesajlar[] = [
        'id'    => (int)$row['id'],
        'ad'    => $row['ad'] . ' ' . $row['soyad'],
        'email' => $row['email'],
        'konu'  => $row['konu'],
        'mesaj' => $row['mesaj'],
        'cevap' => $row['cevap'],   // null veya string
        'tarih' => $row['tarih'],
    ];
}

$stmt->close();
$conn->close();

echo json_encode(['basarili' => true, 'mesajlar' => $mesajlar]);
