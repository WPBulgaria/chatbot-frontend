import { BaseApi } from './base-api';
import {  EventSourcePolyfill } from 'event-source-polyfill';

export interface Response {
  success: boolean;
  message?: string;
}

export interface Chat {
  id: number;
  title: string;
  userId: number;
  userName?: string;
  createdAt: string;
  modifiedAt: string;
}

export interface GetChatResponse extends Response {
  chat?: ChatWithMessages;
}

export interface ListChatsResponse extends Response {
  chats: ChatWithMessages[];
  total: number;
  pages: number;
}

export interface ChatMessage {
  id: number;
  chatId: number;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

export interface ModelChatMessage {
  chatId: number;
  message: string;
  isNew: boolean;
  title: string;
}

export interface ChatWithMessages extends Chat {
  messages: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  chat?: ModelChatMessage;
  message?: string;
}

export interface ChatActionResponse {
  success: boolean;
  message?: string;
}

export class ChatsApi extends BaseApi {

  private streamingType: string | null = null;
  private mercureHost: string | null = null;
  constructor() {
    super();
  }

  public setStreamingType(streamingType: "string" | null) {
    this.streamingType = streamingType;
  }

  public setMercureHost(mercureHost: string | null) {
    this.mercureHost = mercureHost;
  }

  public async list(
    chatbotId: string | null,
    page = 1,
    perPage = 20,
    userId?: number,
  ): Promise<ListChatsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (userId) {
      params.set('user_id', userId.toString());
    }

    const response = await fetch(`${this.apiEndpoint}/chatbots/${chatbotId}/chats?${params}`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.json();
  }

  public async get(chatbotId: string | null, id: number): Promise<GetChatResponse> {
    const response = await fetch(`${this.apiEndpoint}/chatbots/${chatbotId}/chats/${id}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async chat(
    chatbotId: string | null,
    message: string,
    chatId?: number,
  ): Promise<ChatResponse> {
    const url = chatId
      ? `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${chatId}`
      : `${this.apiEndpoint}/chatbots/${chatbotId}/chats`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message,
      };
    }

    return response.json();
  }

  private async regularStream(
    chatbotId: string | null,
    message: string,
    updateBotMessage: (response: ModelChatMessage & { success: boolean }) => void,
    chatId?: number,
  ): Promise<string> {

    const url = chatId
    ? `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${chatId}/stream`
    : `${this.apiEndpoint}/chatbots/${chatbotId}/chats/stream`;

  const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({ message: message, chatId: chatId }),
  });

  if (!response.ok) {
    const data = await response.json();
    updateBotMessage({
      success: false,
      chatId: chatId || 0,
      message: data.message,
      isNew: true,
      title: '',
    });
    return data.message;
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let botResponse = '';
  
  while (reader && true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });


      
      // Split by double newline (SSE standard delimiter)
      const lines = chunk.replaceAll('event: error\n', '').split('\n\n');
  
      for (const line of lines) {
          if (line.startsWith('data: ')) {
              try {
                  // Remove 'data: ' prefix and parse the JSON
                  const jsonStr = line.replace('data: ', '');
                  const data = JSON.parse(jsonStr);

                  if (data.message) {
                      botResponse += data.message;
                      // Update your React State here
                      updateBotMessage({
                        success: data.success,
                        chatId: data.chatId || 0,
                        message: botResponse,
                        isNew: true,
                        title: data.title || '',
                      }); 
                  }
              } catch (e) {
                  console.log('Skipping invalid JSON chunk');
              }
          }
      }
  }

    return botResponse;
  }

  private async nodeJsStream(
    chatbotId: string | null,
    message: string,
    updateBotMessage: (response: ModelChatMessage & { success: boolean }) => void,
    chatId?: number,
  ): Promise<string> {

    if (!this.mercureHost) {
      updateBotMessage({
        success: false,
        chatId: chatId || 0,
        message: 'Mercure host is not set. Please check your configuration.',
        isNew: true,
        title: '',
      });
      return '';
    }
  
    // 1. TRIGGER: Send the user message to PHP
    // PHP saves the message, dispatches the job to Node, and returns the Topic URL immediately.
    const url = chatId
      ? `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${chatId}/stream`
      : `${this.apiEndpoint}/chatbots/${chatbotId}/chats/stream`;
  
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json', // Just standard JSON now
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ message: message, chatId: chatId })
    });

    const text = await response.text();
    let data: any = {};
    const jsonStr = text.replace('data: ', '').replaceAll('event: success\n', '').replaceAll('event: error\n', '');
    try {
      data = JSON.parse(jsonStr);
      return this.listenTopic(data, updateBotMessage);
    } catch (e) {
      return '';
    }
  }


  protected async listenTopic(data: { topic: string, token: string, chatId: number, title: string }, updateBotMessage: (response: ModelChatMessage & { success: boolean }) => void): Promise<string> {

    if (!this.mercureHost) {
      return '';
    }

    // LISTEN: Connect to Mercure to receive the stream
    // We use the topic returned by PHP (e.g., 5fjslfjldsk)
    // Ensure your Apache config maps /hub to localhost:3000
    const hubUrl = new URL(this.mercureHost);
    hubUrl.searchParams.append('topic', data.topic);
  
    return new Promise((resolve, reject) => {
      const eventSource = new EventSourcePolyfill(hubUrl.toString(), {
        headers: {
          'Authorization': 'Bearer ' + data.token,
          'Accept': 'text/event-stream'
        }
      });


      let botResponse = '';
  
      eventSource.onmessage = (event) => {
        try {
          const streamData = JSON.parse(event.data);
          console.log(streamData, 'streamData');
  
          // A. HANDLE END OF STREAM
          // Your Node worker must send { isFinal: true } when done.
          if (streamData.isFinal) {
            eventSource.close();
            resolve(botResponse);
            return;
          }
  
          // B. APPEND TEXT
          if (streamData.message) {
            botResponse += streamData.message;
  
            updateBotMessage({
              success: true,
              chatId: data.chatId, // Use the ID from PHP (important for New Chats)
              message: botResponse,
              isNew: true,
              title: data.title || '',
            });
          }
        } catch (e) {
          console.warn('Skipping invalid JSON chunk from Mercure');
        }
      };
  
      // Handle connection errors (Network drop, etc.)
      eventSource.onerror = (err) => {
        console.error("Mercure Stream Error:", err, "ReadyState:", eventSource.readyState);
        // ReadyState: 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
        eventSource.close();

        if (botResponse) {
          resolve(botResponse); // Return what we have so far
        } else {
          reject(new Error('EventSource failed to connect'));
        }
      };
    });
    
  }

  public async stream(
    chatbotId: string | null,
    message: string,
    updateBotMessage: (response: ModelChatMessage & { success: boolean }) => void,
    chatId?: number,
  ): Promise<string> {

    if (!this.streamingType) {
      return this.regularStream(chatbotId, message, updateBotMessage, chatId);
    }

    return this.nodeJsStream(chatbotId, message, updateBotMessage, chatId);
  }
  
}

export const makeChatsApi = (streamingType: string | null, mercureHost: string | null) => {
  const chatsApi = new ChatsApi();
  chatsApi.setStreamingType(streamingType as "string" | null);
  chatsApi.setMercureHost(mercureHost as string | null);
  return chatsApi;
};