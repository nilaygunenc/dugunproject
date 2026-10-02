# ⚡ Hızlı Başlangıç Rehberi

## 🎯 5 Dakikada Çalıştır!

### 1️⃣ PostgreSQL Kurulumu (2 dakika)

**Windows:**
```
1. https://www.postgresql.org/download/windows/ adresinden indir
2. Kurulum sırasında şifre belirle (örn: "postgres123")
3. Port: 5432 (varsayılan)
```

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux:**
```bash
sudo apt install postgresql
sudo systemctl start postgresql
```

### 2️⃣ Veritabanı Oluştur (1 dakika)

**Yöntem 1: pgAdmin4 ile (Görsel)**
```
1. pgAdmin4'ü aç
2. Servers > PostgreSQL > Sağ tık > Create > Database
3. İsim: etkinlik_platform
4. Save
```

**Yöntem 2: Terminal ile**
```bash
psql -U postgres
CREATE DATABASE etkinlik_platform;
\q
```

### 3️⃣ Tabloları Oluştur (30 saniye)

pgAdmin4'te Query Tool'u aç ve şunu çalıştır:

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media_posts (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    message VARCHAR(255),
    media_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test verisi
INSERT INTO events (event_name, event_type, event_date) 
VALUES ('Test Etkinliği', 'Düğün', '2026-06-15');
```

### 4️⃣ Projeyi Yapılandır (1 dakika)

`.env.local` dosyasını düzenle:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=etkinlik_platform
DB_USER=postgres
DB_PASSWORD=BURAYA_ŞİFRENİZİ_YAZIN  # ⚠️ Önemli!
```

### 5️⃣ Çalıştır! (30 saniye)

```bash
npm run dev
```

Tarayıcıda aç:
```
http://localhost:3000/test-upload
```

## ✅ Kontrol Listesi

- [ ] PostgreSQL kuruldu
- [ ] `etkinlik_platform` veritabanı oluşturuldu
- [ ] 3 tablo oluşturuldu (events, guests, media_posts)
- [ ] `.env.local` dosyası düzenlendi
- [ ] `npm run dev` çalıştırıldı
- [ ] Test sayfası açıldı
- [ ] İlk fotoğraf yüklendi

## 🎨 Yeni Özellikler

### Fresh Tasarım
- 🌿 Doğa temalı renkler (Sage, Peach, Earth)
- ✨ Framer Motion animasyonları
- 📱 Mobil-öncelikli tasarım
- 🎭 Hover efektleri ve geçişler

### Teknik Yenilikler
- 🐘 PostgreSQL (Firebase yerine)
- 📁 Yerel dosya sistemi (Storage yerine)
- 🔗 İlişkisel veri modeli
- 🚀 Next.js 16 App Router
- 📊 SQL sorguları

## 🧪 Test Et

### 1. Fotoğraf Yükle
```
http://localhost:3000/test-upload
```
- İsim: "Test Kullanıcı"
- Mesaj: "Harika bir gün!"
- Fotoğraf seç ve yükle

### 2. Veritabanını Kontrol Et
```sql
-- pgAdmin4 veya psql ile
SELECT 
    mp.id,
    g.full_name,
    mp.message,
    mp.media_url,
    mp.created_at
FROM media_posts mp
JOIN guests g ON mp.guest_id = g.id
ORDER BY mp.created_at DESC;
```

### 3. Dosyayı Kontrol Et
```
public/uploads/ klasörüne bak
```

## 🐛 Sorun Giderme

### "password authentication failed"
```env
# .env.local dosyasındaki şifreyi kontrol et
DB_PASSWORD=dogru_sifre_buraya
```

### "database does not exist"
```bash
psql -U postgres
CREATE DATABASE etkinlik_platform;
```

### "relation does not exist"
```
Tabloları oluşturmayı unutmuş olabilirsin.
Yukarıdaki SQL komutlarını çalıştır.
```

### Port 3000 kullanımda
```bash
# Farklı port kullan
npm run dev -- -p 3001
```

## 📚 Detaylı Dokümantasyon

- **PostgreSQL Kurulum**: `POSTGRESQL_SETUP.md`
- **Firebase'den Geçiş**: `MIGRATION_TO_POSTGRESQL.md`
- **Teknik Detaylar**: `TECHNICAL_OVERVIEW.md`

## 🎯 Sonraki Adımlar

1. ✅ Temel kurulum tamamlandı
2. 🔲 Mevcut sayfaları güncelle
3. 🔲 Admin paneli ekle
4. 🔲 Etkinlik yönetimi UI
5. 🔲 Real-time updates
6. 🔲 Production'a deploy

## 💡 İpuçları

### Hızlı Geliştirme
```bash
# Veritabanını sıfırla
psql -U postgres -d etkinlik_platform
DROP TABLE media_posts, guests, events CASCADE;
# Sonra tabloları tekrar oluştur
```

### Örnek Veri Ekle
```sql
-- Birden fazla etkinlik
INSERT INTO events (event_name, event_type, event_date) VALUES
('Ayşe & Mehmet Düğünü', 'Düğün', '2026-06-15'),
('Zeynep''in Doğum Günü', 'Doğum Günü', '2026-07-20'),
('Elif & Can Nişanı', 'Nişan', '2026-08-10');

-- Örnek misafirler
INSERT INTO guests (event_id, full_name) VALUES
(1, 'Ahmet Yılmaz'),
(1, 'Fatma Demir'),
(2, 'Can Öztürk');
```

## 🚀 Production'a Hazırlık

### 1. Environment Variables
```env
# Production için
DATABASE_URL=postgresql://user:pass@host:5432/db
NODE_ENV=production
```

### 2. Güvenlik
- [ ] SQL injection koruması (✅ Zaten var - parameterized queries)
- [ ] File upload limitleri (✅ Zaten var - 10MB)
- [ ] Rate limiting ekle
- [ ] HTTPS kullan

### 3. Performans
- [ ] Database indexler (✅ Zaten var)
- [ ] Image optimization (✅ Zaten var - compression)
- [ ] CDN kullan
- [ ] Caching ekle

## 🎉 Tamamlandı!

Artık projeniz PostgreSQL ile çalışıyor! 

**Sorularınız için:**
- 📖 Dokümantasyonu okuyun
- 🐛 Issue açın
- 💬 Topluluktan yardım isteyin

---

💚 **Mutlu Kodlamalar!**
