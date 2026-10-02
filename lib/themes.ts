// Tema Tipleri
export type EventType = 'wedding' | 'birthday' | 'engagement' | 'henna' | 'circumcision' | 'other'

export interface Theme {
  id: EventType
  name: string
  icon: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    textLight: string
  }
  gradients: {
    hero: string
    card: string
    button: string
  }
  fonts: {
    heading: string
    body: string
  }
  borderRadius: string
  shadows: {
    card: string
    button: string
  }
}

// Tema Konfigürasyonları
export const THEMES: Record<EventType, Theme> = {
  wedding: {
    id: 'wedding',
    name: 'Düğün',
    icon: '💍',
    colors: {
      primary: '#FF6B9D',
      secondary: '#FFC2D1',
      accent: '#FFE5EC',
      background: '#FFF5F7',
      text: '#4A1942',
      textLight: '#8B5A83',
    },
    gradients: {
      hero: 'from-pink-100 via-rose-50 to-pink-100',
      card: 'from-pink-50 to-rose-50',
      button: 'from-pink-400 to-rose-500',
    },
    fonts: {
      heading: 'font-serif',
      body: 'font-sans',
    },
    borderRadius: 'rounded-3xl',
    shadows: {
      card: 'shadow-xl shadow-pink-200/50',
      button: 'shadow-lg shadow-pink-300/50',
    },
  },
  
  birthday: {
    id: 'birthday',
    name: 'Doğum Günü',
    icon: '🎂',
    colors: {
      primary: '#4A90E2',
      secondary: '#7CB9E8',
      accent: '#B3D9FF',
      background: '#F0F8FF',
      text: '#1E3A5F',
      textLight: '#4A6FA5',
    },
    gradients: {
      hero: 'from-blue-100 via-cyan-50 to-blue-100',
      card: 'from-blue-50 to-cyan-50',
      button: 'from-blue-400 to-cyan-500',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-sans',
    },
    borderRadius: 'rounded-2xl',
    shadows: {
      card: 'shadow-xl shadow-blue-200/50',
      button: 'shadow-lg shadow-blue-300/50',
    },
  },
  
  engagement: {
    id: 'engagement',
    name: 'Nişan',
    icon: '💎',
    colors: {
      primary: '#9B59B6',
      secondary: '#C39BD3',
      accent: '#E8DAEF',
      background: '#F8F3FF',
      text: '#4A235A',
      textLight: '#7D3C98',
    },
    gradients: {
      hero: 'from-purple-100 via-pink-50 to-purple-100',
      card: 'from-purple-50 to-pink-50',
      button: 'from-purple-400 to-pink-500',
    },
    fonts: {
      heading: 'font-serif',
      body: 'font-sans',
    },
    borderRadius: 'rounded-3xl',
    shadows: {
      card: 'shadow-xl shadow-purple-200/50',
      button: 'shadow-lg shadow-purple-300/50',
    },
  },
  
  henna: {
    id: 'henna',
    name: 'Kına Gecesi',
    icon: '🎨',
    colors: {
      primary: '#E67E22',
      secondary: '#F39C12',
      accent: '#FAD7A0',
      background: '#FFF8F0',
      text: '#6E2C00',
      textLight: '#A04000',
    },
    gradients: {
      hero: 'from-orange-100 via-amber-50 to-orange-100',
      card: 'from-orange-50 to-amber-50',
      button: 'from-orange-400 to-red-500',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-sans',
    },
    borderRadius: 'rounded-2xl',
    shadows: {
      card: 'shadow-xl shadow-orange-200/50',
      button: 'shadow-lg shadow-orange-300/50',
    },
  },
  
  circumcision: {
    id: 'circumcision',
    name: 'Sünnet Düğünü',
    icon: '🎉',
    colors: {
      primary: '#27AE60',
      secondary: '#58D68D',
      accent: '#ABEBC6',
      background: '#F0FFF4',
      text: '#145A32',
      textLight: '#239B56',
    },
    gradients: {
      hero: 'from-green-100 via-emerald-50 to-green-100',
      card: 'from-green-50 to-emerald-50',
      button: 'from-green-400 to-emerald-500',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-sans',
    },
    borderRadius: 'rounded-2xl',
    shadows: {
      card: 'shadow-xl shadow-green-200/50',
      button: 'shadow-lg shadow-green-300/50',
    },
  },
  
  other: {
    id: 'other',
    name: 'Diğer Etkinlikler',
    icon: '✨',
    colors: {
      primary: '#5B4FE9',
      secondary: '#8B7FE8',
      accent: '#C4BFFF',
      background: '#F5F3FF',
      text: '#2D1B69',
      textLight: '#5B4FE9',
    },
    gradients: {
      hero: 'from-indigo-100 via-purple-50 to-indigo-100',
      card: 'from-indigo-50 to-purple-50',
      button: 'from-indigo-400 to-purple-500',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-sans',
    },
    borderRadius: 'rounded-3xl',
    shadows: {
      card: 'shadow-xl shadow-indigo-200/50',
      button: 'shadow-lg shadow-indigo-300/50',
    },
  },
}

// Tema Helper Fonksiyonları
export function getTheme(eventType: EventType): Theme {
  const selected = THEMES[eventType] || THEMES.other
  return {
    ...selected,
    colors: {
      primary: '#2C3E35',
      secondary: '#4A6B5D',
      accent: '#D4AF37',
      background: '#FAFAF7',
      text: '#17251F',
      textLight: '#626A65',
    },
    gradients: {
      hero: 'from-cream via-sage-50 to-peach-50',
      card: 'from-white to-sage-50',
      button: 'from-earth-800 to-sage-700',
    },
    fonts: { heading: 'font-serif', body: 'font-sans' },
    borderRadius: 'rounded-2xl',
    shadows: { card: 'shadow-xl shadow-earth-900/10', button: 'shadow-lg shadow-earth-900/20' },
  }
}

export function getThemeColors(eventType: EventType) {
  return getTheme(eventType).colors
}

export function getThemeGradients(eventType: EventType) {
  return getTheme(eventType).gradients
}

// CSS Variables oluştur (dinamik tema için)
export function generateThemeCSS(theme: Theme): string {
  return `
    --theme-primary: ${theme.colors.primary};
    --theme-secondary: ${theme.colors.secondary};
    --theme-accent: ${theme.colors.accent};
    --theme-background: ${theme.colors.background};
    --theme-text: ${theme.colors.text};
    --theme-text-light: ${theme.colors.textLight};
  `
}
