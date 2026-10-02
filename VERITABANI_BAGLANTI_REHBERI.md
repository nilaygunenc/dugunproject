# 🔐 Veritabanı Bağlantı Rehberi

## 🎯 Önemli: Projeler Nasıl Ayrılır?

PostgreSQL sunucunuz bir **apartman** gibidir:

```
PostgreSQL Sunucusu (localhost:5432)
├── 📁 Daire 1: bebook (Bebook projesi)
├── 📁 Daire 2: etkinlik_platform (Etkinlik.io projesi) ✅
└── 📁 Daire 3: postgres (Varsayılan sistem DB)
```

Her proje **kendi dairesine** (veritabanına) bağlanır ve diğerlerinden **tamamen izole** çalışır!

---

## ⚙️ Adım 1: Şifrenizi Bulun

PostgreSQL kurulumu sırasında belirlediğiniz şifreyi hatırlayın. Eğer hatırlamıyorsanız:

### Windows'ta Şifre Sıfırlama:
```bash
# pgAdmin4'ü açın
# Servers > PostgreSQL > Sağ tık > Properties > Connection
# Burada şifrenizi görebilir veya değiştirebilirsiniz
```

---

## ⚙️ Adım 2: .env.local Dosyasını Düzenleyin

Projenizin kök dizinindeki `.env.local` dosyasını açın ve şifrenizi yazın:

### Örnek (Şifreniz: 123456 ise):

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:123456@localhost:5432/etkinlik_platform
DB_HOST=localhost
DB_PORT=5432
DB_NAME=etkinlik_platform
DB_USER=postgres
DB_PASSWORD=123456

# Upload Configuration
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760
```

### ⚠️ Önemli Notlar:

1. **`your_password`** yazan yerleri **gerçek şifrenizle** değiştirin
2. **`etkinlik_platform`** veritabanı adını **değiştirmeyin** (bu sizin "daire numaranız")
3. Dosyayı **kaydetmeyi unutmayın** (Ctrl+S)

---

## ⚙️ Adım 3: Veritabanını Oluşturun

Eğer henüz `etkinlik_platform` veritabanını oluşturmadıysanız:

### Yöntem 1: pgAdmin4 ile (Görsel)

```
1. pgAdmin4'ü açın
2. Sol panelde: Servers > PostgreSQL 16
3. Databases üzerine sağ tıklayın
4. Create > Database
5. Database adı: etkinlik_platform
6. Owner: postgres
7. Save butonuna tıklayın
```

### Yöntem 2: Terminal ile

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE etkinlik_platform;

# Çıkış
\q
```

---

## ⚙️ Adım 4: Tabloları Oluşturun

Veritabanı oluşturduktan sonra tabloları oluşturun:

### pgAdmin4 ile:

```
1. pgAdmin4'te etkinlik_platform veritabanını seçin
2. Tools > Query Tool
3. scripts/setup-db.sql dosyasının içeriğini kopyalayın
4. Query Tool'a yapıştırın
5. Execute (F5) tuşuna basın
```

### Terminal ile:

```bash
psql -U postgres -d etkinlik_platform -f scripts/setup-db.sql
```

---

## ✅ Adım 5: Bağlantıyı Test Edin

Projenizde basit bir test yapın:

### Test Kodu (lib/test-db.ts):

```typescript
import pool from './database'

export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Veritabanı bağlantısı başarılı!')
    console.log('Zaman:', result.rows[0].now)
    return true
  } catch (error) {
    console.error('❌ Veritabanı bağlantı hatası:', error)
    return false
  }
}
```

### Test Çalıştırma:

```bash
# Node.js ile test
node -e "require('./lib/test-db').testConnection()"
```

---

## 🔍 Bağlantı String Anatomisi

```
postgresql://postgres:123456@localhost:5432/etkinlik_platform
          │       │        │         │            │
          │       │        │         │            └─ Veritabanı adı (Daire numarası)
          │       │        │         └────────────── Port (Apartman kapı numarası)
          │       │        └──────────────────────── Host (Apartman adresi)
          │       └───────────────────────────────── Şifre (Daire anahtarı)
          └───────────────────────────────────────── Kullanıcı adı (Daire sahibi)
```

---

## 🚨 Yaygın Hatalar ve Çözümleri

### Hata 1: "password authentication failed"
```
Çözüm: .env.local dosyasındaki şifre yanlış
Kontrol: pgAdmin4'te şifrenizi doğrulayın
```

### Hata 2: "database does not exist"
```
Çözüm: etkinlik_platform veritabanını oluşturmadınız
Komut: CREATE DATABASE etkinlik_platform;
```

### Hata 3: "relation does not exist"
```
Çözüm: Tabloları oluşturmadınız
Komut: scripts/setup-db.sql dosyasını çalıştırın
```

### Hata 4: "ECONNREFUSED"
```
Çözüm: PostgreSQL servisi çalışmıyor
Windows: Services.msc > PostgreSQL > Start
```

---

## 📊 Bağlantı Durumu Kontrolü

### pgAdmin4 ile:

```
1. pgAdmin4'ü açın
2. Servers > PostgreSQL 16 > Databases
3. etkinlik_platform veritabanını görüyor musunuz?
4. Sağ tık > Query Tool
5. SELECT * FROM users; (Tablo varsa çalışır)
```

### Terminal ile:

```bash
# Veritabanına bağlan
psql -U postgres -d etkinlik_platform

# Tabloları listele
\dt

# Çıkış
\q
```

---

## 🎯 Proje İzolasyonu Kontrolü

Her projenin kendi veritabanına bağlandığını doğrulayın:

### Bebook Projesi:
```env
DATABASE_URL=postgresql://postgres:123456@localhost:5432/bebook
```

### Etkinlik.io Projesi:
```env
DATABASE_URL=postgresql://postgres:123456@localhost:5432/etkinlik_platform
```

**Aynı şifre, aynı sunucu, farklı veritabanları!** ✅

---

## 🔒 Güvenlik İpuçları

1. **`.env.local` dosyasını asla Git'e eklemeyin**
   - `.gitignore` dosyasında zaten var
   
2. **Production'da farklı şifre kullanın**
   - Geliştirme: Basit şifre (123456)
   - Production: Güçlü şifre (aB3$xY9#mK2!)

3. **Şifreleri kod içine yazmayın**
   - ❌ `const password = '123456'`
   - ✅ `const password = process.env.DB_PASSWORD`

---

## 📝 Kontrol Listesi

Bağlantı kurulmadan önce:

- [ ] PostgreSQL servisi çalışıyor
- [ ] `etkinlik_platform` veritabanı oluşturuldu
- [ ] `.env.local` dosyasında gerçek şifre yazılı
- [ ] Tablolar oluşturuldu (users, events, guests, media_posts)
- [ ] `pg` paketi yüklü (`npm install pg`)
- [ ] Bağlantı testi yapıldı

---

## 🎉 Başarılı Bağlantı Mesajı

Eğer her şey doğruysa, sunucuyu başlattığınızda şunu görmelisiniz:

```bash
npm run dev

> dugunproje@0.1.0 dev
> next dev

  ▲ Next.js 16.2.5
  - Local:        http://localhost:3000

✅ PostgreSQL veritabanına bağlanıldı
🔍 Query çalıştırıldı: SELECT NOW()
```

---

## 🆘 Hala Sorun mu Var?

1. **Şifrenizi kontrol edin**: pgAdmin4'te test edin
2. **Veritabanı adını kontrol edin**: `etkinlik_platform` olmalı
3. **PostgreSQL çalışıyor mu**: Services.msc'de kontrol edin
4. **Port doğru mu**: 5432 varsayılan port

---

💚 **Bağlantı Hazır!**

Artık Etkinlik.io projesi kendi veritabanına bağlı ve Bebook'tan tamamen izole! 🎉
