const BOOTSTRAP_PREFIX = 'bearkid_chat_bootstrap_'

export interface ChatBootstrapPayload {
  text: string
  attachments?: Array<{ type: 'image' | 'audio', url: string, name?: string, durationSec?: number }>
}

export function saveChatBootstrap(sessionId: string, payload: ChatBootstrapPayload) {
  if (import.meta.client) {
    sessionStorage.setItem(`${BOOTSTRAP_PREFIX}${sessionId}`, JSON.stringify(payload))
  }
}

export function consumeChatBootstrap(sessionId: string): ChatBootstrapPayload | null {
  if (!import.meta.client) return null
  const raw = sessionStorage.getItem(`${BOOTSTRAP_PREFIX}${sessionId}`)
  if (!raw) return null
  sessionStorage.removeItem(`${BOOTSTRAP_PREFIX}${sessionId}`)
  try {
    return JSON.parse(raw) as ChatBootstrapPayload
  }
  catch {
    return null
  }
}

export function createSessionId() {
  return Math.random().toString(36).slice(2, 11)
}
