# 🐘 PostgreSQL Kurulum ve Yapılandırma Rehberi

## 📋 İçindekiler
1. [PostgreSQL Kurulumu](#postgresql-kurulumu)
2. [pgAdmin4 Kurulumu](#pgadmin4-kurulumu)
3. [Veritabanı Oluşturma](#veritabanı-oluşturma)
4. [Tabloları Oluşturma](#tabloları-oluşturma)
5. [Proje Bağlantısı](#proje-bağlantısı)

---

## 1. PostgreSQL Kurulumu

### Windows İçin:
1. [PostgreSQL İndirme Sayfası](https://www.postgresql.org/download/windows/)
2. En son sürümü indirin (örn: PostgreSQL 16)
3. Kurulum sırasında:
   - **Port**: 5432 (varsayılan)
   - **Superuser şifresi**: Güçlü bir şifre belirleyin (bunu hatırlayın!)
   - **Locale**: Turkish, Turkey (veya English, United States)

### macOS İçin:
```bash
# Homebrew ile
brew install postgresql@16
brew services start postgresql@16
```

### Linux (Ubuntu/Debian) İçin:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 2. pgAdmin4 Kurulumu

### Windows/macOS:
1. [pgAdmin İndirme Sayfası](https://www.pgadmin.org/download/)
2. İşletim sisteminize uygun sürümü indirin ve kurun

### Linux:
```bash
# Ubuntu/Debian
sudo apt install pgadmin4
```

---

## 3. Veritabanı Oluşturma

### Yöntem 1: pgAdmin4 ile (Görsel)

1. **pgAdmin4'ü açın**
2. Sol panelde **Servers > PostgreSQL 16** üzerine sağ tıklayın
3. **Create > Database** seçin
4. **Database** adını girin: `etkinlik_platform`
5. **Owner**: `postgres` (varsayılan)
6. **Save** butonuna tıklayın

### Yöntem 2: Terminal/CMD ile

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE psql -U postgres;

# Çıkış
\q
```

---

## 4. Tabloları Oluşturma

### pgAdmin4 ile:

1. **pgAdmin4'te** `etkinlik_platform` veritabanını seçin
2. Üst menüden **Tools > Query Tool** açın
3. Aşağıdaki SQL kodunu yapıştırın ve **Execute** (F5) tuşuna basın:

```sql
-- ==================== ETKİNLİKLER TABLOSU ====================
-- Düğün, Doğum Günü, Nişan vb. organizasyonlar
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- 'Düğün', 'Doğum Günü', 'Nişan', 'Kına', 'Sünnet'
    event_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== MİSAFİRLER TABLOSU ====================
-- Sisteme giren her kişi buraya kaydedilir
CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== MEDYA VE MESAJLAR TABLOSU ====================
-- Kişilerin yüklediği fotoğraflar ve mesajlar
CREATE TABLE media_posts (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    message VARCHAR(255),
    media_url TEXT NOT NULL, -- Fotoğrafın sunucudaki yolu (Örn: /uploads/foto1.jpg)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== İNDEKSLER (Performans İçin) ====================
CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_media_event_id ON media_posts(event_id);
CREATE INDEX idx_media_guest_id ON media_posts(guest_id);
CREATE INDEX idx_media_created_at ON media_posts(created_at DESC);

-- ==================== TEST VERİSİ (İsteğe Bağlı) ====================
-- Örnek bir etkinlik oluştur
INSERT INTO events (event_name, event_type, event_date) 
VALUES ('Ayşe & Mehmet Düğünü', 'Düğün', '2026-06-15');

-- Örnek misafir ekle
INSERT INTO guests (event_id, full_name) 
VALUES (1, 'Test Kullanıcı');

-- Örnek medya ekle (gerçek bir fotoğraf yükledikten sonra)
-- INSERT INTO media_posts (event_id, guest_id, media_url, message) 
-- VALUES (1, 1, '/uploads/test.jpg', 'Harika bir gün!');
```

### Terminal ile:

```bash
# PostgreSQL'e bağlan
psql -U postgres -d etkinlik_platform

# SQL dosyasını çalıştır (eğer bir dosyaya kaydettiyseniz)
\i /path/to/create_tables.sql

# Veya direkt SQL komutlarını yapıştırın
```

---

## 5. Proje Bağlantısı

### .env.local Dosyasını Düzenleyin

Proje kök dizinindeki `.env.local` dosyasını açın ve şifrenizi güncelleyin:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:BURAYA_ŞİFRENİZİ_YAZIN@localhost:5432/etkinlik_platform
DB_HOST=localhost
DB_PORT=5432
DB_NAME=etkinlik_platform
DB_USER=postgres
DB_PASSWORD=BURAYA_ŞİFRENİZİ_YAZIN

# Upload Configuration
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760
```

### Bağlantıyı Test Edin

```bash
# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açın. Konsol çıktısında şunu görmelisiniz:

```
✅ PostgreSQL veritabanına bağlanıldı
```

---

## 🔍 Veritabanını Kontrol Etme

### pgAdmin4 ile:

1. `etkinlik_platform` > `Schemas` > `public` > `Tables`
2. `events`, `guests`, `media_posts` tablolarını görmelisiniz

### Terminal ile:

```bash
psql -U postgres -d etkinlik_platform

# Tabloları listele
\dt

# Bir tablonun yapısını gör
\d events

# Veri sorgula
SELECT * FROM events;
SELECT * FROM guests;
SELECT * FROM media_posts;
```

---

## 🛠️ Yaygın Sorunlar ve Çözümleri

### Sorun 1: "password authentication failed"
**Çözüm**: `.env.local` dosyasındaki şifrenin doğru olduğundan emin olun.

### Sorun 2: "database does not exist"
**Çözüm**: Veritabanını oluşturmayı unutmuş olabilirsiniz:
```bash
psql -U postgres
CREATE DATABASE etkinlik_platform;
```

### Sorun 3: "relation does not exist"
**Çözüm**: Tabloları oluşturmayı unutmuş olabilirsiniz. Yukarıdaki SQL komutlarını çalıştırın.

### Sorun 4: Port 5432 kullanımda
**Çözüm**: Başka bir PostgreSQL instance çalışıyor olabilir:
```bash
# Windows
netstat -ano | findstr :5432

# macOS/Linux
lsof -i :5432
```

---

## 📊 Veritabanı Şeması

```
┌─────────────────┐
│     events      │
├─────────────────┤
│ id (PK)         │
│ event_name      │
│ event_type      │
│ event_date      │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐       ┌─────────────────┐
│     guests      │       │  media_posts    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────┤ id (PK)         │
│ event_id (FK)   │  1:N  │ event_id (FK)   │
│ full_name       │       │ guest_id (FK)   │
│ created_at      │       │ message         │
└─────────────────┘       │ media_url       │
                          │ created_at      │
                          └─────────────────┘
```

---

## 🎉 Tamamlandı!

Artık PostgreSQL veritabanınız hazır! Projenizi çalıştırabilir ve fotoğraf yüklemeye başlayabilirsiniz.

**Sonraki Adımlar:**
1. `npm run dev` ile projeyi başlatın
2. Upload sayfasına gidin
3. İlk fotoğrafınızı yükleyin
4. pgAdmin4'te `media_posts` tablosunu kontrol edin

---

## 📚 Ek Kaynaklar

- [PostgreSQL Resmi Dokümantasyon](https://www.postgresql.org/docs/)
- [pgAdmin4 Kullanım Kılavuzu](https://www.pgadmin.org/docs/)
- [Node.js pg Kütüphanesi](https://node-postgres.com/)
