# 🔧 "ETKİNLİK OLUŞTURURKEN HATA OLUŞTU" ÇÖZÜMÜ

## Sorun:
Events tablosunda eksik kolonlar var. Bu yüzden etkinlik oluşturulamıyor.

## ✅ ÇÖZÜM (3 Adım):

### Adım 1: pgAdmin'i Açın
1. pgAdmin 4'ü başlatın
2. PostgreSQL sunucunuza bağlanın (şifre: **1414**)
3. Sol panelde **Databases** > **etkinlik_platform** seçin
4. **etkinlik_platform** üzerine sağ tıklayın
5. **Query Tool** seçin

### Adım 2: Events Tablosunu Güncelleyin

Query Tool'a şu kodu yapıştırın ve **Execute (F5)** tuşuna basın:

```sql
-- Eksik kolonları ekle
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS package_type VARCHAR(50);
ALTER TABLE events ADD COLUMN IF NOT EXISTS welcome_title VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS welcome_subtitle TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS upload_instructions TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS thank_you_message TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS custom_logo_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS background_image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- İndeksleri ekle
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_media_event_id ON media_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_media_guest_id ON media_posts(guest_id);
```

✅ **"Query returned successfully"** mesajını görmelisiniz!

### Adım 3: Test Kullanıcısı Ekleyin

Aynı Query Tool'da şu kodu çalıştırın:

```sql
-- Test kullanıcısı ekle (şifre: 123456)
INSERT INTO users (full_name, email, password_hash, role) 
VALUES (
    'Test Kullanıcı',
    'test@test.com',
    '$2a$10$rOZxQKJ9YXZ5YqN5YqN5YeN5YqN5YqN5YqN5YqN5YqN5YqN5YqN5Y',
    'event_owner'
)
ON CONFLICT (email) DO NOTHING;
```

✅ **"INSERT 0 1"** veya **"ON CONFLICT DO NOTHING"** mesajını görmelisiniz!

## 🎯 Kontrol Edin

Tabloların doğru olduğunu kontrol etmek için:

```sql
-- Events tablosundaki kolonları göster
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;
```

Şu kolonları görmelisiniz:
- ✅ id
- ✅ event_name
- ✅ event_type
- ✅ event_date
- ✅ created_at
- ✅ **user_id** (YENİ)
- ✅ **slug** (YENİ)
- ✅ **package_type** (YENİ)
- ✅ **welcome_title** (YENİ)
- ✅ **welcome_subtitle** (YENİ)
- ✅ **upload_instructions** (YENİ)
- ✅ **thank_you_message** (YENİ)
- ✅ **custom_logo_url** (YENİ)
- ✅ **background_image_url** (YENİ)
- ✅ **is_active** (YENİ)
- ✅ **is_public** (YENİ)
- ✅ **updated_at** (YENİ)

## 🚀 Tekrar Deneyin!

1. Tarayıcıda: http://localhost:3000/dashboard
2. Bir paket seçin (örn: Düğün)
3. Formu doldurun:
   - **Etkinlik Adı:** Ahmet ve Ayşe'nin Düğünü
   - **Tarih:** Bugünün tarihi
   - **Karşılama Başlığı:** Düğünümüze Hoşgeldiniz!
4. **"Etkinliği Oluştur ve QR Kod Al"** butonuna tıklayın

✅ **Artık çalışmalı!** QR kod sayfası açılacak.

## 🐛 Hala Hata Alıyorsanız

### Terminal'de Hata Mesajını Kontrol Edin:

VS Code'da terminale bakın. Şöyle bir hata görüyorsanız:

```
column "slug" does not exist
```

→ Adım 2'yi tekrar çalıştırın.

```
relation "users" does not exist
```

→ Users tablosu yok, Adım 3'ü çalıştırın.

```
insert or update on table "events" violates foreign key constraint
```

→ User ID bulunamıyor, Adım 3'ü çalıştırın.

### Veritabanı Bağlantısını Test Edin:

Tarayıcıda: http://localhost:3000/api/test-db

✅ Başarılı mesajı görmelisiniz!

## 📋 Hızlı Kontrol Listesi

- [ ] pgAdmin'de etkinlik_platform veritabanı var mı?
- [ ] Events tablosunda user_id kolonu var mı?
- [ ] Events tablosunda slug kolonu var mı?
- [ ] Users tablosunda en az 1 kullanıcı var mı?
- [ ] Sunucu çalışıyor mu? (npm run dev)
- [ ] /api/test-db başarılı mı?

## ✅ Tamamlandı!

Tüm adımları tamamladıktan sonra etkinlik oluşturma çalışacak!

---

**Sorun devam ederse, terminal'deki tam hata mesajını paylaşın.**
