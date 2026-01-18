import React, { useEffect, useRef, useState } from 'react'
import { createBot } from 'botui'
import { BotUI, BotUIMessageList, BotUIAction } from '@botui/react'
import { actionRenderers, messageRenderers } from './lib/constants'
import { makeChatsApi } from './api/chats-api'
import { ModelChatMessage } from './api/chats-api'

const myBot = createBot()

const chatsApi = makeChatsApi()

const chat = async (initial: boolean = false, chatIdRef: React.MutableRefObject<number | undefined>) => {

    if (initial) {
        await myBot.wait({ waitTime: 500 });
        await myBot.message.add({
            text: 'Здравей, за какво имаш нужда от помощ за WordPress?',
        })
    }

    const data = await myBot.action.set(
        { placeholder: 'Напиши съобщение...' },
        { actionType: 'input' }
    );

    const userMessage = data?.value?.trim();


    if (!userMessage) {
        return;
    }


        // Show loading indicator (don't await - let it show while API call happens)
        myBot.wait({ waitTime: 60000 })

        try {
            const messageIndex = await myBot.message.add({ text: 'Генериране на отговор...' });

            let firstChunk = true;

            await chatsApi.stream(userMessage,  async (response: ModelChatMessage & { success: boolean }) => {
              
                if (firstChunk) {
                  // Hide loading indicator
                  myBot.next()
                  firstChunk = false;
                }


              if (!response.success) {
                await myBot.message.update(messageIndex, { text: response.message || 'Съжалявам, не мога да се свържа със сървъра. Моля, опитай отново по-късно.' })
                myBot.next()
                return
              }

              await myBot.message.update(messageIndex, { text: response.message })
              if (response.chatId) {
                chatIdRef.current = response.chatId
              }
            }, chatIdRef.current)
  
      

          } catch (error) {
            // Hide loading indicator
            myBot.next()
  
            console.error('Chat error:', error)
            await myBot.message.add({
              text: 'Съжалявам, не мога да се свържа със сървъра. Моля, опитай отново по-късно.',
            })
          }

          chat(false, chatIdRef);
 }


const App = () => {
  const ref = useRef<boolean>(false)
  const chatIdRef = useRef<number | undefined>(undefined)
  const isActiveRef = useRef<boolean>(false)

 


  useEffect(() => {

    if (isActiveRef.current) {
        return;
    }
    isActiveRef.current = true;
    chat(true, chatIdRef);
  }, [])

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 max-sm:p-0">
      <div className="chat-container w-full h-full max-w-2xl flex flex-col overflow-hidden bg-slate-50 rounded-3xl shadow-xl max-sm:rounded-none max-sm:max-h-none sm:max-h-[700px]">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 bg-white rounded-t-3xl max-sm:rounded-none">
          <div className="chat-avatar w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-md">
            WP
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-slate-800">WP Помощник</div>
            <div className="text-sm flex items-center gap-2 text-slate-500">
              <span className="status-dot w-2 h-2 rounded-full bg-emerald-500"></span>
              Онлайн
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer text-slate-500 bg-transparent border-none hover:bg-indigo-500/10 hover:text-indigo-500"
              aria-label="Search"
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
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer text-slate-500 bg-transparent border-none hover:bg-indigo-500/10 hover:text-indigo-500"
              aria-label="More options"
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
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </header>
        <BotUI bot={myBot}>
          <BotUIMessageList renderer={messageRenderers} />
          <BotUIAction renderer={actionRenderers} />
        </BotUI>
      </div>
    </div>
  )
}

export default App
