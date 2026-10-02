import Image from 'next/image'
import Link from 'next/link'
import heroEditorial from '../public/hero-editorial-no-text.png'
import styles from './page.module.css'

const features = [
  ['01', 'Anıları topla', 'Misafirlerinin çektiği tüm fotoğraf ve videolar tek bir seçkide buluşur.'],
  ['02', 'Kendi alanını yarat', 'Etkinliğine ait yalın, kişisel ve zamansız bir dijital galeri oluştur.'],
  ['03', 'Tek hareketle paylaş', 'QR kodunu paylaş; herkes anında ortak anı alanına katılsın.'],
  ['04', 'Her zaman sakla', 'En değerli karelerin güvenli ve düzenli biçimde seninle kalsın.'],
]

const eventTypes = ['Düğün', 'Nişan', 'Kına', 'Doğum günü', 'Sünnet', 'Diğer']

const steps = [
  ['01', 'Etkinliğini oluştur', 'İsimleri, tarihi ve karşılama mesajını ekle. Sana özel bağlantın ve QR kodun anında hazır olsun.'],
  ['02', 'QR kodunu paylaş', 'Masa kartlarına yerleştir, davetiyene ekle veya ekrandan göster. Uygulama indirmeye gerek yok.'],
  ['03', 'Anıları biriktir', 'Davetlilerin fotoğraf, video ve mesajları gecenin akışında tek bir özel galeride buluşsun.'],
]

const testimonials = [
  ['“Ertesi sabah düğünümüzü 86 farklı gözden yeniden yaşadık.”', 'SELİN & EMRE — İSTANBUL'],
  ['“Büyüklerimiz bile QR kodu okutup saniyeler içinde fotoğraf yükledi.”', 'ECE & CAN — İZMİR'],
  ['“Fotoğrafçı karelerinin yanında en samimi anlar da artık bizimle.”', 'DERYA & MERT — ANKARA'],
]

const faqs = [
  ['Davetlilerin uygulama indirmesi gerekiyor mu?', 'Hayır. QR kodu telefon kamerasıyla okutmaları yeterli; tüm deneyim mobil tarayıcıda çalışır.'],
  ['Yüklenen fotoğrafları kontrol edebilir miyiz?', 'Evet. İsterseniz içerikleri doğrudan yayınlayabilir, isterseniz yalnızca onayladıklarınızı gösterebilirsiniz.'],
  ['Fotoğraf ve videoların kalitesi korunur mu?', 'Orijinal dosyalar arşivinizde korunur; hızlı görüntüleme için ayrıca optimize edilmiş önizlemeler kullanılır.'],
  ['Etkinlikten sonra anılar ne kadar saklanır?', 'Saklama süresi seçtiğiniz pakete göre 3 aydan 24 aya kadar değişir. Süre dolmadan tüm arşivi indirebilirsiniz.'],
]

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <button className={styles.menuButton} aria-label="Menüyü aç">
          <span /><span />
        </button>
        <Link href="/" className={styles.logo} aria-label="Ana sayfa">ÖZEL ANLAR</Link>
        <nav className={styles.utilityNav} aria-label="Hesap menüsü">
          <a href="#nasil-calisir">NASIL ÇALIŞIR</a>
          <Link href="/pricing">FİYATLAR</Link>
          <Link href="/demo">DEMO</Link>
          <Link href="/login">GİRİŞ YAP</Link>
          <Link href="/register">KAYDOL</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src={heroEditorial}
          alt="Düğün hazırlıklarından üç parçalı editoryal bir sahne"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p>THE MEMORY EDIT / 2026</p>
          <h1 id="hero-title">ÖZEL ANLAR.<br />BİR ARADA.</h1>
          <Link href="/register">ŞİMDİ BAŞLA</Link>
        </div>
        <a href="#manifesto" className={styles.scrollCue}>AŞAĞI KAYDIRIN</a>
      </section>

      <section id="nasil-calisir" className={styles.how} aria-labelledby="how-title">
        <div className={styles.eyebrowRow}><p>ÜÇ BASİT ADIM</p><span>01 / 03</span></div>
        <h2 id="how-title">DAVETLİLER ÇEKSİN.<br />SİZ HEP SAKLAYIN.</h2>
        <div className={styles.stepGrid}>
          {steps.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span><h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="manifesto" className={styles.manifesto}>
        <p className={styles.kicker}>DİJİTAL ANI PLATFORMU</p>
        <h2>Bir gece.<br />Yüzlerce bakış.<br />Tek bir hafıza.</h2>
        <p className={styles.manifestoText}>
          Kutlamanı yalnızca yaşama. Herkesin gözünden yeniden gör.
          Davetlilerinin çektiği anlar tek bir zamansız seçkide buluşur.
        </p>
      </section>

      <section className={styles.productStrip} aria-label="Platform özellikleri">
        <p>UYGULAMASIZ ERİŞİM</p><p>ORİJİNAL KALİTE</p><p>CANLI SLAYT</p><p>DİJİTAL ANI DEFTERİ</p>
      </section>

      <section className={styles.demo}>
        <div>
          <p className={styles.kicker}>CANLI DENEYİM</p>
          <h2>ÖNCE<br />MİSAFİR OL.</h2>
        </div>
        <div className={styles.demoCopy}>
          <p>Örnek bir düğüne katıl, fotoğraf yükleme akışını gör ve ortak galerinin nasıl hissettirdiğini keşfet.</p>
          <Link href="/demo">DEMoyu DENE <span>↗</span></Link>
        </div>
      </section>

      <section className={styles.testimonials} aria-labelledby="stories-title">
        <div className={styles.sectionHead}><p>ÇİFTLERİN GÖZÜNDEN</p><h2 id="stories-title">BİRLİKTE<br />HATIRLANANLAR</h2></div>
        <div className={styles.quoteGrid}>
          {testimonials.map(([quote, author]) => <blockquote key={author}><p>{quote}</p><footer>{author}</footer></blockquote>)}
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="faq-title">
        <div><p className={styles.kicker}>MERAK EDİLENLER</p><h2 id="faq-title">KISA<br />CEVAPLAR.</h2></div>
        <div className={styles.faqList}>{faqs.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
      </section>

      <section id="ozellikler" className={styles.features} aria-labelledby="features-title">
        <div className={styles.sectionHead}>
          <p>KOLEKSİYON / 01—04</p>
          <h2 id="features-title">ANININ<br />YENİ FORMU</h2>
        </div>
        <ol>
          {features.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.imageStatement}>
        <div className={styles.crop} aria-hidden="true">
          <Image src={heroEditorial} alt="" fill sizes="100vw" className={styles.cropImage} />
        </div>
        <p>HERKESİN<br />GÖZÜNDEN</p>
      </section>

      <section className={styles.events} aria-labelledby="events-title">
        <div className={styles.sectionHead}>
          <p>HER BULUŞMA İÇİN</p>
          <h2 id="events-title">SENİN<br />HİKÂYEN</h2>
        </div>
        <div className={styles.eventLinks}>
          {eventTypes.map((event, index) => (
            <Link href="/register" key={event}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{event}</strong>
              <i aria-hidden="true">↗</i>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <p>İLK ETKİNLİĞİNİ OLUŞTUR</p>
        <h2>BİRLİKTE<br />YARATALIM.</h2>
        <Link href="/register">KAYDOL VE KEŞFET</Link>
      </section>

      <footer className={styles.footer}>
        <div>
          <p>ÖZEL ANLAR</p>
          <Link href="/register">İLK ETKİNLİĞİNİ OLUŞTUR</Link>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 TÜM HAKLARI SAKLIDIR</span>
          <Link href="/pricing">FİYATLANDIRMA</Link>
          <Link href="/demo">DEMO</Link>
          <Link href="/contact">İLETİŞİM</Link>
          <Link href="/login">GİRİŞ</Link>
          <Link href="/register">KAYIT</Link>
          <span>TÜRKİYE / TR</span>
        </div>
      </footer>
    </main>
  )
}
