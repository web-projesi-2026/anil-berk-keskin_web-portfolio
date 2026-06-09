<?php
/* =============================================
   mesaj_gonder.php — PHPMailer + Gmail SMTP
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
$env = parse_ini_file(__DIR__ . '/../.env');

// PHPMailer — hosting dosya yöneticisinden yüklenecek
// composer yoksa manuel: https://github.com/PHPMailer/PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

// ── Gelen veriyi al ──────────────────────────
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

function temizle(string $deger): string {
    return htmlspecialchars(strip_tags(trim($deger)), ENT_QUOTES, 'UTF-8');
}

$ad     = temizle($input['ad']    ?? '');
$soyad  = temizle($input['soyad'] ?? '');
$email  = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$konu   = temizle($input['konu']  ?? '');
$mesaj  = temizle($input['mesaj'] ?? '');
$token  = temizle($input['tarayici_token'] ?? bin2hex(random_bytes(16)));

// ── Validasyon ───────────────────────────────
$hatalar = [];
if (strlen($ad)    < 2)  $hatalar[] = 'Ad en az 2 karakter olmalıdır.';
if (strlen($soyad) < 2)  $hatalar[] = 'Soyad en az 2 karakter olmalıdır.';
if (!$email)             $hatalar[] = 'Geçerli bir e-posta adresi girin.';
if (empty($konu))        $hatalar[] = 'Konu seçilmedi.';
if (strlen($mesaj) < 5)  $hatalar[] = 'Mesaj çok kısa.';

if ($hatalar) {
    http_response_code(422);
    echo json_encode(['basarili' => false, 'hatalar' => $hatalar]);
    exit;
}

// ── Veritabanına kaydet ──────────────────────
$conn = baglan();

$stmt = $conn->prepare(
    "INSERT INTO iletisim (ad, soyad, email, konu, mesaj, tarayici_token)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param('ssssss', $ad, $soyad, $email, $konu, $mesaj, $token);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['basarili' => false, 'hata' => 'Veritabanı hatası.']);
    $stmt->close(); $conn->close();
    exit;
}

$mesaj_id = $stmt->insert_id;

$tarih_stmt = $conn->prepare(
    "SELECT DATE_FORMAT(olusturma_tarihi, '%d.%m.%Y %H:%i') AS tarih FROM iletisim WHERE id = ?"
);
$tarih_stmt->bind_param('i', $mesaj_id);
$tarih_stmt->execute();
$tarih = $tarih_stmt->get_result()->fetch_assoc()['tarih'] ?? date('d.m.Y H:i');

$stmt->close();
$tarih_stmt->close();
$conn->close();

// ── PHPMailer ile Gmail SMTP ─────────────────
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $env['MAIL_USER'];
    $mail->Password   = $env['MAIL_PASS'];
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($env['MAIL_USER'], 'Portfolio Site');
    $mail->addAddress($env['MAIL_USER']);   // ← Mailin gelecek adres
    $mail->addReplyTo($email, "$ad $soyad");             // Yanıtla → gönderenin maili

    $mail->isHTML(true);
    $mail->Subject = "[Portfolio] $konu — $ad $soyad";
    $mail->Body    = "
    <div style='font-family:sans-serif;max-width:600px;margin:0 auto;'>
      <div style='background:#1a1612;padding:24px 32px;border-radius:8px 8px 0 0;'>
        <h2 style='color:#b5975a;margin:0;'>Anıl Berk Keskin</h2>
        <p style='color:#aaa;margin:4px 0 0;font-size:13px;'>Portfolyo — Yeni Mesaj</p>
      </div>
      <div style='border:1px solid #e5e5e5;border-top:none;padding:28px 32px;border-radius:0 0 8px 8px;'>
        <table style='width:100%;border-collapse:collapse;margin-bottom:20px;'>
          <tr><td style='padding:10px 0;color:#888;font-size:13px;width:100px;'>AD SOYAD</td>
              <td style='padding:10px 0;color:#222;font-weight:600;'>$ad $soyad</td></tr>
          <tr style='border-top:1px solid #f0f0f0;'>
              <td style='padding:10px 0;color:#888;font-size:13px;'>E-POSTA</td>
              <td style='padding:10px 0;'><a href='mailto:$email' style='color:#b5975a;'>$email</a></td></tr>
          <tr style='border-top:1px solid #f0f0f0;'>
              <td style='padding:10px 0;color:#888;font-size:13px;'>KONU</td>
              <td style='padding:10px 0;color:#222;'>$konu</td></tr>
        </table>
        <div style='background:#fafafa;border-left:3px solid #b5975a;padding:16px 20px;border-radius:4px;'>
          <p style='color:#888;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;'>MESAJ</p>
          <p style='color:#333;line-height:1.7;margin:0;'>$mesaj</p>
        </div>
        <div style='margin-top:24px;text-align:center;'>
          <a href='mailto:$email' style='background:#1a1612;color:#b5975a;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px;'>$email adresine yanıtla →</a>
        </div>
      </div>
    </div>";

    $mail->AltBody = "Gönderen: $ad $soyad\nE-posta: $email\nKonu: $konu\n\n$mesaj";

    $mail->send();

} catch (Exception $e) {
    // Mail gönderilemese bile DB kaydı tamam, yine başarılı dön
    error_log('PHPMailer Hatası: ' . $mail->ErrorInfo);
}

echo json_encode([
    'basarili'       => true,
    'mesaj_id'       => $mesaj_id,
    'tarih'          => $tarih,
    'tarayici_token' => $token
]);
