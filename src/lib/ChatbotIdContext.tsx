import { createContext, useContext, ReactNode } from 'react'

const ChatbotIdContext = createContext<{ chatbotId: string | null, streamingType: string | null, mercureHost: string | null }>({ chatbotId: null, streamingType: null, mercureHost: null })

export const useChatbotId = () => useContext(ChatbotIdContext)

interface ChatbotIdProviderProps {
  chatbotId: string | null;
  streamingType: string | null;
  mercureHost: string | null;
  children: ReactNode
}

export const ChatbotIdProvider = ({ chatbotId, streamingType, mercureHost, children }: ChatbotIdProviderProps) => {

  return (
    <ChatbotIdContext.Provider value={{ chatbotId, streamingType, mercureHost }}>
      {children}
    </ChatbotIdContext.Provider>
  )
}
