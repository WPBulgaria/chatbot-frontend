import React from 'react'
import { ChatWithMessages } from '../../api/chats-api'
import { Button } from '@headlessui/react'
import { MarkdownMessage } from '../Messages/MarkdownMessage'

export const ViewChat = ({ viewingChat, handleBackToChat }: { viewingChat: ChatWithMessages, handleBackToChat: () => void }) => {
  return (
<div className="chat-container conversation-readonly">
        {/* Header with back button */}
        <header className="chat-header">
          <Button
            onClick={handleBackToChat}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#00BFA5]/10 hover:text-[#00BFA5] transition-colors mr-2"
            aria-label="Назад"
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
            <h1 className="text-lg font-semibold text-[#1a2744] truncate">
              {viewingChat.title || 'Разговор без заглавие'}
            </h1>
            <p className="text-sm text-[#64748b]">
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
                className={`inline-block max-w-[85%] px-5 py-4 text-base leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-[#00BFA5] text-white rounded-[20px_4px_20px_20px]'
                    : 'bg-white text-[#1a2744] rounded-[4px_20px_20px_20px] shadow-sm'
                }`}
                style={{
                  boxShadow: message.role === 'user' 
                    ? '0 2px 8px rgba(0, 191, 165, 0.25)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
              >
                <MarkdownMessage message={{data: {text: message.content}}} />
    
              </div>
            </div>
          ))}
        </div>

        {/* Read-only notice */}
        <div className="readonly-notice">
          <span>Този разговор е само за четене</span>
          <button
            onClick={handleBackToChat}
            className="ml-2 text-[#00BFA5] font-medium hover:underline"
          >
            Започнете нов чат
          </button>
        </div>
      </div>
  )
}