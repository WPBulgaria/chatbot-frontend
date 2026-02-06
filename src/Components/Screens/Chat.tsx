import { ChatWithMessages } from '../../api/chats-api'
import { useRef, useState, useEffect } from 'react'
import { stream as chatAction, bot } from '../../lib/stream'
import { BotUI, BotUIMessageList, BotUIAction } from '@botui/react'
import { ConversationsModal } from '../Modals/ConversationsModal'
import { messageRenderers } from '../../lib/constants'
import { actionRenderers } from '../../lib/constants'
import { useTheme } from '../../lib/ThemeContext'
import {Button} from '@headlessui/react'	
import { useChatbotConfig } from '../../lib/ChatbotConfigContext'

// Default robot logo component
const RobotLogo = ({ primaryColor }: { primaryColor: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    {/* Antenna */}
    <circle cx="12" cy="2" r="1.5" />
    <rect x="11" y="3" width="2" height="3" />
    {/* Head */}
    <rect x="4" y="6" width="16" height="12" rx="2" />
    {/* Eyes */}
    <circle cx="9" cy="11" r="2" fill={primaryColor} />
    <circle cx="15" cy="11" r="2" fill={primaryColor} />
    {/* Mouth */}
    <rect x="8" y="14" width="8" height="2" rx="1" fill={primaryColor} />
    {/* Ears */}
    <rect x="1" y="9" width="3" height="4" rx="1" />
    <rect x="20" y="9" width="3" height="4" rx="1" />
  </svg>
)

export const Chat = ({ setViewingChat }: { backToChat: () => void, setViewingChat: (chat: ChatWithMessages) => void }) => {
  const theme = useTheme()
  const isActiveRef = useRef<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { chatbotId, streamingType, mercureHost, nodeHost } = useChatbotConfig()  

  useEffect(() => {
    if (isActiveRef.current) return
    isActiveRef.current = true

    chatAction(chatbotId, 0, {
      streamingType: streamingType,
      mercureHost: mercureHost,
      nodeHost: nodeHost,
      labels: {
      welcomeMessage: theme.labels.welcomeMessage,
      inputPlaceholder: theme.labels.inputPlaceholder,
      loadingMessage: theme.labels.loadingMessage,
      errorMessage: theme.labels.errorMessage,
      sendButton: theme.labels.sendButton,
    }}, isActiveRef)

    return () => {
      isActiveRef.current = false
      bot.message.removeAll()
    }
  }, [theme.labels, chatbotId, streamingType ])

  const handleSelectChat = (selectedChat: ChatWithMessages) => {
    setViewingChat(selectedChat)
  }

  const renderLogo = () => {
    if (!theme.branding.logo) {
      return <RobotLogo primaryColor={theme.colors.primary} />
    }
    if (typeof theme.branding.logo === 'string') {
      return <img src={theme.branding.logo} alt={theme.branding.name} className="w-6 h-6 object-contain" />
    }
    return theme.branding.logo
  }

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <header className="chat-header">
        <div className="chat-avatar">
          {renderLogo()}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold" style={{ color: theme.colors.textDark }}>
            {theme.branding.name}
          </h1>
          <p className="text-sm flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
            {theme.branding.statusOnline && (
              <span
                className="status-dot w-2 h-2 rounded-full bg-green-500"
              />
            )}
            {theme.branding.statusText}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {theme.configs?.history && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer bg-transparent border-none"
            style={{ color: theme.colors.textMuted }}
            aria-label={theme.labels.historyButtonTitle}
            title={theme.labels.historyButtonTitle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </Button>
          )}
          <Button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer bg-transparent border-none"
            style={{ color: theme.colors.textMuted }}
            aria-label={theme.labels.moreOptionsTitle}
            title={theme.labels.moreOptionsTitle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </Button>
        </div>
      </header>

      {/* Chat Content */}
      <BotUI bot={bot}>
        <BotUIMessageList renderer={messageRenderers} />
        <BotUIAction renderer={actionRenderers} />
      </BotUI>

      {/* Conversations Modal */}
      <ConversationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectChat={handleSelectChat}
      />
    </div>
  )
}
