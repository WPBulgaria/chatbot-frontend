import { ReactNode } from 'react'

export interface ChatTheme {
  // Branding
  branding: {
    name: string
    logo?: string | ReactNode  // URL or custom component
    statusText: string
    statusOnline: boolean
  }

  // Colors
  colors: {
    primary: string
    primaryHover: string
    secondaryBg: string
    textDark: string
    textMuted: string
    border: string
    // Message bubbles
    botMessageBg: string
    botMessageText: string
    userMessageBg: string
    userMessageText: string
    // Code blocks
    codeBg: string
    codeText: string
    codeBlockBg: string
    codeBlockText: string
  }

  // Typography
  typography: {
    fontFamily: string
    fontUrl?: string  // Google Fonts or custom font URL
  }

  // Labels & Text (i18n ready)
  labels: {
    // Header
    headerTitle: string
    headerStatus: string
    historyButtonTitle: string
    moreOptionsTitle: string

    // Chat
    welcomeMessage: string
    inputPlaceholder: string
    sendButton: string
    loadingMessage: string
    errorMessage: string

    // History Modal
    historyTitle: string
    historySubtitle: string
    historyEmpty: string
    historyEmptyHint: string
    historyLoading: string
    historyUntitled: string

    // Date labels
    dateToday: string
    dateYesterday: string
    dateDaysAgo: (days: number) => string

    // View Chat (read-only)
    readOnlyNotice: string
    startNewChat: string
    backButton: string
  }

  // Backgrounds
  backgrounds: {
    page: string        // CSS value (gradient, color, image)
    header: string
    inputArea: string
    modal: string
    modalBackdrop: string
  }

  // Shadows
  shadows: {
    botMessage: string
    userMessage: string
    button: string
    modal: string
  }

  // Border radius
  borderRadius: {
    message: string
    input: string
    button: string
    avatar: string
    modal: string
  }
}

export const defaultTheme: ChatTheme = {
  branding: {
    name: 'WP Помощник',
    logo: undefined,  // Uses default robot icon
    statusText: 'Онлайн',
    statusOnline: true,
  },

  colors: {
    primary: '#00BFA5',
    primaryHover: '#00a892',
    secondaryBg: '#EEF4FB',
    textDark: '#1a2744',
    textMuted: '#64748b',
    border: '#e2e8f0',
    botMessageBg: '#ffffff',
    botMessageText: '#1a2744',
    userMessageBg: '#00BFA5',
    userMessageText: '#ffffff',
    codeBg: '#EEF4FB',
    codeText: '#d946ef',
    codeBlockBg: '#1a2744',
    codeBlockText: '#e2e8f0',
  },

  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  },

  labels: {
    // Header
    headerTitle: 'WP Помощник',
    headerStatus: 'Онлайн',
    historyButtonTitle: 'История на разговорите',
    moreOptionsTitle: 'Още опции',

    // Chat
    welcomeMessage: 'Здравей, за какво имаш нужда от помощ за WordPress?',
    inputPlaceholder: 'Напиши съобщение...',
    sendButton: 'Изпрати',
    loadingMessage: 'Генериране на отговор...',
    errorMessage: 'Съжалявам, не мога да се свържа със сървъра. Моля, опитай отново по-късно.',

    // History Modal
    historyTitle: 'История на разговорите',
    historySubtitle: 'Преглед на предишни чатове',
    historyEmpty: 'Няма предишни разговори',
    historyEmptyHint: 'Започнете нов чат, за да видите историята тук',
    historyLoading: 'Зареждане...',
    historyUntitled: 'Разговор без заглавие',

    // Date labels
    dateToday: 'Днес',
    dateYesterday: 'Вчера',
    dateDaysAgo: (days: number) => `Преди ${days} дни`,

    // View Chat
    readOnlyNotice: 'Този разговор е само за четене',
    startNewChat: 'Започнете нов чат',
    backButton: 'Назад',
  },

  backgrounds: {
    page: 'linear-gradient(180deg, #EEF4FB 0%, #e2ecf7 50%, #EEF4FB 100%)',
    header: '#ffffff',
    inputArea: '#ffffff',
    modal: '#ffffff',
    modalBackdrop: 'rgba(0, 0, 0, 0.4)',
  },

  shadows: {
    botMessage: '0 2px 8px rgba(0, 0, 0, 0.06)',
    userMessage: '0 2px 8px rgba(0, 191, 165, 0.25)',
    button: '0 4px 12px rgba(0, 191, 165, 0.3)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  borderRadius: {
    message: '20px',
    input: '9999px',
    button: '9999px',
    avatar: '9999px',
    modal: '16px',
  },
}

// Partial theme type for overrides
export interface PartialChatTheme {
  branding?: Partial<ChatTheme['branding']>
  colors?: Partial<ChatTheme['colors']>
  typography?: Partial<ChatTheme['typography']>
  labels?: Partial<ChatTheme['labels']>
  backgrounds?: Partial<ChatTheme['backgrounds']>
  shadows?: Partial<ChatTheme['shadows']>
  borderRadius?: Partial<ChatTheme['borderRadius']>
}

// Helper to merge partial theme with defaults
export const createTheme = (overrides: PartialChatTheme = {}): ChatTheme => {
  return {
    branding: { ...defaultTheme.branding, ...overrides.branding },
    colors: { ...defaultTheme.colors, ...overrides.colors },
    typography: { ...defaultTheme.typography, ...overrides.typography },
    labels: { ...defaultTheme.labels, ...overrides.labels },
    backgrounds: { ...defaultTheme.backgrounds, ...overrides.backgrounds },
    shadows: { ...defaultTheme.shadows, ...overrides.shadows },
    borderRadius: { ...defaultTheme.borderRadius, ...overrides.borderRadius },
  }
}
