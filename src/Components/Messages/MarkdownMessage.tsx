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
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom link rendering to open in new tab
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          // Code blocks
          code: ({ className, children, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code
                  className="bg-slate-700/50 text-pink-300 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code
                className={`block bg-slate-800 text-slate-200 p-3 rounded-lg text-sm font-mono overflow-x-auto ${className}`}
                {...props}
              >
                {children}
              </code>
            )
          },
          // Pre blocks (code block wrapper)
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto">{children}</pre>
          ),
          // Paragraphs
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="ml-2">{children}</li>,
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold mb-2 mt-2 first:mt-0">{children}</h3>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-400 pl-3 my-2 italic opacity-90">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => <hr className="my-3 border-slate-600" />,
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          // Tables (GFM)
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-700/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-slate-600 px-3 py-1.5 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-600 px-3 py-1.5">{children}</td>
          ),
        }}
      >
        {message?.data?.text}
      </ReactMarkdown>
    </div>
  )
}
