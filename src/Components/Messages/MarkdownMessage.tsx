import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownMessageProps {
  message: {
    data: {
      text: string
    }
  }
}

export const MarkdownMessage = ({ message }: MarkdownMessageProps) => {
  const text = message?.data?.text ?? ''
  if (!text.trim()) {
    return null
  }
  

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00BFA5] font-medium hover:underline"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code
                  className="bg-[#EEF4FB] text-[#d946ef] px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code
                className={`block text-slate-200 text-sm font-mono ${className || ''}`}
                {...props}
              >
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-3 bg-[#1a2744] rounded-xl overflow-hidden">
              <div className="p-4 overflow-x-auto">{children}</div>
            </pre>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 text-[#1a2744]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-3 mt-4 first:mt-0 text-[#1a2744]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold mb-2 mt-3 first:mt-0 text-[#1a2744]">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-[#00BFA5] pl-4 my-3 text-[#64748b] italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-[#e2e8f0]" />,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border-collapse text-sm border border-[#e2e8f0] rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#EEF4FB]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-[#e2e8f0] px-4 py-2 text-left font-semibold text-[#1a2744]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-[#e2e8f0] px-4 py-2">{children}</td>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}
