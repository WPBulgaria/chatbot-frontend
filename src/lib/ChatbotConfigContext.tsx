import { createContext, useContext, ReactNode } from 'react'

const ChatbotConfigContext = createContext<{ chatbotId: string | null, streamingType: string | null, mercureHost: string | null, nodeHost: string | null }>({ chatbotId: null, streamingType: null, mercureHost: null, nodeHost: null })

export const useChatbotConfig = () => useContext(ChatbotConfigContext)

interface ChatbotConfigProviderProps {
  chatbotId: string | null;
  streamingType: string | null;
  mercureHost: string | null;
  nodeHost: string | null;
  children: ReactNode
}

export const ChatbotConfigProvider = ({ chatbotId, streamingType, mercureHost, nodeHost, children }: ChatbotConfigProviderProps) => {

  return (
    <ChatbotConfigContext.Provider value={{ chatbotId, streamingType, mercureHost, nodeHost }}>
      {children}
    </ChatbotConfigContext.Provider>
  )
}
