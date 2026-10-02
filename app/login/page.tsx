'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import heroEditorial from '../../public/hero-editorial-no-text.png'
import styles from '../auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Giriş başarısız')
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.visual} aria-label="Düğün editoryali">
        <Image
          src={heroEditorial}
          alt="Düğün hazırlıklarından editoryal bir sahne"
          fill
          priority
          sizes="(max-width: 800px) 100vw, 50vw"
          className={styles.visualImage}
        />
        <div className={styles.visualShade} />
        <Link href="/" className={styles.visualHome}>ÖZEL ANLAR</Link>
        <p className={styles.visualMessage}>HER ANIYA<br />YENİDEN DÖN.</p>
        <span className={styles.visualIndex}>01 / GİRİŞ</span>
      </section>

      <section className={styles.panel}>
        <header className={styles.panelHeader}>
          <Link href="/">← ANA SAYFA</Link>
          <Link href="/register">KAYDOL</Link>
        </header>

        <div className={styles.formWrap}>
          <p className={styles.kicker}>HESABINIZA ERİŞİN</p>
          <h1>Tekrar<br />hoş geldiniz.</h1>
          <p className={styles.intro}>Anılarınız sizi bekliyor.</p>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">E-POSTA</label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                placeholder="ornek@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">ŞİFRE</label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                placeholder="Şifreniz"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submit}>
              <span>{loading ? 'GİRİŞ YAPILIYOR' : 'GİRİŞ YAP'}</span>
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <p className={styles.switchText}>
            HESABINIZ YOK MU? <Link href="/register">HESAP OLUŞTURUN</Link>
          </p>
        </div>

        <footer className={styles.panelFooter}>
          <span>GÜVENLİ ERİŞİM</span>
          <span>TR / 2026</span>
        </footer>
      </section>
    </main>
  )
}
