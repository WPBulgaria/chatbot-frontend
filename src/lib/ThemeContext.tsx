import { createContext, useContext, useEffect, ReactNode } from 'react'
import { ChatTheme, defaultTheme } from './theme'

const ThemeContext = createContext<ChatTheme>(defaultTheme)

export const useTheme = () => useContext(ThemeContext)

interface ThemeProviderProps {
  theme: ChatTheme
  children: ReactNode
}

export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => {
  // Apply CSS variables to :root when theme changes
  useEffect(() => {
    const root = document.documentElement

    // Colors
    root.style.setProperty('--primary-color', theme.colors.primary)
    root.style.setProperty('--primary-hover', theme.colors.primaryHover)
    root.style.setProperty('--secondary-bg', theme.colors.secondaryBg)
    root.style.setProperty('--text-dark', theme.colors.textDark)
    root.style.setProperty('--text-muted', theme.colors.textMuted)
    root.style.setProperty('--border-color', theme.colors.border)
    root.style.setProperty('--bot-message-bg', theme.colors.botMessageBg)
    root.style.setProperty('--bot-message-text', theme.colors.botMessageText)
    root.style.setProperty('--user-message-bg', theme.colors.userMessageBg)
    root.style.setProperty('--user-message-text', theme.colors.userMessageText)
    root.style.setProperty('--code-bg', theme.colors.codeBg)
    root.style.setProperty('--code-text', theme.colors.codeText)
    root.style.setProperty('--code-block-bg', theme.colors.codeBlockBg)
    root.style.setProperty('--code-block-text', theme.colors.codeBlockText)

    // Typography
    root.style.setProperty('--font-family', theme.typography.fontFamily)

    // Backgrounds
    root.style.setProperty('--page-bg', theme.backgrounds.page)
    root.style.setProperty('--header-bg', theme.backgrounds.header)
    root.style.setProperty('--input-area-bg', theme.backgrounds.inputArea)
    root.style.setProperty('--modal-bg', theme.backgrounds.modal)
    root.style.setProperty('--modal-backdrop', theme.backgrounds.modalBackdrop)

    // Shadows
    root.style.setProperty('--shadow-bot-message', theme.shadows.botMessage)
    root.style.setProperty('--shadow-user-message', theme.shadows.userMessage)
    root.style.setProperty('--shadow-button', theme.shadows.button)
    root.style.setProperty('--shadow-modal', theme.shadows.modal)

    // Border radius
    root.style.setProperty('--radius-message', theme.borderRadius.message)
    root.style.setProperty('--radius-input', theme.borderRadius.input)
    root.style.setProperty('--radius-button', theme.borderRadius.button)
    root.style.setProperty('--radius-avatar', theme.borderRadius.avatar)
    root.style.setProperty('--radius-modal', theme.borderRadius.modal)

    // Load custom font if provided
    if (theme.typography.fontUrl) {
      const existingLink = document.querySelector('link[data-theme-font]')
      if (existingLink) {
        existingLink.setAttribute('href', theme.typography.fontUrl)
      } else {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = theme.typography.fontUrl
        link.setAttribute('data-theme-font', 'true')
        document.head.appendChild(link)
      }
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
