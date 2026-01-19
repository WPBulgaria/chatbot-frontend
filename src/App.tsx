import { useState } from 'react'
import { ChatWithMessages } from './api/chats-api'
import { Chat } from './Components/Screens/Chat'
import { ViewChat } from './Components/Screens/ViewChat'
import { ThemeProvider } from './lib/ThemeContext'
import { createTheme } from './lib/theme'

// Create your custom theme by overriding defaults
let themeData = {}

try {

    if ((window as any).wpbChatbotConfig?.chatTheme) {
        themeData = JSON.parse((window as any).wpbChatbotConfig.chatTheme)
    }
} catch (error) {
    console.error('Error parsing chat theme:', error)
}

const theme = createTheme(themeData)


const App = () => {
  const [viewingChat, setViewingChat] = useState<ChatWithMessages | null>(null)

  const handleBackToChat = () => {
    setViewingChat(null)
  }

  const handleSelectChat = (selectedChat: ChatWithMessages) => {
    setViewingChat(selectedChat)
  }

  return (
    <ThemeProvider theme={theme}>
      {viewingChat ? (
        <ViewChat viewingChat={viewingChat} handleBackToChat={handleBackToChat} />
      ) : (
        <Chat backToChat={handleBackToChat} setViewingChat={handleSelectChat} />
      )}
    </ThemeProvider>
  )
}

export default App
