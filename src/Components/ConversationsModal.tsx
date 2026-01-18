import React, { useEffect, useState } from 'react'
import { Chat, ChatWithMessages, ListChatsResponse, makeChatsApi } from '../api/chats-api'

interface ConversationsModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectChat: (chat: ChatWithMessages) => void
}

const chatsApi = makeChatsApi()

export const ConversationsModal = ({ isOpen, onClose, onSelectChat }: ConversationsModalProps) => {
  const [chats, setChats] = useState<ListChatsResponse['chats']>([])
  const [loading, setLoading] = useState(false)
  const [loadingChatId, setLoadingChatId] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadChats()
    }
  }, [isOpen])

  const loadChats = async () => {
    setLoading(true)
    try {
      const response = await chatsApi.list(1, 50)
      if (response.success) {
        setChats(response.chats)
      }
    } catch (error) {
      console.error('Failed to load chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChatClick = async (chatId: number) => {
    setLoadingChatId(chatId)
    try {

      const response = await chatsApi.get(chatId)
      if (response.success && response.chat) {
        onSelectChat(response.chat)
        onClose()
      }
    } catch (error) {
      console.error('Failed to load chat:', error)
    } finally {
      setLoadingChatId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Днес'
    } else if (diffDays === 1) {
      return 'Вчера'
    } else if (diffDays < 7) {
      return `Преди ${diffDays} дни`
    } else {
      return date.toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <div>
              <h2 className="text-lg font-semibold text-[#1a2744]">История на разговорите</h2>
              <p className="text-sm text-[#64748b]">Преглед на предишни чатове</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#EEF4FB] hover:text-[#1a2744] transition-colors"
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
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-[#64748b]">
                  <svg
                    className="animate-spin w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Зареждане...</span>
                </div>
              </div>
            ) : chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-[#EEF4FB] flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-[#1a2744] font-medium mb-1">Няма предишни разговори</p>
                <p className="text-sm text-[#64748b]">Започнете нов чат, за да видите историята тук</p>
              </div>
            ) : (
              <div className="divide-y divide-[#e2e8f0]">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    disabled={loadingChatId === chat.id}
                    className="w-full px-6 py-4 text-left hover:bg-[#EEF4FB] transition-colors flex items-start gap-4 disabled:opacity-60"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00BFA5]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#00BFA5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-medium text-[#1a2744] truncate">
                          {chat.title || 'Разговор без заглавие'}
                        </h3>
                        {loadingChatId === chat.id && (
                          <svg
                            className="animate-spin w-4 h-4 text-[#00BFA5] flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-[#64748b]">{formatDate(chat.createdAt)}</p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 mt-3"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
