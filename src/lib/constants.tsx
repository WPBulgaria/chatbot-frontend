import { StarsAction } from '../Components/Actions/StarsAction'
import { StarsMessage } from '../Components/Messages/StarsMessage'
import { MarkdownMessage } from '../Components/Messages/MarkdownMessage'


export const appContainerId = process.env.NODE_ENV === 'development' ? 'botui-app' : 'wp-chatbot-chat-container';

export const actionRenderers = {
  stars: StarsAction,
}

export const messageRenderers = {
  stars: StarsMessage,
  text: MarkdownMessage,
}
