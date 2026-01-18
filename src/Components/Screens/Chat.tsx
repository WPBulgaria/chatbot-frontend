import React from 'react'
import { ChatWithMessages } from '../../api/chats-api'
import { useRef, useState, useEffect } from 'react'
import { chat as chatAction, bot } from '../../lib/chat'
import { BotUI, BotUIMessageList, BotUIAction, useBotUI } from '@botui/react'
import { ConversationsModal } from '../Modals/ConversationsModal'
import { messageRenderers } from '../../lib/constants'
import { actionRenderers } from '../../lib/constants'

export const Chat = ({ backToChat, setViewingChat }: { backToChat: () => void, setViewingChat: (chat: ChatWithMessages) => void }) => {
    const isActiveRef = useRef<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
      if (isActiveRef.current) return
      isActiveRef.current = true
      chatAction(true, 0, isActiveRef)

      return () => {
        isActiveRef.current = false
        bot.message.removeAll()
      }
    }, [])
  
    const handleSelectChat = (selectedChat: ChatWithMessages) => {
      console.log('selectedChat', selectedChat)
      setViewingChat(selectedChat)
    }

   // Render normal chat view
   return (
    <div className="chat-container">
      {/* Chat Header */}
      <header className="chat-header">
        <div className="chat-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            {/* Antenna */}
            <circle cx="12" cy="2" r="1.5" />
            <rect x="11" y="3" width="2" height="3" />
            {/* Head */}
            <rect x="4" y="6" width="16" height="12" rx="2" />
            {/* Eyes */}
            <circle cx="9" cy="11" r="2" fill="#00BFA5" />
            <circle cx="15" cy="11" r="2" fill="#00BFA5" />
            {/* Mouth */}
            <rect x="8" y="14" width="8" height="2" rx="1" fill="#00BFA5" />
            {/* Ears */}
            <rect x="1" y="9" width="3" height="4" rx="1" />
            <rect x="20" y="9" width="3" height="4" rx="1" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-[#1a2744]">WP Помощник</h1>
          <p className="text-sm flex items-center gap-2 text-[#64748b]">
            <span className="status-dot w-2 h-2 rounded-full bg-[#00BFA5]"></span>
            Винаги на линия
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer text-[#64748b] bg-transparent border-none hover:bg-[#00BFA5]/10 hover:text-[#00BFA5]"
            aria-label="История"
            title="История на разговорите"
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
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer text-[#64748b] bg-transparent border-none hover:bg-[#00BFA5]/10 hover:text-[#00BFA5]"
            aria-label="Още опции"
            title="Още опции"
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
          </button>
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