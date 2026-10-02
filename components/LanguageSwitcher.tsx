'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname()
  
  const switchLang = (newLang: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLang
    return segments.join('/')
  }

  return (
    <div className="absolute top-6 right-6 flex gap-2 bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-lg border border-[#BBDEFB]">
      <Link
        href={switchLang('tr')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          currentLang === 'tr'
            ? 'bg-[#42A5F5] text-white shadow-md'
            : 'text-[#42A5F5] hover:bg-[#E3F2FD]'
        }`}
      >
        TR
      </Link>
      <Link
        href={switchLang('en')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          currentLang === 'en'
            ? 'bg-[#42A5F5] text-white shadow-md'
            : 'text-[#42A5F5] hover:bg-[#E3F2FD]'
        }`}
      >
        EN
      </Link>
    </div>
  )
}
