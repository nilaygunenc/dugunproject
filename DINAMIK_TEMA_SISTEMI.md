# 🎨 Dinamik Tema ve Site Builder Sistemi

## 📋 Genel Bakış

Bu sistem, organizasyon sahiplerinin **kendi etkinlikleri için anında özelleştirilmiş, tematik misafir siteleri** oluşturabildiği tam bir **Site Builder** mimarisidir.

---

## 🏗️ Mimari Yapı

### 1. Tema Sistemi (`lib/themes.ts`)

Her etkinlik türü için önceden tanımlanmış temalar:

```typescript
- wedding (Düğün): Pembe/Gül tonları, zarif serif fontlar
- birthday (Doğum Günü): Mavi/Cyan tonları, modern fontlar
- engagement (Nişan): Mor/Pembe tonları, zarif tasarım
- henna (Kına): Turuncu/Kırmızı tonları, geleneksel
- circumcision (Sünnet): Yeşil/Zümrüt tonları, çocuk dostu
- other (Diğer): İndigo/Mor tonları, esnek
```

### 2. Veritabanı Şeması

```sql
CREATE TABLE events (
    -- Temel Bilgiler
    id, user_id, event_name, event_type, event_date, slug, package_type,
    
    -- Özelleştirilebilir İçerik (Site Builder)
    welcome_title VARCHAR(255),
    welcome_subtitle TEXT,
    upload_instructions TEXT,
    thank_you_message TEXT,
    
    -- Görsel Özelleştirme
    custom_logo_url TEXT,
    background_image_url TEXT,
    
    -- Durum
    is_active BOOLEAN,
    is_public BOOLEAN
)
```

### 3. Routing Yapısı

```
app/
├── e/[eventSlug]/page.tsx          # Dinamik misafir sayfası
├── dashboard/
│   ├── page.tsx                    # Paket seçimi
│   └── events/
│       └── [eventId]/
│           ├── edit/page.tsx       # Özelleştirme sayfası
│           └── card/page.tsx       # QR kod ve paylaşım
```

---

## 🎯 Kullanıcı Akışları

### A. Organizasyon Sahibi Akışı

#### 1️⃣ Paket Seçimi (`/dashboard`)
```
Kullanıcı → Paket Seçer (Düğün/Sünnet/vb.) → Oluştur
```

#### 2️⃣ Özelleştirme (`/dashboard/events/[id]/edit`)
```
Organizasyon Sahibi:
  ├── Etkinlik Adı: "Ayşe & Mehmet"
  ├── Tarih: 15 Haziran 2026
  ├── Tema: Düğün (otomatik pembe tonlar)
  ├── Hoş Geldiniz Başlığı: "Düğünümüze Hoş Geldiniz! 💍"
  ├── Alt Yazı: "Bu özel günü bizimle paylaştığınız için..."
  ├── Yükleme Talimatları: "Fotoğraflarınızı yükleyin..."
  └── Teşekkür Mesajı: "Paylaşımlarınız için teşekkürler!"
```

**Canlı Önizleme**: Sağ tarafta değişiklikler anında görülür.

#### 3️⃣ QR Kod ve Paylaşım (`/dashboard/events/[id]/card`)
```
Sistem Çıktısı:
  ├── Benzersiz URL: /e/ayse-mehmet-dugunu-2026
  ├── QR Kod (PNG)
  ├── WhatsApp Paylaşım Butonu
  └── Link Kopyalama
```

---

### B. Misafir Akışı

#### 1️⃣ QR Kod Okutma
```
Misafir → QR Kodu Okuttur → /e/ayse-mehmet-dugunu-2026
```

#### 2️⃣ Dinamik Tema Yükleme
```
Sistem:
  ├── event_type = "wedding" oku
  ├── THEMES['wedding'] temasını yükle
  ├── Renkler: Pembe/Gül tonları
  ├── Fontlar: Serif (zarif)
  └── İkonlar: 💍
```

#### 3️⃣ Özelleştirilmiş İçerik
```
Misafir Görür:
  ├── Başlık: "Ayşe & Mehmet" (organizasyon sahibinin yazdığı)
  ├── Hoş Geldiniz: "Düğünümüze Hoş Geldiniz!" (özel mesaj)
  ├── Tema: Pembe tonlar, zarif tasarım
  └── Upload Formu: Tema renklerine uygun
```

#### 4️⃣ Medya Yükleme
```
Misafir:
  ├── İsim: "Ahmet Yılmaz"
  ├── Mesaj: "Mutluluklar dilerim!"
  ├── Fotoğraf: [Seç ve Yükle]
  └── Kaydet → event_id ile ilişkilendir
```

---

## 🎨 Tema Değişim Mekanizması

### Kod Örneği

```typescript
// 1. Temayı Al
const theme = getTheme(event.event_type) // 'wedding'

// 2. Dinamik Stiller Uygula
<div className={`bg-gradient-to-br ${theme.gradients.hero}`}>
  <h1 style={{ color: theme.colors.text }}>
    {event.welcome_title}
  </h1>
  
  <button className={`${theme.borderRadius} ${theme.shadows.button}`}>
    Yükle
  </button>
</div>
```

### Tema Özellikleri

```typescript
interface Theme {
  colors: {
    primary: '#FF6B9D',      // Ana renk
    secondary: '#FFC2D1',    // İkincil renk
    accent: '#FFE5EC',       // Vurgu rengi
    background: '#FFF5F7',   // Arka plan
    text: '#4A1942',         // Metin rengi
    textLight: '#8B5A83'     // Açık metin
  },
  gradients: {
    hero: 'from-pink-100 via-rose-50 to-pink-100',
    card: 'from-pink-50 to-rose-50',
    button: 'from-pink-400 to-rose-500'
  },
  fonts: {
    heading: 'font-serif',   // Başlık fontu
    body: 'font-sans'        // Gövde fontu
  },
  borderRadius: 'rounded-3xl',
  shadows: {
    card: 'shadow-xl shadow-pink-200/50',
    button: 'shadow-lg shadow-pink-300/50'
  }
}
```

---

## 📊 Tema Karşılaştırması

| Özellik | Düğün | Sünnet | Doğum Günü |
|---------|-------|--------|------------|
| **Ana Renk** | Pembe | Yeşil | Mavi |
| **İkon** | 💍 | 🎉 | 🎂 |
| **Font** | Serif (zarif) | Bold (eğlenceli) | Bold (modern) |
| **Köşe** | Yuvarlak (3xl) | Orta (2xl) | Orta (2xl) |
| **Hissiyat** | Romantik | Neşeli | Kutlama |

---

## 🔧 Teknik Detaylar

### 1. Dinamik Routing

```typescript
// app/e/[eventSlug]/page.tsx
export default function GuestEventPage() {
  const params = useParams()
  const eventSlug = params.eventSlug // "ayse-mehmet-dugunu-2026"
  
  // 1. Slug ile etkinliği bul
  const event = await fetchEventBySlug(eventSlug)
  
  // 2. Temayı yükle
  const theme = getTheme(event.event_type)
  
  // 3. Dinamik render
  return <ThemedPage event={event} theme={theme} />
}
```

### 2. Tema Enjeksiyonu

```typescript
// Tailwind sınıfları dinamik olarak uygulanır
<div className={`bg-gradient-to-br ${theme.gradients.hero}`}>
  <h1 className={theme.fonts.heading} style={{ color: theme.colors.text }}>
    {event.welcome_title}
  </h1>
</div>
```

### 3. CSS Variables (Alternatif)

```typescript
// Tema CSS değişkenleri olarak da kullanılabilir
const themeCSS = `
  --theme-primary: ${theme.colors.primary};
  --theme-secondary: ${theme.colors.secondary};
`

<div style={{ ['--theme-vars' as any]: themeCSS }}>
  <button style={{ backgroundColor: 'var(--theme-primary)' }}>
    Yükle
  </button>
</div>
```

---

## 🚀 Kullanım Örnekleri

### Örnek 1: Düğün Etkinliği

```
Organizasyon Sahibi:
  ├── Paket: Düğün
  ├── Ad: "Ayşe & Mehmet"
  ├── Başlık: "Düğünümüze Hoş Geldiniz!"
  └── Tema: Otomatik pembe tonlar

Misafir Görür:
  ├── URL: /e/ayse-mehmet-dugunu-2026
  ├── Renkler: Pembe/Gül tonları
  ├── Font: Zarif serif
  └── İkon: 💍
```

### Örnek 2: Sünnet Düğünü

```
Organizasyon Sahibi:
  ├── Paket: Sünnet
  ├── Ad: "Furkan'ın Sünneti"
  ├── Başlık: "Furkan'ın Sünnetine Hoşgeldiniz!"
  └── Tema: Otomatik yeşil tonlar

Misafir Görür:
  ├── URL: /e/furkan-sunneti-2026
  ├── Renkler: Yeşil/Zümrüt tonları
  ├── Font: Eğlenceli bold
  └── İkon: 🎉
```

---

## 📝 Özelleştirilebilir Alanlar

### Organizasyon Sahibi Değiştirebilir:

✅ **Metinler**:
- Etkinlik adı
- Hoş geldiniz başlığı
- Hoş geldiniz alt yazısı
- Yükleme talimatları
- Teşekkür mesajı

✅ **Tarih ve Saat**:
- Etkinlik tarihi

✅ **Tema Seçimi**:
- Etkinlik türü (otomatik tema değişimi)

❌ **Değiştiremez** (Sistem Yönetir):
- Tema renkleri (paket bazlı)
- Layout yapısı
- Fonksiyonellik

---

## 🎯 Avantajlar

### 1. Hız
- Anında site oluşturma
- Hazır temalar
- Sıfır kodlama

### 2. Tutarlılık
- Profesyonel tasarım
- Marka uyumu
- Kalite garantisi

### 3. Esneklik
- Özelleştirilebilir metinler
- Tema seçenekleri
- Kolay güncelleme

### 4. Kullanıcı Deneyimi
- Sezgisel arayüz
- Canlı önizleme
- Mobil uyumlu

---

## 🔮 Gelecek Geliştirmeler

### Kısa Vadeli
- [ ] Özel logo yükleme
- [ ] Arka plan resmi seçimi
- [ ] Renk paleti özelleştirme
- [ ] Font seçimi

### Orta Vadeli
- [ ] Özel CSS ekleme
- [ ] Widget sistemi
- [ ] Çoklu sayfa desteği
- [ ] A/B testing

### Uzun Vadeli
- [ ] Drag & drop editor
- [ ] Tema marketplace
- [ ] White-label çözümü
- [ ] API entegrasyonları

---

## 📚 Dosya Yapısı

```
dugunproje/
├── lib/
│   └── themes.ts                    # ✨ Tema konfigürasyonları
│
├── app/
│   ├── e/[eventSlug]/
│   │   └── page.tsx                 # ✨ Dinamik misafir sayfası
│   │
│   └── dashboard/
│       └── events/[eventId]/
│           ├── edit/page.tsx        # ✨ Özelleştirme sayfası
│           └── card/page.tsx        # QR kod ve paylaşım
│
├── components/
│   ├── UploadFormNew.tsx            # Tema destekli form
│   └── GalleryNew.tsx               # Tema destekli galeri
│
└── scripts/
    └── setup-db.sql                 # Güncellenmiş şema
```

---

## 🧪 Test Senaryoları

### 1. Tema Değişimi Testi
```
1. Dashboard'da "Düğün" seç → Pembe tema
2. "Sünnet" seç → Yeşil tema
3. Misafir sayfasını aç → Doğru tema yüklendi mi?
```

### 2. Özelleştirme Testi
```
1. Edit sayfasında başlığı değiştir
2. Canlı önizlemede görün
3. Kaydet
4. Misafir sayfasında kontrol et
```

### 3. QR Kod Testi
```
1. QR kod oluştur
2. Mobil cihazla oku
3. Doğru sayfaya yönlendir mi?
4. Tema doğru yüklendi mi?
```

---

## 💡 İpuçları

### Performans
- Temalar statik olarak tanımlanmış (hızlı)
- CSS-in-JS yerine Tailwind (optimize)
- Lazy loading (gerektiğinde yükle)

### SEO
- Dinamik meta tags
- Slug bazlı URL'ler
- Sosyal medya önizlemeleri

### Güvenlik
- Slug validasyonu
- XSS koruması
- Rate limiting

---

💚 **Dinamik Tema Sistemi Hazır!**

Artık her etkinlik türü için otomatik olarak uygun tema yükleniyor! 🎨
