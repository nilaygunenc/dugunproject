'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import styles from './dashboard.module.css'

type DashboardEvent = {
  id: number
  event_name: string
  event_type: string
  event_date: string
  slug: string
  package_type?: string
  media_count?: number
  guest_count?: number
}

const demoEvent: DashboardEvent = {
  id: 1,
  event_name: 'Ayşe & Mehmet',
  event_type: 'Düğün',
  event_date: '2026-09-12',
  slug: 'ayse-mehmet',
  package_type: 'Premium',
  media_count: 248,
  guest_count: 86,
}

function daysUntil(date: string) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000))
}

export default function DashboardPage() {
  const router = useRouter()
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/events')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload) => active && setEvents(payload.data ?? []))
      .catch(() => active && setEvents([]))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const activeEvent = events[0] ?? demoEvent
  const stats = useMemo(() => [
    ['TOPLAM ANI', String(activeEvent.media_count ?? 248).padStart(3, '0'), 'Fotoğraf ve video'],
    ['KATILAN DAVETLİ', String(activeEvent.guest_count ?? 86).padStart(2, '0'), 'Bağlantıyı açan kişi'],
    ['KALAN GÜN', String(daysUntil(activeEvent.event_date)).padStart(2, '0'), 'Büyük güne kadar'],
  ], [activeEvent])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>ÖZEL<br />ANLAR</Link>
        <nav aria-label="Panel menüsü">
          <Link className={styles.active} href="/dashboard"><span>01</span> Genel Bakış</Link>
          <Link href={`/dashboard/events/${activeEvent.id}/edit`}><span>02</span> Etkinlik Ayarları</Link>
          <Link href={`/e/${activeEvent.slug}`}><span>03</span> Galeri & Anılar</Link>
          <Link href={`/dashboard/events/${activeEvent.id}/card`}><span>04</span> QR Materyalleri</Link>
          <Link href={`/e/${activeEvent.slug}?view=slideshow`}><span>05</span> Canlı Gösterim</Link>
        </nav>
        <div className={styles.sideBottom}>
          <Link href="/contact">Yardım & Destek</Link>
          <button onClick={logout}>Çıkış Yap</button>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <button className={styles.mobileBrand} aria-label="Menüyü aç">ÖZEL ANLAR</button>
          <div><span className={styles.liveDot} /> ETKİNLİK AKTİF</div>
          <button className={styles.profile} aria-label="Profil menüsü"><span>NA</span><b>Nilay Akın</b></button>
        </header>

        <div className={styles.canvas}>
          <section className={styles.welcome}>
            <div>
              <p className={styles.eyebrow}>GENEL BAKIŞ / {new Date().toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' }).toUpperCase()}</p>
              <h1>Günaydın,<br /><em>Nilay.</em></h1>
            </div>
            <Link className={styles.primaryButton} href="/dashboard/events/create">YENİ ETKİNLİK <span>＋</span></Link>
          </section>

          <section className={styles.eventHero}>
            <div className={styles.eventInfo}>
              <p className={styles.eyebrow}>YAKLAŞAN ETKİNLİK</p>
              <div className={styles.eventMeta}><span>{activeEvent.event_type}</span><span>•</span><span>{activeEvent.package_type ?? 'Premium'} Paket</span></div>
              <h2>{activeEvent.event_name.replace(' & ', '\n& ')}</h2>
              <p className={styles.date}>{new Date(activeEvent.event_date).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })}</p>
              <div className={styles.eventActions}>
                <Link href={`/e/${activeEvent.slug}`}>ETKİNLİĞİ GÖR <span>↗</span></Link>
                <Link href={`/dashboard/events/${activeEvent.id}/edit`}>DÜZENLE</Link>
              </div>
            </div>
            <div className={styles.eventImage} aria-hidden="true"><span>{daysUntil(activeEvent.event_date)}</span><small>GÜN KALDI</small></div>
          </section>

          <section className={styles.stats} aria-label="Etkinlik özeti">
            {stats.map(([label, value, detail]) => <article key={label}><p>{label}</p><strong>{loading ? '—' : value}</strong><span>{detail}</span></article>)}
          </section>

          <section className={styles.lowerGrid}>
            <div className={styles.quickPanel}>
              <div className={styles.sectionTitle}><div><p className={styles.eyebrow}>KISAYOLLAR</p><h2>Geceniz için<br />her şey hazır.</h2></div><span>04 ARAÇ</span></div>
              <div className={styles.quickGrid}>
                <Link href={`/dashboard/events/${activeEvent.id}/card`}><i>QR</i><strong>QR kodunu indir</strong><span>Masa kartları ve baskı dosyaları</span><b>→</b></Link>
                <Link href={`/e/${activeEvent.slug}?view=slideshow`}><i>▶</i><strong>Canlı gösterimi başlat</strong><span>TV ve projeksiyon için tam ekran</span><b>→</b></Link>
                <Link href={`/e/${activeEvent.slug}`}><i>▦</i><strong>Galeriyi yönet</strong><span>Onayla, öne çıkar veya gizle</span><b>→</b></Link>
                <Link href={`/dashboard/events/${activeEvent.id}/edit`}><i>⚙</i><strong>Etkinlik ayarları</strong><span>Gizlilik, metinler ve görünüm</span><b>→</b></Link>
              </div>
            </div>
            <aside className={styles.activity}>
              <p className={styles.eyebrow}>SON HAREKETLER</p>
              <h2>Anılar akıyor.</h2>
              <ul>
                <li><span className={styles.avatar}>EY</span><div><b>Elif Yılmaz</b><p>3 yeni fotoğraf yükledi</p></div><time>2 dk</time></li>
                <li><span className={styles.avatar}>MK</span><div><b>Mert Kaya</b><p>Anı defterine yazdı</p></div><time>18 dk</time></li>
                <li><span className={styles.avatar}>SD</span><div><b>Selin Demir</b><p>1 video yükledi</p></div><time>1 sa</time></li>
              </ul>
              <Link href={`/e/${activeEvent.slug}`}>TÜM HAREKETLERİ GÖR →</Link>
            </aside>
          </section>
        </div>
      </section>
    </main>
  )
}
