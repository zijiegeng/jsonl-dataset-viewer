import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

interface Message {
  role: string
  content?: string
  thinking?: string | object
  tool_calls?: Array<{
    id: string
    type: string
    function: {
      name: string
      arguments: string
    }
  }>
  tool_call_id?: string
  name?: string
}

interface ConversationProps {
  messages: Message[]
}

export function Conversation({ messages }: ConversationProps) {
  const renderMessage = (message: Message, index: number) => {
    const { role, content, tool_calls, tool_call_id } = message

    // Determine styling based on role
    let bgColor = 'bg-gray-50'
    let roleLabel = role
    let textColor = 'text-gray-900'

    if (role === 'system') {
      bgColor = 'bg-purple-50'
      roleLabel = 'System'
    } else if (role === 'user') {
      bgColor = 'bg-blue-50'
      roleLabel = 'User'
    } else if (role === 'assistant') {
      bgColor = 'bg-green-50'
      roleLabel = 'Assistant'
    } else if (role === 'tool') {
      bgColor = 'bg-gray-100'
      roleLabel = `Tool Result${message.name ? ` (${message.name})` : ''}`
    }

    // Parse thinking content from assistant messages
    let mainContent = content || ''
    let thinkingContent: string | null = null

    if (role === 'assistant') {
      // Priority 1: explicit "thinking" field in message object
      if (message.thinking) {
        thinkingContent = typeof message.thinking === 'string'
          ? message.thinking
          : JSON.stringify(message.thinking, null, 2)
      }
      // Priority 2: extract from <thinking> or <think> tags in content
      else if (content) {
        const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/)
        const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/)
        if (thinkingMatch) {
          thinkingContent = thinkingMatch[1].trim()
          mainContent = content.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim()
        } else if (thinkMatch) {
          thinkingContent = thinkMatch[1].trim()
          mainContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim()
        }
      }
    }

    return (
      <div key={index} className={`${bgColor} rounded-lg p-4 mb-3`}>
        <div className="font-semibold text-sm mb-2 uppercase tracking-wide">
          {roleLabel}
        </div>

        {/* Thinking section (collapsible) */}
        {thinkingContent && (
          <div className="mb-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="thinking" className="border-none">
                <AccordionTrigger className="bg-yellow-100 px-3 py-2 rounded hover:bg-yellow-200">
                  <span className="text-sm font-medium">Thinking</span>
                </AccordionTrigger>
                <AccordionContent className="bg-yellow-50 px-3 py-2 rounded-b">
                  <div className="text-sm whitespace-pre-wrap">{thinkingContent}</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Main content */}
        {mainContent && (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                // Ensure line breaks are preserved
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              }}
            >
              {mainContent}
            </ReactMarkdown>
          </div>
        )}

        {/* Tool calls */}
        {tool_calls && tool_calls.length > 0 && (
          <div className="mt-3 space-y-2">
            {tool_calls.map((call) => {
              let args
              try {
                args = JSON.parse(call.function.arguments)
              } catch {
                args = call.function.arguments
              }

              return (
                <div key={call.id} className="bg-blue-100 rounded p-3">
                  <div className="font-semibold text-sm mb-1">
                    Tool Call: {call.function.name}
                  </div>
                  <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                    {typeof args === 'object'
                      ? JSON.stringify(args, null, 2)
                      : args}
                  </pre>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {messages.map((message, index) => renderMessage(message, index))}
        </div>
      </CardContent>
    </Card>
  )
}