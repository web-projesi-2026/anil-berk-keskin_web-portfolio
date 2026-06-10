# Anil Berk Keskin - Kisisel Portfolyo

Kirsehir Ahi Evran Universitesi Bilgisayar Programciligi bolumu ogrencisi olarak gelistirdigim, projelerimi ve yetkinliklerimi sergiledigim kisisel web sitemdir.

**Siteye Git:** https://web-projesi-2026.github.io/anil-berk-keskin_web-portfolio/

---

## Site Haritasi

| Sayfa | Icerik |
|-------|--------|
| `index.html` | Ana sayfa ve kisa ozet |
| `pages/about.html` | Yazilim yolculugum, hedeflerim, becerilerim ve egitimim |
| `pages/Projects.html` | Gelistirdigim web ve sistem analizi projeleri |
| `pages/contact.html` | Bana ulasabileceginiz iletisim formu ve sosyal medya hesaplari |

---

## Teknoloji Yigini

| Arac / Dil | Rolu |
|------------|------|
| HTML5 | Sayfalarin temel iskeleti |
| CSS3 | Gorsel tasarim ve mobil uyumluluk |
| Vanilla JavaScript | Dinamik etkilesimler ve istemci tarafi mantik |
| PHP 8 | Sunucu tarafi API katmani |
| MySQL | Iletisim formu mesajlarinin saklanmasi |
| PHPMailer | Gmail SMTP uzerinden otomatik e-posta bildirimi |
| Git & GitHub | Versiyon kontrolu |

---

## Ozellikler

### Dinamik Proje Kartlari

Projeler sabit HTML yerine `assets/data/projects.json` dosyasindan JavaScript ile dinamik olarak olusturulur. Her kart; baslik, aciklama, teknoloji etiketleri ve coklu gorsel icerir. Yeni proje eklemek icin yalnizca JSON dosyasini duzenlemek yeterlidir.

### Inceleme Listesi

Her proje kartinda **Inceleme Listesine Al** butonu bulunur. Secilen projeler `localStorage` ile tarayiciya kaydedilir; sayfa yenilendiginde kaybolmaz. Liste sayfanin alt kisminda ayrica listelenir, istenmeyen projeler kaldirilabilir.

### Otomatik Gorsel Slider

Her proje karti ve modal penceresinde kendi slideri bulunur. Gorseller otomatik ilerler; onceki/sonraki butonlariyla veya nokta gostergeleriyle manuel gecis de yapilabilir.

### PHP + MySQL Mesaj Yonetimi

Iletisim formundan gelen mesajlar veritabanina kaydedilir. API katmani su uc noktalardan olusur:

| Dosya | Gorev |
|-------|-------|
| `api/mesaj_gonder.php` | Formu alir, veritabanina kaydeder, e-posta gonderir |
| `api/mesajlari_getir.php` | Kayitli mesajlari listeler |
| `api/mesaj_guncelle.php` | Mesaj durumunu gunceller |
| `api/mesaj_sil.php` | Mesaji siler |

Tum sorgular prepared statement kullanir; SQL injection'a karsi korumalidir.

### PHPMailer ile E-posta Bildirimi

Ziyaretci formu gonderdiginde PHPMailer, Gmail SMTP uzerinden otomatik bildirim e-postasi iletir. SMTP kimlik bilgileri `.env` dosyasinda tutulur; kaynak kodda yer almaz.

### Dark / Light Mod

Tum sayfalarda kullanici tercihini `localStorage`'a kaydeden tema gecisi mevcuttur. Sayfa yenilendiginde son tercih hatirlanir.

### Tam Responsive Tasarim

`responsive.css` ile mobil, tablet ve masaustu icin ayri kirilma noktalari tanimlanmistir. Navigasyon, kartlar ve modaller tum ekran boyutlarinda duzgun goruntuler.

---

## Klasor Dizini

```
anil-berk-keskin_web-portfolio/
|
+-- index.html
|
+-- pages/
|   +-- about.html
|   +-- Projects.html
|   +-- contact.html
|
+-- assets/
|   +-- css/
|   |   +-- global.css
|   |   +-- style.css
|   |   +-- about.css
|   |   +-- projects.css
|   |   +-- contact.css
|   |   +-- responsive.css
|   +-- js/
|   |   +-- main.js
|   +-- data/
|   |   +-- projects.json
|   +-- favicon.svg
|
+-- api/
|   +-- db.php
|   +-- mesaj_gonder.php
|   +-- mesajlari_getir.php
|   +-- mesaj_guncelle.php
|   +-- mesaj_sil.php
|   +-- PHPMailer/
|
+-- images/
+-- .env.example
+-- .gitignore
+-- README.md
```

---

## Kurulum

1. Repoyu klonla:

```
git clone https://github.com/web-projesi-2026/anil-berk-keskin_web-portfolio.git
```

2. `.env.example` dosyasini kopyalayip duzenle:

```
cp .env.example .env
```

3. `.env` icini kendi bilgilerinle doldur:

```
DB_HOST=localhost
DB_USER=kullanici_adin
DB_PASS=sifren
DB_NAME=veritabani_adin

MAIL_USER=gmail_adresin@gmail.com
MAIL_PASS=gmail_uygulama_sifren
```

4. Veritabaninda mesajlar tablosunu olustur:

```sql
CREATE TABLE mesajlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100),
    email VARCHAR(150),
    mesaj TEXT,
    durum VARCHAR(20) DEFAULT 'okunmadi',
    tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. Projeyi sunucunun kok dizinine kopyala ve tarayicidan ac.

> `.env` dosyasi `.gitignore` ile versiyon kontrolunden haric tutulmustur; kimlik bilgileri repoya girmez.

---

## Bana Ulasin

| Ag | Baglanti |
|----|----------|
| GitHub | https://github.com/AnilBerkKeskin |
