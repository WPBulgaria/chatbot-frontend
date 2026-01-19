import { ChatWithMessages } from '../../api/chats-api'
import { Button } from '@headlessui/react'
import { MarkdownMessage } from '../Messages/MarkdownMessage'
import { useTheme } from '../../lib/ThemeContext'

export const ViewChat = ({ viewingChat, handleBackToChat }: { viewingChat: ChatWithMessages, handleBackToChat: () => void }) => {
  const theme = useTheme()

  return (
    <div className="chat-container conversation-readonly">
      {/* Header with back button */}
      <header className="chat-header">
        <Button
          onClick={handleBackToChat}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors mr-2"
          style={{ color: theme.colors.textMuted }}
          aria-label={theme.labels.backButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold truncate" style={{ color: theme.colors.textDark }}>
            {viewingChat.title || theme.labels.historyUntitled}
          </h1>
          <p className="text-sm" style={{ color: theme.colors.textMuted }}>
            {new Date(viewingChat.createdAt).toLocaleDateString('bg-BG', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6" style={{
        paddingLeft: 'max(1.5rem, calc((100% - 800px) / 2))',
        paddingRight: 'max(1.5rem, calc((100% - 800px) / 2))',
      }}>
        {viewingChat.messages.map((message) => (
          <div
            key={message.id}
            className={`mb-5 ${message.role === 'user' ? 'text-right' : ''}`}
          >
            <div
              className="inline-block max-w-[85%] px-5 py-4 text-base leading-relaxed"
              style={{
                backgroundColor: message.role === 'user' 
                  ? theme.colors.userMessageBg 
                  : theme.colors.botMessageBg,
                color: message.role === 'user' 
                  ? theme.colors.userMessageText 
                  : theme.colors.botMessageText,
                borderRadius: message.role === 'user'
                  ? `${theme.borderRadius.message} 4px ${theme.borderRadius.message} ${theme.borderRadius.message}`
                  : `4px ${theme.borderRadius.message} ${theme.borderRadius.message} ${theme.borderRadius.message}`,
                boxShadow: message.role === 'user' 
                  ? theme.shadows.userMessage 
                  : theme.shadows.botMessage,
              }}
            >
              <MarkdownMessage message={{data: {text: message.content}}} />
            </div>
          </div>
        ))}
      </div>

      {/* Read-only notice */}
      <div className="readonly-notice">
        <span>{theme.labels.readOnlyNotice}</span>
        <button
          onClick={handleBackToChat}
          className="ml-2 font-medium hover:underline"
          style={{ color: theme.colors.primary }}
        >
          {theme.labels.startNewChat}
        </button>
      </div>
    </div>
  )
}
