/// <reference types="vite/client" />
/// <reference path="./src/components/components.d.ts" />
/// <reference path="./src/stores/stores.d.ts" />
import type { MessageApiInjection } from 'naive-ui'

declare global {
  interface Window {
    $message: MessageApiInjection
  }
}
