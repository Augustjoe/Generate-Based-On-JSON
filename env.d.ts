/// <reference types="vite/client" />
import type { MessageApiInjection } from 'naive-ui'

declare global {
  interface Window {
    $message: MessageApiInjection
  }
}
