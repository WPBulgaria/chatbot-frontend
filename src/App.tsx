import { useState } from 'react'
import { ChatWithMessages } from './api/chats-api'
import { Chat } from './Components/Screens/Chat'
import { ViewChat } from './Components/Screens/ViewChat'
import { ThemeProvider } from './lib/ThemeContext'
import { createTheme } from './lib/theme'
import { appContainerId } from './lib/constants'
import { ChatbotConfigProvider } from './lib/ChatbotConfigContext'

// Create your custom theme by overriding defaults
let themeData = {}
let chatbotId = null as string | null;
let streamingType = null as string | null;
let mercureHost = null as string | null;
let nodeHost = null as string | null;

try {
  const rootElement = document.getElementById(appContainerId)
  if (rootElement?.getAttribute('data-theme')) {
    themeData = JSON.parse(rootElement.getAttribute('data-theme') || '{}')
  }

  if (rootElement?.getAttribute('data-streaming')) {
    streamingType = rootElement?.getAttribute('data-streaming') || null;
  }

  chatbotId = rootElement?.getAttribute('data-chatbot') || null;

  if (rootElement?.getAttribute('data-mercure-host')) {
    mercureHost = rootElement?.getAttribute('data-mercure-host') || null;
  }

  if (rootElement?.getAttribute('data-node-host')) {
    nodeHost = rootElement?.getAttribute('data-node-host') || null;
  }


  if (process.env.NODE_ENV === 'development') {
      if ((window as any).wpbChatbotConfig?.chatTheme) {
          themeData = (window as any).wpbChatbotConfig.chatTheme
      }
  }
} catch (error) {
    console.error('Error parsing chat theme:', error)
}

const theme = createTheme(themeData)


const App = ({ history }: { history?: boolean }) => {
  const [viewingChat, setViewingChat] = useState<ChatWithMessages | null>(null)

  const handleBackToChat = () => {
    setViewingChat(null)
  }

  const handleSelectChat = (selectedChat: ChatWithMessages) => {
    setViewingChat(selectedChat)
  }

  return (
    <ChatbotConfigProvider chatbotId={chatbotId} streamingType={streamingType} mercureHost={mercureHost} nodeHost={nodeHost}>
      <div className="wpb-chat-page">
        <ThemeProvider theme={{ ...theme, configs: { ...theme.configs, history: history !== undefined ? history : theme.configs?.history }}}>
          {viewingChat ? (
            <ViewChat viewingChat={viewingChat} handleBackToChat={handleBackToChat} />
          ) : (
            <Chat backToChat={handleBackToChat} setViewingChat={handleSelectChat} />
          )}
        </ThemeProvider>
      </div>
    </ChatbotConfigProvider>
  )
}

export default App
