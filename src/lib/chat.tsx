import { createBot } from 'botui'
import { makeChatsApi } from '../api/chats-api'

export const bot = createBot()
export const chatsApi = makeChatsApi()

export interface ChatLabels {
  welcomeMessage: string
  inputPlaceholder: string
  loadingMessage: string
  errorMessage: string
  sendButton: string
}

export const chat = async (
  initial: boolean = false,
  chatbotId: string | null,
  chatId: number,
  isActiveRef: React.MutableRefObject<boolean> | undefined,
  labels: ChatLabels
) => {
  const isActive = () => !isActiveRef || isActiveRef.current

  let currentChatId = chatId

  if (initial) {
    if (!isActive()) return
    await bot.wait({ waitTime: 500 })
    if (!isActive()) return
    await bot.message.add({
      text: labels.welcomeMessage,
    })
  }

  while (isActive()) {
    const data = await bot.action.set(
      { placeholder: labels.inputPlaceholder },
      { actionType: 'input', ephemeral: true, confirmButtonText: labels.sendButton }
    )

    if (!isActive()) return

    const userMessage = data?.value?.trim()

    if (!userMessage) {
      continue
    }

    // Add user message manually (since ephemeral: true skips auto-add)
    await bot.message.add({ text: userMessage }, { fromHuman: true })

    // Show loading indicator
    bot.wait({ waitTime: 60000 })

    try {
      const messageIndex = await bot.message.add({ text: labels.loadingMessage })
      if (!isActive()) return

      const chatResponse = await chatsApi.chat(
        chatbotId,
        userMessage,
        currentChatId
      )

      if (chatResponse.success) {
        await bot.message.update(messageIndex, { text: chatResponse.chat?.message })
      } else {
        await bot.message.update(messageIndex, { text: chatResponse.message || labels.errorMessage })
      }
    } catch (error) {
      if (!isActive()) return
      bot.next()
      console.error('Chat error:', error)
      await bot.message.add({
        text: labels.errorMessage,
      })
    }
  }
}
