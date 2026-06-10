👨‍💻 Anıl Berk Keskin — Kişisel Portfolyo
Kırşehir Ahi Evran Üniversitesi Bilgisayar Programcılığı bölümü öğrencisi olarak geliştirdiğim, projelerimi ve yetkinliklerimi sergilediğim kişisel web sitemdir.
🔗 Siteye Git: https://web-projesi-2026.github.io/anil-berk-keskin_web-portfolio/
---
🗺️ Site Haritası
Sayfa	İçerik
`index.html`	Ana sayfa ve kısa özet
`pages/about.html`	Yazılım yolculuğum, hedeflerim, becerilerim ve eğitimim
`pages/Projects.html`	Geliştirdiğim web ve sistem analizi projeleri
`pages/contact.html`	Bana ulaşabileceğiniz iletişim formu ve sosyal medya hesapları
---
⌨️ Teknoloji Yığını
Araç / Dil	Rolü
HTML5	Sayfaların temel iskeleti
CSS3	Görsel tasarım ve mobil uyumluluk
Vanilla JavaScript	Dinamik etkileşimler ve istemci tarafı mantık
PHP 8	Sunucu tarafı API katmanı
MySQL	İletişim formu mesajlarının saklanması
PHPMailer	Gmail SMTP üzerinden otomatik e-posta bildirimi
Git & GitHub	Versiyon kontrolü
---
🌟 Özellikler
🃏 Dinamik Proje Kartları
Projeler sabit HTML yerine `assets/data/projects.json` dosyasından JavaScript ile dinamik olarak oluşturulur. Her kart; başlık, açıklama, teknoloji etiketleri ve çoklu görsel içerir. Yeni proje eklemek için yalnızca JSON dosyasını düzenlemek yeterlidir.
📋 İnceleme Listesi
Her proje kartında "İnceleme Listesine Al" butonu bulunur. Seçilen projeler `localStorage` ile tarayıcıya kaydedilir; sayfa yenilendiğinde kaybolmaz. Liste sayfanın alt kısmında ayrıca listelenir, istenmeyen projeler kaldırılabilir.
🖼️ Otomatik Görsel Slider
Her proje kartı ve modal penceresinde kendi slider'ı bulunur. Görseller otomatik ilerler; önceki/sonraki butonlarıyla veya nokta göstergeleriyle manuel geçiş de yapılabilir.
🗄️ PHP + MySQL Mesaj Yönetimi
İletişim formundan gelen mesajlar veritabanına kaydedilir. API katmanı şu uç noktalardan oluşur:
Dosya	Görev
`api/mesaj\_gonder.php`	Formu alır, veritabanına kaydeder, e-posta gönderir
`api/mesajlari\_getir.php`	Kayıtlı mesajları listeler
`api/mesaj\_guncelle.php`	Mesaj durumunu günceller
`api/mesaj\_sil.php`	Mesajı siler
Tüm sorgular prepared statement kullanır; SQL injection'a karşı korumalıdır.
📧 PHPMailer ile E-posta Bildirimi
Ziyaretçi formu gönderdiğinde PHPMailer, Gmail SMTP üzerinden otomatik bildirim e-postası iletir. SMTP kimlik bilgileri `.env` dosyasında tutulur; kaynak kodda yer almaz.
🌙 Dark / Light Mod
Tüm sayfalarda kullanıcı tercihini `localStorage`'a kaydeden tema geçişi mevcuttur. Sayfa yenilendiğinde son tercih hatırlanır.
📱 Tam Responsive Tasarım
`responsive.css` ile mobil, tablet ve masaüstü için ayrı kırılma noktaları tanımlanmıştır. Navigasyon, kartlar ve modaller tüm ekran boyutlarında düzgün görüntülenir.
---
📂 Klasör Dizini
```text
anil-berk-keskin\_web-portfolio/
│
├── index.html                  # Ana sayfa
│
├── pages/
│   ├── about.html              # Hakkımda \& Beceriler
│   ├── Projects.html           # Projeler
│   └── contact.html            # İletişim
│
├── assets/
│   ├── css/
│   │   ├── global.css          # Ortak stiller
│   │   ├── style.css           # Ana sayfa
│   │   ├── about.css           # Hakkımda sayfası
│   │   ├── projects.css        # Projeler sayfası
│   │   ├── contact.css         # İletişim sayfası
│   │   └── responsive.css      # Mobil \& tablet uyumu
│   ├── js/
│   │   └── main.js             # Tüm JavaScript mantığı
│   ├── data/
│   │   └── projects.json       # Proje verileri (dinamik yükleme)
│   └── favicon.svg
│
├── api/
│   ├── db.php                  # Veritabanı bağlantısı (.env'den okur)
│   ├── mesaj\_gonder.php        # Form + e-posta bildirimi
│   ├── mesajlari\_getir.php     # Mesaj listeleme
│   ├── mesaj\_guncelle.php      # Durum güncelleme
│   ├── mesaj\_sil.php           # Mesaj silme
│   └── PHPMailer/              # PHPMailer kütüphanesi
│
├── images/                     # Proje görselleri
│
├── .env.example                # Ortam değişkenleri şablonu
├── .gitignore
└── README.md
```
---
⚙️ Kurulum
Repoyu klonla:
```bash
git clone https://github.com/web-projesi-2026/anil-berk-keskin\_web-portfolio.git
```
`.env.example` dosyasını kopyalayıp düzenle:
```bash
cp .env.example .env
```
`.env` içini kendi bilgilerinle doldur:
```
DB\_HOST=localhost
DB\_USER=kullanici\_adin
DB\_PASS=sifren
DB\_NAME=veritabani\_adin

MAIL\_USER=gmail\_adresin@gmail.com
MAIL\_PASS=gmail\_uygulama\_sifren
```
Veritabanında `mesajlar` tablosunu oluştur:
```sql
CREATE TABLE mesajlar (
    id INT AUTO\_INCREMENT PRIMARY KEY,
    ad VARCHAR(100),
    email VARCHAR(150),
    mesaj TEXT,
    durum VARCHAR(20) DEFAULT 'okunmadi',
    tarih TIMESTAMP DEFAULT CURRENT\_TIMESTAMP
);
```
Projeyi sunucunun kök dizinine kopyala ve tarayıcıdan aç.
> `.env` dosyası `.gitignore` ile versiyon kontrolünden hariç tutulmuştur; kimlik bilgileri repoya girmez.
---
📌 Bana Ulaşın
Ağ	Bağlantı
GitHub	github.com/AnilBerkKeskin
