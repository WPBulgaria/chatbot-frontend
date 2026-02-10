interface ThinkingMessageProps {
  message: {
    data: {
      text: string
    }
  }
}

export const ThinkingMessage = ({ message }: ThinkingMessageProps) => {
  const text = message?.data?.text ?? 'Thinking...'

  return (
    <div className="botui_wait flex items-center thinking-message">
      <span className="text-sm mr-2" style={{ color: 'var(--text-muted)' }}>
        {text}
      </span>
      <span className="loading_dot"></span>
      <span className="loading_dot"></span>
      <span className="loading_dot"></span>
    </div>
  )
}
