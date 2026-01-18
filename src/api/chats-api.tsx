import { BaseApi } from './base-api';

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
  constructor() {
    super();
  }

  public async list(
    page = 1,
    perPage = 20,
    userId?: number,
  ): Promise<ListChatsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(`${this.apiEndpoint}/chats?${params}`);
    return response.json();
  }

  public async get(id: number): Promise<GetChatResponse> {
    const response = await fetch(`${this.apiEndpoint}/chats/${id}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async chat(
    message: string,
    chatId?: number,
  ): Promise<ChatResponse> {
    const url = chatId
      ? `${this.apiEndpoint}/chats/${chatId}`
      : `${this.apiEndpoint}/chats`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    return response.json();
  }


  public async stream(
    message: string,
    updateBotMessage: (response: ModelChatMessage & { success: boolean }) => void,
    chatId?: number,
  ): Promise<void> {


    const url = chatId
      ? `${this.apiEndpoint}/chats/${chatId}/stream`
      : `${this.apiEndpoint}/chats/stream`;

    const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message: message, chatId: chatId }),
    });
  
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
                          chatId: chatId || 0,
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

  }
}

export const makeChatsApi = () => {
  return new ChatsApi();
};
