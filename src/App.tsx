import React, { useEffect, useRef, useState } from 'react'
import { createBot } from 'botui'
import { BotUI, BotUIMessageList, BotUIAction } from '@botui/react'
import { actionRenderers, messageRenderers } from './lib/constants'
import { makeChatsApi, ChatWithMessages, ModelChatMessage } from './api/chats-api'
import { ConversationsModal } from './Components/ConversationsModal'
import { MarkdownMessage } from './Components/Messages/MarkdownMessage'
import { Button } from '@headlessui/react';

const myBot = createBot()
const chatsApi = makeChatsApi()

const chat = async (
  initial: boolean = false,
  chatIdRef: React.MutableRefObject<number | undefined>
) => {
  if (initial) {
    await myBot.wait({ waitTime: 500 })
    await myBot.message.add({
      text: 'Здравей, за какво имаш нужда от помощ за WordPress?',
    })
  }

  const data = await myBot.action.set(
    { placeholder: 'Напиши съобщение...' },
    { actionType: 'input' }
  )

  const userMessage = data?.value?.trim()

  if (!userMessage) {
    return
  }

  // Show loading indicator
  myBot.wait({ waitTime: 60000 })

  try {
    const messageIndex = await myBot.message.add({ text: 'Генериране на отговор...' })

    let firstChunk = true

    await chatsApi.stream(
      userMessage,
      async (response: ModelChatMessage & { success: boolean }) => {
        if (firstChunk) {
          myBot.next()
          firstChunk = false
        }

        if (!response.success) {
          await myBot.message.update(messageIndex, {
            text:
              response.message ||
              'Съжалявам, не мога да се свържа със сървъра. Моля, опитай отново по-късно.',
          })
          myBot.next()
          return
        }

        await myBot.message.update(messageIndex, { text: response.message })
        if (response.chatId) {
          chatIdRef.current = response.chatId
        }
      },
      chatIdRef.current
    )
  } catch (error) {
    myBot.next()
    console.error('Chat error:', error)
    await myBot.message.add({
      text: 'Съжалявам, не мога да се свържа със сървъра. Моля, опитай отново по-късно.',
    })
  }

  chat(false, chatIdRef)
}

const App = () => {
  const chatIdRef = useRef<number | undefined>(undefined)
  const isActiveRef = useRef<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewingChat, setViewingChat] = useState<ChatWithMessages | null>(null)

  useEffect(() => {
    if (isActiveRef.current) return
    isActiveRef.current = true
    chat(true, chatIdRef)
  }, [])

  const handleSelectChat = (selectedChat: ChatWithMessages) => {
    console.log('selectedChat', selectedChat)
    setViewingChat(selectedChat)
  }

  const handleBackToChat = () => {
    setViewingChat(null)
  }

  // Render read-only conversation view
  if (viewingChat) {
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

  // Render normal chat view
  return (
    <div className="chat-container">
      {/* Chat Header */}
      <header className="chat-header">
        <div className="chat-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
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
      <BotUI bot={myBot}>
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

export default App
