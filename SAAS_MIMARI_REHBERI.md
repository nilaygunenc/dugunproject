# 🏗️ SaaS Mimarisi - Tam Rehber

## 📋 Proje Yapısı

```
dugunproje/
│
├── 📂 app/
│   │
│   ├── 📂 (public)/              # Herkese açık sayfalar
│   │   ├── page.tsx              # ✅ Landing page
│   │   ├── login/
│   │   │   └── page.tsx          # ✅ Giriş sayfası
│   │   ├── register/
│   │   │   └── page.tsx          # ✅ Kayıt sayfası
│   │   └── pricing/
│   │       └── page.tsx          # 🔲 Fiyatlandırma
│   │
│   ├── 📂 (dashboard)/           # Korumalı alan (Auth gerekli)
│   │   └── dashboard/
│   │       ├── page.tsx          # ✅ Paket seçimi
│   │       ├── events/
│   │       │   ├── page.tsx      # 🔲 Etkinlik listesi
│   │       │   └── [eventId]/
│   │       │       ├── card/
│   │       │       │   └── page.tsx  # ✅ Kart oluşturma
│   │       │       └── edit/
│   │       │           └── page.tsx  # 🔲 Etkinlik düzenleme
│   │       └── settings/
│   │           └── page.tsx      # 🔲 Kullanıcı ayarları
│   │
│   ├── 📂 e/                     # Misafir sayfaları
│   │   └── [eventSlug]/
│   │       └── page.tsx          # ✅ Misafir upload sayfası
│   │
│   └── 📂 api/                   # API Routes
│       ├── auth/
│       │   ├── register/
│       │   │   └── route.ts      # 🔲 Kayıt API
│       │   └── login/
│       │       └── route.ts      # 🔲 Giriş API
│       ├── events/
│       │   ├── create/
│       │   │   └── route.ts      # 🔲 Etkinlik oluşturma
│       │   ├── [eventId]/
│       │   │   └── route.ts      # 🔲 Etkinlik detay
│       │   └── slug/
│       │       └── [slug]/
│       │           └── route.ts  # 🔲 Slug ile etkinlik
│       └── upload/
│           └── route.ts          # ✅ Mevcut (güncelleme gerekebilir)
│
├── 📂 components/
│   ├── UploadFormNew.tsx         # ✅ Upload form
│   ├── GalleryNew.tsx            # ✅ Galeri
│   └── ...
│
└── 📂 lib/
    ├── database.ts               # ✅ PostgreSQL bağlantısı
    ├── models.ts                 # ✅ CRUD işlemleri (güncellenmiş)
    └── auth.ts                   # 🔲 Auth helper fonksiyonlar
```

## 🎯 Kullanıcı Akışı

### 1️⃣ Landing Page (Ana Sayfa)
**Dosya**: `app/(public)/page.tsx`

**Özellikler**:
- ✅ Navbar (Logo, Linkler, Giriş/Üye Ol butonları)
- ✅ Hero section (Başlık, açıklama, CTA butonları)
- ✅ Nasıl Çalışır? (3 adım)
- ✅ Kullanım Alanları (6 kart)
- ✅ CTA section
- ✅ Footer (Linkler, telif hakkı)

**Navigasyon**:
```
/ (Landing) 
  → /register (Üye Ol)
  → /login (Giriş Yap)
  → /pricing (Fiyatlandırma)
```

---

### 2️⃣ Kayıt Sistemi
**Dosya**: `app/(public)/register/page.tsx`

**Form Alanları**:
- Ad Soyad
- E-posta
- Şifre
- Şifre Tekrar

**İşleyiş**:
```
1. Kullanıcı formu doldurur
2. POST /api/auth/register
3. Şifre hash'lenir (bcrypt)
4. Veritabanına kaydedilir (users tablosu)
5. Başarılı → /login sayfasına yönlendir
```

**API Endpoint** (Oluşturulacak):
```typescript
// app/api/auth/register/route.ts
POST /api/auth/register
Body: { fullName, email, password }
Response: { success: true, message: "Kayıt başarılı" }
```

---

### 3️⃣ Giriş Sistemi
**Dosya**: `app/(public)/login/page.tsx`

**Form Alanları**:
- E-posta
- Şifre

**İşleyiş**:
```
1. Kullanıcı giriş yapar
2. POST /api/auth/login
3. Şifre doğrulanır (bcrypt.compare)
4. JWT token oluşturulur
5. Cookie'ye kaydedilir
6. Başarılı → /dashboard sayfasına yönlendir
```

**API Endpoint** (Oluşturulacak):
```typescript
// app/api/auth/login/route.ts
POST /api/auth/login
Body: { email, password }
Response: { success: true, token: "jwt_token" }
```

---

### 4️⃣ Dashboard (Paket Seçimi)
**Dosya**: `app/(dashboard)/dashboard/page.tsx`

**Özellikler**:
- ✅ Navbar (Logo, Etkinliklerim, Kullanıcı menüsü)
- ✅ Hoş geldiniz mesajı
- ✅ 6 paket kartı (Düğün, Doğum Günü, Nişan, Kına, Sünnet, Diğer)
- ✅ Her kart tıklanabilir

**İşleyiş**:
```
1. Kullanıcı paketi seçer (örn: "Düğün")
2. POST /api/events/create
3. Etkinlik oluşturulur (events tablosu)
4. Benzersiz slug oluşturulur
5. Başarılı → /dashboard/events/{eventId}/card
```

**API Endpoint** (Oluşturulacak):
```typescript
// app/api/events/create/route.ts
POST /api/events/create
Body: { packageType: "wedding" }
Response: { success: true, eventId: 123 }
```

---

### 5️⃣ Etkinlik Kartı Oluşturma
**Dosya**: `app/(dashboard)/dashboard/events/[eventId]/card/page.tsx`

**Özellikler**:
- ✅ Dijital kart önizlemesi
- ✅ QR kod (placeholder)
- ✅ Misafir linki
- ✅ Link kopyalama
- ✅ WhatsApp paylaşımı
- ✅ QR kod indirme (placeholder)
- ✅ Önizleme linki

**Paylaşım Linki**:
```
https://etkinlik.io/e/ayse-mehmet-dugunu-2026
```

---

### 6️⃣ Misafir Sayfası (Upload + Galeri)
**Dosya**: `app/e/[eventSlug]/page.tsx`

**Özellikler**:
- ✅ Etkinlik başlığı ve tarihi
- ✅ Tab navigasyonu (Upload / Galeri)
- ✅ Upload formu (UploadFormNew)
- ✅ Galeri (GalleryNew)
- ✅ Responsive tasarım

**İşleyiş**:
```
1. Misafir QR kodu okuttur veya linke tıklar
2. GET /api/events/slug/{slug}
3. Etkinlik bilgileri yüklenir
4. Misafir fotoğraf yükler
5. POST /api/upload
6. Fotoğraf kaydedilir
7. Galeri otomatik güncellenir
```

---

## 🗄️ Veritabanı Şeması (Güncellenmiş)

### 1. Users (Kullanıcılar)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'event_owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Events (Etkinlikler)
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    package_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Guests (Misafirler)
```sql
CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Media Posts (Fotoğraflar)
```sql
CREATE TABLE media_posts (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    message VARCHAR(255),
    media_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Authentication (JWT)

### JWT Token Yapısı
```typescript
{
  userId: 123,
  email: "ahmet@example.com",
  role: "event_owner",
  iat: 1234567890,
  exp: 1234567890
}
```

### Middleware (Oluşturulacak)
```typescript
// lib/auth.ts
export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch (error) {
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  
  if (!token) {
    return NextResponse.redirect('/login')
  }
  
  const user = await verifyToken(token)
  
  if (!user) {
    return NextResponse.redirect('/login')
  }
  
  return user
}
```

---

## 🚀 Yapılacaklar Listesi

### Kritik (Hemen)
- [ ] Auth API'leri oluştur (`/api/auth/register`, `/api/auth/login`)
- [ ] JWT middleware ekle
- [ ] Etkinlik oluşturma API'si (`/api/events/create`)
- [ ] Slug oluşturma fonksiyonu
- [ ] Etkinlik detay API'si (`/api/events/[eventId]`)
- [ ] Slug ile etkinlik API'si (`/api/events/slug/[slug]`)
- [ ] QR kod oluşturma (qrcode paketi)

### Önemli (Kısa Vadeli)
- [ ] Etkinlik listesi sayfası (`/dashboard/events`)
- [ ] Etkinlik düzenleme sayfası
- [ ] Kullanıcı ayarları sayfası
- [ ] Fiyatlandırma sayfası
- [ ] Şifremi unuttum özelliği
- [ ] Email doğrulama

### İyileştirmeler (Orta Vadeli)
- [ ] Real-time galeri güncellemesi (WebSocket)
- [ ] Fotoğraf silme özelliği
- [ ] Etkinlik istatistikleri
- [ ] Admin paneli
- [ ] Ödeme entegrasyonu
- [ ] Email bildirimleri

---

## 📝 Örnek API Çağrıları

### 1. Kayıt
```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    password: 'guvenli123'
  })
})
```

### 2. Giriş
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'ahmet@example.com',
    password: 'guvenli123'
  })
})
```

### 3. Etkinlik Oluşturma
```typescript
const response = await fetch('/api/events/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    packageType: 'wedding',
    eventName: 'Ayşe & Mehmet Düğünü',
    eventDate: '2026-06-15'
  })
})
```

### 4. Etkinlik Detayı
```typescript
const response = await fetch(`/api/events/${eventId}`)
const data = await response.json()
```

### 5. Slug ile Etkinlik
```typescript
const response = await fetch(`/api/events/slug/ayse-mehmet-dugunu-2026`)
const data = await response.json()
```

---

## 🎨 Tasarım Sistemi

### Renkler
```css
/* Fresh Nature-Inspired */
--sage: #9CAF88      /* Adaçayı yeşili */
--peach: #FFCBA4     /* Şeftali */
--earth: #8B7355     /* Toprak */
--cream: #FFF8F0     /* Kırık beyaz */
```

### Paket Renkleri
```css
Düğün: from-pink-400 to-rose-400
Doğum Günü: from-blue-400 to-cyan-400
Nişan: from-purple-400 to-pink-400
Kına: from-orange-400 to-red-400
Sünnet: from-green-400 to-emerald-400
Diğer: from-indigo-400 to-purple-400
```

---

## 🔒 Güvenlik

### Şifre Hashleme
```typescript
import bcrypt from 'bcryptjs'

// Kayıt
const passwordHash = await bcrypt.hash(password, 10)

// Giriş
const isValid = await bcrypt.compare(password, user.password_hash)
```

### JWT Token
```typescript
import jwt from 'jsonwebtoken'

// Token oluştur
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
)

// Token doğrula
const decoded = jwt.verify(token, process.env.JWT_SECRET!)
```

---

## 📦 Environment Variables

```.env.local
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=etkinlik_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars

# Upload
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Test Senaryoları

### 1. Kayıt ve Giriş
```
1. Ana sayfaya git (/)
2. "Üye Ol" butonuna tıkla
3. Formu doldur
4. "Hesap Oluştur" butonuna tıkla
5. Giriş sayfasına yönlendirildiğini kontrol et
6. Giriş yap
7. Dashboard'a yönlendirildiğini kontrol et
```

### 2. Etkinlik Oluşturma
```
1. Dashboard'da "Düğün" paketini seç
2. Etkinlik kartı sayfasına yönlendirildiğini kontrol et
3. QR kod ve link'in göründüğünü kontrol et
4. "Link Kopyala" butonuna tıkla
5. Kopyalandı mesajını kontrol et
```

### 3. Misafir Akışı
```
1. Misafir linkini aç (/e/event-slug)
2. Etkinlik bilgilerinin göründüğünü kontrol et
3. "Fotoğraf Yükle" sekmesinde ol
4. Fotoğraf yükle
5. "Galeri" sekmesine geç
6. Yüklenen fotoğrafın göründüğünü kontrol et
```

---

## 🎯 Sonraki Adımlar

1. ✅ Frontend iskelet tamamlandı
2. 🔲 Auth API'lerini oluştur
3. 🔲 Etkinlik API'lerini oluştur
4. 🔲 JWT middleware ekle
5. 🔲 QR kod entegrasyonu
6. 🔲 Test et
7. 🔲 Production'a deploy et

---

💚 **Başarılar!**
