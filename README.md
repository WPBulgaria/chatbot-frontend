# WP Chatbot Frontend

A modern, themeable React chatbot widget designed for WordPress integration. Built with React 18, TypeScript, TailwindCSS, and BotUI.

## Features

- 🤖 **AI-Powered Chat** — Streaming responses with real-time message updates
- 🎨 **Fully Themeable** — 40+ customization options (colors, typography, labels, shadows, etc.)
- 🌍 **i18n Ready** — All UI strings are configurable (defaults in Bulgarian)
- 📜 **Conversation History** — Browse and view past conversations
- 📝 **Markdown Support** — Rich text rendering with GFM (tables, code blocks, lists)
- 📱 **Responsive Design** — Works on desktop and mobile
- 🔌 **WordPress Integration** — Builds to PHP template for easy WP plugin embedding

## Tech Stack

- **React 18** + TypeScript
- **Vite 7** for fast builds
- **TailwindCSS 4** for styling
- **BotUI** for conversational UI
- **react-markdown** + remark-gfm for Markdown rendering
- **Headless UI** for accessible components

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot module replacement.

## Build

```bash
npm run build
```

Outputs to `dist/` folder and generates a WordPress-ready PHP template.

## Project Structure

```
src/
├── api/
│   ├── base-api.tsx       # API base class with auth
│   └── chats-api.tsx      # Chat streaming & CRUD operations
├── Components/
│   ├── Actions/
│   │   └── StarsAction.tsx    # Star rating action
│   ├── Messages/
│   │   ├── MarkdownMessage.tsx # Markdown renderer
│   │   └── StarsMessage.tsx    # Star rating display
│   ├── Modals/
│   │   └── ConversationsModal.tsx # Chat history modal
│   └── Screens/
│       ├── Chat.tsx           # Main chat screen
│       └── ViewChat.tsx       # Read-only chat viewer
├── lib/
│   ├── chat.tsx           # Chat loop logic
│   ├── constants.tsx      # BotUI renderers config
│   ├── theme.ts           # Theme types & defaults
│   └── ThemeContext.tsx   # React context provider
├── App.tsx                # Root component
├── global.css             # Global styles & CSS variables
└── index.tsx              # Entry point
```

## Theme Customization

The chatbot supports extensive theming via the `createTheme()` function or WordPress config.

### Theme Options

| Category | Options |
|----------|---------|
| **Branding** | `name`, `logo`, `statusText`, `statusOnline` |
| **Colors** | `primary`, `primaryHover`, `secondaryBg`, `textDark`, `textMuted`, `border`, `botMessageBg`, `botMessageText`, `userMessageBg`, `userMessageText`, `codeBg`, `codeText`, `codeBlockBg`, `codeBlockText` |
| **Typography** | `fontFamily`, `fontUrl` |
| **Labels** | 20+ translatable strings for all UI text |
| **Backgrounds** | `page`, `header`, `inputArea`, `modal`, `modalBackdrop` |
| **Shadows** | `botMessage`, `userMessage`, `button`, `modal` |
| **Border Radius** | `message`, `input`, `button`, `avatar`, `modal` |

### Example: Custom Theme

```typescript
import { createTheme } from './lib/theme'

const theme = createTheme({
  branding: {
    name: 'Support Bot',
    statusText: 'Online',
  },
  colors: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    userMessageBg: '#6366f1',
  },
  labels: {
    welcomeMessage: 'Hello! How can I help you today?',
    inputPlaceholder: 'Type your message...',
    sendButton: 'Send',
  },
})
```

### WordPress Configuration

Pass theme config via `window.wpbChatbotConfig.chatTheme`:

```php
window.wpbChatbotConfig = {
    root: "<?php echo esc_url_raw(rest_url()); ?>",
    nonce: "<?php echo esc_attr(wp_create_nonce('wp_rest')); ?>",
    chatTheme: {
        branding: { name: "My Bot" },
        colors: { primary: "#ff6b6b" }
    }
};
```

## API Integration

The chatbot expects a REST API with these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chats` | GET | List conversations |
| `/chats/{id}` | GET | Get conversation with messages |
| `/chats/stream` | POST | Stream chat response (SSE) |

### Streaming Response Format

```typescript
{
  success: boolean
  message: string      // Current accumulated response
  chatId?: number      // Conversation ID
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production + generate PHP template |
| `npm run template` | Regenerate PHP template only |

## License

ISC
