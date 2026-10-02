# 🔧 Teknik Genel Bakış

## 📁 Proje Yapısı

```
dugunproje/
├── app/
│   ├── [lang]/                    # Çok dilli routing
│   │   ├── page.tsx              # Ana sayfa (karşılama)
│   │   ├── layout.tsx            # Dil bazlı layout
│   │   ├── upload/page.tsx       # Yükleme sayfası
│   │   ├── gallery/page.tsx      # Galeri sayfası
│   │   └── live/page.tsx         # Canlı slayt gösterisi
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global stiller
├── components/
│   ├── UploadForm.tsx            # Yükleme formu (sıkıştırma + upload)
│   ├── Gallery.tsx               # Galeri komponenti
│   ├── LiveSlideshow.tsx         # Canlı slayt gösterisi
│   └── LanguageSwitcher.tsx      # Dil değiştirici
├── lib/
│   ├── firebase.ts               # Firebase başlatma
│   ├── firestore.ts              # Firestore CRUD işlemleri
│   ├── firebaseStorage.ts        # Storage yükleme fonksiyonları
│   ├── imageCompression.ts       # Görsel sıkıştırma
│   ├── i18n.ts                   # Çok dilli destek
│   └── dictionaries/
│       ├── tr.json               # Türkçe çeviriler
│       └── en.json               # İngilizce çeviriler
├── proxy.ts                       # Next.js 16 routing proxy
├── .env.local                     # Firebase credentials (GİT'E EKLEMEYİN!)
└── .env.example                   # Environment template

```

---

## 🎯 Temel Özellikler

### 1. İstemci Taraflı Görsel Sıkıştırma

**Dosya**: `lib/imageCompression.ts`

```typescript
// 5 MB → 200-300 KB
await compressImage(file, onProgress)
```

**Özellikler**:
- `browser-image-compression` kütüphanesi kullanır
- Maksimum boyut: 0.3 MB (300 KB)
- Maksimum genişlik/yükseklik: 1920px
- Kalite: 0.8 (80%)
- Progress callback ile ilerleme takibi

**Avantajlar**:
- ✅ Firebase Storage maliyetlerini %90+ azaltır
- ✅ Yükleme süresini kısaltır
- ✅ Bant genişliği tasarrufu
- ✅ Sunucu yükü yok (istemci tarafında işlem)

---

### 2. Firebase Storage Yükleme

**Dosya**: `lib/firebaseStorage.ts`

```typescript
// Tek dosya yükleme
await uploadToFirebase(file, path, onProgress)

// Çoklu dosya yükleme
await uploadMultipleToFirebase(files, onProgress)
```

**Özellikler**:
- Progress tracking (0-100%)
- Otomatik dosya adlandırma (timestamp + random ID)
- Content-Type ayarlama
- Cache control (1 yıl)

---

### 3. Firestore Database İşlemleri

**Dosya**: `lib/firestore.ts`

```typescript
// Post oluştur
await createPost(data)

// Postları getir
const posts = await getPosts(limit)

// Post beğen
await likePost(postId, currentLikes)

// Real-time dinleyici
const unsubscribe = subscribeToPost(callback, limit)
```

**Veri Modeli**:
```typescript
type Post = {
  id: string
  guest_name: string
  message: string | null
  media_urls: string[]
  media_types: string[]
  likes: number
  created_at: Date
}
```

---

### 4. Real-time Güncellemeler

**Firestore onSnapshot** kullanılır:

```typescript
// Gallery.tsx ve LiveSlideshow.tsx
useEffect(() => {
  const unsubscribe = subscribeToPost((posts) => {
    setPosts(posts)
  })
  return () => unsubscribe()
}, [])
```

**Avantajlar**:
- ✅ Yeni postlar anında görünür
- ✅ Beğeniler senkronize edilir
- ✅ Polling gerekmez (WebSocket)

---

### 5. Çok Dilli Destek (i18n)

**Dosya**: `lib/i18n.ts`

```typescript
// Dil sözlüğü getir
const dict = await getDictionary('tr')
```

**Routing**:
- `/tr` → Türkçe
- `/en` → İngilizce
- `/` → Varsayılan (TR)

**Proxy Routing** (Next.js 16):
```typescript
// proxy.ts
if (!pathname.startsWith('/tr') && !pathname.startsWith('/en')) {
  return NextResponse.redirect(new URL('/tr', request.url))
}
```

---

## 🎨 Tasarım Sistemi

### Renk Paleti (Mavi Pastel)

```css
/* Açık tonlar */
--color-lightest: #E3F2FD;
--color-light: #BBDEFB;
--color-medium: #90CAF9;

/* Orta tonlar */
--color-primary: #42A5F5;
--color-dark: #1976D2;

/* Koyu tonlar */
--color-darkest: #0D47A1;
```

### Tipografi

```css
font-family: 'Inter', 'Roboto', sans-serif;
```

### Animasyonlar

- **Glow Effect**: `box-shadow` ile parıltı
- **Pulse**: `@keyframes pulse-glow`
- **Progress Shimmer**: `@keyframes shimmer`
- **Framer Motion**: Sayfa geçişleri ve kartlar

---

## 📊 Yükleme Akışı

```
1. Kullanıcı dosya seçer
   ↓
2. Önizleme oluşturulur
   ↓
3. [YÜKLE] butonuna tıklar
   ↓
4. ADIM 1: Sıkıştırma (İstemci)
   - Her dosya için progress bar
   - 5 MB → 200-300 KB
   ↓
5. ADIM 2: Firebase Storage'a Yükleme
   - Her dosya için progress bar
   - Download URL alınır
   ↓
6. ADIM 3: Firestore'a Kayıt
   - Post belgesi oluşturulur
   ↓
7. Başarı mesajı gösterilir
   ↓
8. Real-time güncelleme ile tüm cihazlarda görünür
```

---

## 🔒 Güvenlik Kuralları

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      // Herkes okuyabilir
      allow read: if true;
      
      // Sadece gerekli alanlarla oluşturulabilir
      allow create: if request.resource.data.keys().hasAll([
        'guest_name', 'media_urls', 'media_types', 'likes', 'created_at'
      ]);
      
      // Sadece likes güncellenebilir
      allow update: if request.resource.data.diff(resource.data)
                       .affectedKeys().hasOnly(['likes']);
      
      // Silme kapalı (admin için açılabilir)
      allow delete: if false;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /wedding-media/{fileName} {
      // Herkes okuyabilir
      allow read: if true;
      
      // Sadece resim/video, max 10MB
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*|video/.*');
    }
  }
}
```

---

## 🚀 Performans Optimizasyonları

### 1. Görsel Sıkıştırma
- **Önce**: 5 MB × 10 dosya = 50 MB
- **Sonra**: 0.3 MB × 10 dosya = 3 MB
- **Tasarruf**: %94

### 2. CDN Cache
```typescript
cacheControl: 'public, max-age=31536000' // 1 yıl
```

### 3. Lazy Loading
- Görseller viewport'a girdiğinde yüklenir
- Next.js Image component kullanılabilir

### 4. Real-time Subscriptions
- Polling yerine WebSocket
- Sadece değişiklikler gönderilir

---

## 📦 Bağımlılıklar

```json
{
  "dependencies": {
    "firebase": "^12.12.1",              // Firebase SDK
    "browser-image-compression": "^2.0.2", // Görsel sıkıştırma
    "framer-motion": "^12.38.0",         // Animasyonlar
    "next": "16.2.5",                    // Next.js 16
    "react": "19.2.4",                   // React 19
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",        // Tailwind CSS v4
    "typescript": "^5"                   // TypeScript
  }
}
```

---

## 🧪 Test Senaryoları

### 1. Yükleme Testi
- [ ] 1 fotoğraf yükleme
- [ ] 10 fotoğraf yükleme (maksimum)
- [ ] Video yükleme
- [ ] Büyük dosya (5+ MB) sıkıştırma
- [ ] Progress bar'ların çalışması

### 2. Real-time Testi
- [ ] İki tarayıcı açın
- [ ] Birinden fotoğraf yükleyin
- [ ] Diğerinde anında görünmeli

### 3. Beğeni Testi
- [ ] Fotoğraf beğenme
- [ ] Aynı fotoğrafı tekrar beğenememe
- [ ] Beğeni sayısının güncellenmesi

### 4. Çok Dilli Test
- [ ] TR/EN geçişi
- [ ] URL'de dil parametresi
- [ ] Tüm metinlerin çevrilmesi

---

## 🐛 Bilinen Sınırlamalar

1. **Maksimum 10 dosya**: Form validasyonu ile sınırlandırılmış
2. **Video sıkıştırma yok**: Sadece görseller sıkıştırılıyor
3. **Admin paneli yok**: Moderasyon için manuel Firebase Console kullanımı
4. **Spam koruması yok**: Rate limiting eklenmeli
5. **Offline destek yok**: İnternet bağlantısı gerekli

---

## 🔮 Gelecek Geliştirmeler

### Öncelikli
- [ ] Admin paneli (moderasyon)
- [ ] Video sıkıştırma
- [ ] Rate limiting (spam önleme)
- [ ] PWA desteği (offline)

### İsteğe Bağlı
- [ ] QR kod oluşturucu
- [ ] Fotoğraf filtreleri
- [ ] Sosyal medya paylaşımı
- [ ] Email bildirimleri
- [ ] Analytics (ziyaretçi sayısı)

---

## 📚 Kaynaklar

- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js 16 Docs**: https://nextjs.org/docs
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

---

## 💡 İpuçları

### Development
```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucusu
```

### Firebase Console
- **Logs**: Real-time hata takibi
- **Usage**: Kota kullanımı
- **Performance**: Performans metrikleri

### Debugging
```typescript
// Firebase debug modu
console.log('Firebase initialized:', app.name)
console.log('Storage bucket:', storage.app.options.storageBucket)
```

---

## 🎓 Öğrenme Kaynakları

1. **Firebase Firestore**: https://firebase.google.com/docs/firestore
2. **Firebase Storage**: https://firebase.google.com/docs/storage
3. **Image Compression**: https://github.com/Donaldcwl/browser-image-compression
4. **Next.js i18n**: https://nextjs.org/docs/app/building-your-application/routing/internationalization

---

Sorularınız için: Firebase Console > Support
