import { useRef, useState } from 'react'
import { CheckCircle2, Send, Sparkles } from 'lucide-react'
import { useReleaseWorkflow } from '@/context/ReleaseWorkflowContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { vaultImageFor } from '@/lib/mock/vaultImages'
import {
  ASSISTANT_OPENING_MESSAGES,
  GET_HELP_MESSAGE,
  SUGGESTED_PROMPTS,
  VERIFICATION_INITIATED_MESSAGE,
  getAssistantResponse,
  type AssistantMessage,
} from '@/lib/mock/assistantResponses'
import { cn } from '@/lib/utils'

const DEMO_VAULT_ID = 'VLT-001'

interface ArchivalAssistantProps {
  vaultName?: string
}

function nextMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function ArchivalAssistant({ vaultName = 'My Will' }: ArchivalAssistantProps) {
  const { setPendingVerification } = useReleaseWorkflow()
  const [messages, setMessages] = useState<AssistantMessage[]>(ASSISTANT_OPENING_MESSAGES)
  const [input, setInput] = useState('')
  const [verificationInitiated, setVerificationInitiated] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  function appendMessage(message: AssistantMessage) {
    setMessages((prev) => [...prev, message])
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  function sendUserMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    appendMessage({ id: nextMessageId(), role: 'user', text: trimmed })
    setInput('')

    window.setTimeout(() => {
      appendMessage({
        id: nextMessageId(),
        role: 'assistant',
        text: getAssistantResponse(trimmed),
      })
    }, 400)
  }

  function handleInitiateVerification() {
    if (verificationInitiated) return

    void setPendingVerification(DEMO_VAULT_ID)
    setVerificationInitiated(true)
    appendMessage({
      id: nextMessageId(),
      role: 'assistant',
      text: VERIFICATION_INITIATED_MESSAGE.replace('My Will', vaultName),
    })
  }

  function handleGetHelp() {
    appendMessage({
      id: nextMessageId(),
      role: 'assistant',
      text: GET_HELP_MESSAGE,
    })
  }

  return (
    <Card className="flex h-full max-h-[calc(100vh-8rem)] flex-col rounded-sm border-border bg-card shadow-none">
      <CardHeader className="shrink-0 pb-2">
        <CardTitle className="flex items-center gap-2 font-headline text-xs tracking-wider uppercase">
          <Sparkles className="size-4 text-primary" />
          Archival Assistant
          <span className="ml-auto text-[0.55rem] font-normal text-muted-foreground normal-case">
            OpenClaw Active
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 pt-0">
        <div
          ref={scrollRef}
          className="min-h-[200px] flex-1 space-y-3 overflow-y-auto rounded-sm border border-border bg-muted/30 p-3"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'text-sm',
                message.role === 'user'
                  ? 'ml-6 rounded-sm bg-primary/10 px-3 py-2 text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              <p>{message.text}</p>
              {message.action === 'initiate_verification' && !verificationInitiated && (
                <Button
                  type="button"
                  size="sm"
                  className="mt-3 w-full font-headline text-[0.65rem] tracking-widest"
                  onClick={handleInitiateVerification}
                >
                  Initiate verification
                </Button>
              )}
              {message.action === 'initiate_verification' && verificationInitiated && (
                <p className="mt-2 flex items-center gap-1.5 font-headline text-xs text-[var(--lv-success)]">
                  <CheckCircle2 className="size-3.5" />
                  Verification queued · Oracle notified
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-sm border border-border bg-card px-2 py-1 font-headline text-[0.55rem] tracking-wide text-muted-foreground uppercase transition-colors hover:border-primary/40 hover:text-foreground"
              onClick={() => sendUserMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            sendUserMessage(input)
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about heirs, RWAs, release..."
            className="text-sm"
          />
          <Button type="submit" size="icon-sm" variant="outline" aria-label="Send message">
            <Send className="size-3.5" />
          </Button>
        </form>

        <p className="font-headline text-xs text-[var(--lv-success)]">Oracle connection: [STABLE]</p>

        <Button
          variant="outline"
          size="sm"
          type="button"
          className="w-full font-headline text-[0.65rem] tracking-widest"
          onClick={handleGetHelp}
        >
          GET HELP
        </Button>

        <div
          className="h-24 shrink-0 rounded-sm bg-cover bg-center grayscale"
          style={{ backgroundImage: vaultImageFor('Geneva, CH') }}
          aria-hidden
        />
      </CardContent>
    </Card>
  )
}
