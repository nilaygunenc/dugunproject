'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import heroEditorial from '../../public/hero-editorial-no-text.png'
import styles from '../auth.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Kayıt başarısız')
      router.push('/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={`${styles.authPage} ${styles.registerPage}`}>
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
        <p className={styles.visualMessage}>İLK ANIYI<br />BİRLİKTE BAŞLAT.</p>
        <span className={styles.visualIndex}>02 / KAYIT</span>
      </section>

      <section className={styles.panel}>
        <header className={styles.panelHeader}>
          <Link href="/">← ANA SAYFA</Link>
          <Link href="/login">GİRİŞ YAP</Link>
        </header>

        <div className={styles.formWrap}>
          <p className={styles.kicker}>YENİ BİR ALAN AÇIN</p>
          <h1>Hikâyeniz<br />burada başlar.</h1>
          <p className={styles.intro}>İlk etkinliğinizi birkaç adımda oluşturun.</p>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="fullName">AD SOYAD</label>
              <input
                type="text"
                id="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                placeholder="Adınız Soyadınız"
                required
                disabled={loading}
              />
            </div>

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

            <div className={styles.twoFields}>
              <div className={styles.field}>
                <label htmlFor="password">ŞİFRE</label>
                <input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  placeholder="En az 6 karakter"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword">ŞİFRE TEKRAR</label>
                <input
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                  placeholder="Şifrenizi tekrarlayın"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.submit}>
              <span>{loading ? 'HESAP OLUŞTURULUYOR' : 'HESAP OLUŞTUR'}</span>
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <p className={styles.switchText}>
            ZATEN HESABINIZ VAR MI? <Link href="/login">GİRİŞ YAPIN</Link>
          </p>
        </div>

        <footer className={styles.panelFooter}>
          <span>GÜVENLİ KAYIT</span>
          <span>TR / 2026</span>
        </footer>
      </section>
    </main>
  )
}
