import React, { useState } from 'react'
import { ChatWithMessages } from './api/chats-api'
import { Chat } from './Components/Screens/Chat'
import { ViewChat } from './Components/Screens/ViewChat'


const App = () => {
  const [viewingChat, setViewingChat] = useState<ChatWithMessages | null>(null)

  const handleBackToChat = () => {
    setViewingChat(null)
  }

  const handleSelectChat = (selectedChat: ChatWithMessages) => {
    setViewingChat(selectedChat)
  }

  // Render read-only conversation view
  if (viewingChat) {
    return <ViewChat viewingChat={viewingChat} handleBackToChat={handleBackToChat} />
  }

  return <Chat backToChat={handleBackToChat}  setViewingChat={setViewingChat} />
}

export default App
