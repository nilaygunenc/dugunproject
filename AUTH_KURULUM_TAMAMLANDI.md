# ✅ GİRİŞ YAP VE ÜYE OL SİSTEMİ HAZIR!

## 🎉 Oluşturulan Dosyalar

### API Endpoint'leri:
- ✅ `/api/auth/register` - Yeni kullanıcı kaydı
- ✅ `/api/auth/login` - Kullanıcı girişi
- ✅ `/api/auth/logout` - Çıkış yapma

### Veritabanı Script'leri:
- ✅ `scripts/create-auth-tables.sql` - Tablo oluşturma script'i
- ✅ `PGADMIN_KURULUM.md` - Detaylı kurulum rehberi

### Güvenlik:
- ✅ Şifreler bcrypt ile hashleniyor
- ✅ JWT token ile oturum yönetimi
- ✅ HTTP-only cookie kullanımı

## 🔧 ŞİMDİ YAPMANIZ GEREKENLER:

### 1. pgAdmin'i Açın

1. pgAdmin 4'ü başlatın
2. PostgreSQL'e bağlanın (şifre: **1414**)

### 2. Veritabanını Oluşturun

pgAdmin'de Query Tool'u açın ve şunu çalıştırın:

```sql
CREATE DATABASE etkinlik_platform;
```

### 3. Tabloları Oluşturun

1. Sol panelde **etkinlik_platform** veritabanına sağ tıklayın
2. **Query Tool** seçin
3. Şu komutu çalıştırın:

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'event_owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### 4. Test Edin!

Tarayıcıda:

1. **Üye Ol:** http://localhost:3000/register
   - Ad Soyad: Test Kullanıcı
   - E-posta: test@test.com
   - Şifre: 123456

2. **Giriş Yap:** http://localhost:3000/login
   - E-posta: test@test.com
   - Şifre: 123456

3. **Dashboard:** http://localhost:3000/dashboard

## 📊 Veritabanı Yapısı

### users tablosu:
```
id              SERIAL PRIMARY KEY
full_name       VARCHAR(150)
email           VARCHAR(255) UNIQUE
password_hash   TEXT
role            VARCHAR(50) DEFAULT 'event_owner'
created_at      TIMESTAMP
```

### events tablosu:
```
id                      SERIAL PRIMARY KEY
user_id                 INTEGER (users'a referans)
event_name              VARCHAR(255)
event_type              VARCHAR(100)
event_date              DATE
slug                    VARCHAR(255) UNIQUE
package_type            VARCHAR(50)
welcome_title           VARCHAR(255)
welcome_subtitle        TEXT
upload_instructions     TEXT
thank_you_message       TEXT
custom_logo_url         TEXT
background_image_url    TEXT
is_active               BOOLEAN
is_public               BOOLEAN
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### guests tablosu:
```
id          SERIAL PRIMARY KEY
event_id    INTEGER (events'e referans)
full_name   VARCHAR(150)
created_at  TIMESTAMP
```

### media_posts tablosu:
```
id          SERIAL PRIMARY KEY
event_id    INTEGER (events'e referans)
guest_id    INTEGER (guests'e referans)
message     VARCHAR(255)
media_url   TEXT
created_at  TIMESTAMP
```

## 🔐 Güvenlik Özellikleri

- ✅ **Şifre Hashleme:** bcrypt ile 10 round
- ✅ **JWT Token:** 7 gün geçerlilik
- ✅ **HTTP-only Cookie:** XSS koruması
- ✅ **Email Validasyonu:** Benzersiz email kontrolü
- ✅ **Şifre Uzunluğu:** Minimum 6 karakter

## 🎯 API Kullanımı

### Kayıt Ol:
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456"
}
```

### Giriş Yap:
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmet@example.com",
  "password": "123456"
}
```

### Çıkış Yap:
```javascript
POST /api/auth/logout
```

## ✅ Kontrol Listesi

- [ ] pgAdmin'de `etkinlik_platform` veritabanını oluşturdunuz mu?
- [ ] `users` tablosunu oluşturdunuz mu?
- [ ] `events` tablosunu oluşturdunuz mu?
- [ ] `guests` tablosunu oluşturdunuz mu?
- [ ] `media_posts` tablosunu oluşturdunuz mu?
- [ ] `.env.local` dosyasında şifre doğru mu? (1414)
- [ ] Sunucu çalışıyor mu? (`npm run dev`)
- [ ] Üye ol sayfası açılıyor mu?
- [ ] Giriş yap sayfası açılıyor mu?

## 🚀 Sonraki Adımlar

1. ✅ Veritabanı kurulumu tamamlandı
2. ✅ Auth API'leri hazır
3. ✅ Giriş/Kayıt sayfaları tasarlandı
4. 🔜 Dashboard'da etkinlik oluşturma
5. 🔜 QR kod üretimi
6. 🔜 Misafir yükleme sistemi

## 📞 Yardım

Sorun yaşıyorsanız:

1. **Veritabanı bağlantısını test edin:**
   http://localhost:3000/api/test-db

2. **Tarayıcı Console'u kontrol edin:**
   F12 > Console sekmesi

3. **Terminal çıktısını kontrol edin:**
   Hata mesajları var mı?

---

**HAZIR!** Artık kullanıcılar kayıt olup giriş yapabilir! 🎉
