import { createBot } from 'botui'
import { makeChatsApi, ModelChatMessage } from '../api/chats-api'

export const bot = createBot()

export interface StreamConfig {
  streamingType: string | null;
  mercureHost: string | null;
  nodeHost: string | null;
  labels: ChatLabels;
}

export interface ChatLabels {
  welcomeMessage: string
  inputPlaceholder: string
  loadingMessage: string
  errorMessage: string
  sendButton: string
}

export const stream = async (
  chatbotId: string | null,
  chatId: number,
  config: StreamConfig,
  isActiveRef: React.MutableRefObject<boolean> | undefined
) => {
  const { labels } = config
  const isActive = () => !isActiveRef || isActiveRef.current
  const chatsApi = makeChatsApi(config)
  let currentChatId = chatId

  await bot.wait({ waitTime: 500 })
  await bot.message.add({
    text: labels?.welcomeMessage || 'Hello!',
  })


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
      const messageIndex = await bot.message.add(
        { text: labels.loadingMessage },
        { messageType: 'thinking' }
      )
      if (!isActive()) return

      let firstChunk = true

      const botResponse = await chatsApi.stream(
        chatbotId,
        userMessage,
        async (response: Omit<ModelChatMessage, 'title'> & { success: boolean }) => {
          if (!isActive()) {
            return
          }

          currentChatId = response.chatId || currentChatId

          if (firstChunk) {
            bot.next()
            firstChunk = false
          }

          if (!response.success) {
            await bot.message.update(
              messageIndex,
              { text: response.message || labels.errorMessage },
              { messageType: 'text' }
            )
            bot.next()
            return
          }

          await bot.message.update(
            messageIndex,
            { text: response.message },
            { messageType: 'text' }
          )
        },
        currentChatId
      )

      if (botResponse) {
        await bot.message.update(
          messageIndex,
          { text: botResponse },
          { messageType: 'text' }
        )
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
