/// <reference types="vite/client" />

import type { MessageApiInjection } from 'naive-ui'
import type { ButtonProps } from 'naive-ui'
import type { VNode } from 'vue'

declare global {
  interface Window {
    $message: MessageApiInjection
  }

  type DrawSlots = {
    default?: (() => HTMLElement | VNode) | undefined
    footer?: (() => HTMLElement | VNode) | undefined
    header?: (() => HTMLElement | VNode) | undefined
  }

  type searchButtonItem = (
    | (ButtonProps & {
        buttonText: string
        icon?: string
        actionType?: string
      })
    | { type: 'expand' }
  )[]

  type tableButtonItem = (
    | (ButtonProps & {
        buttonText: string
        icon?: string
        actionType?: string
      })
    | {
        type: 'custom'
        render?: () => HTMLElement | VNode
        key?: string
      }
  )[]

  type FormItem =
    | {
        itemType: string
        path?: string
        props?: Record<string, any>
        itemGiProps?: Record<string, any>
        render?: () => HTMLElement
        slots?: Record<string, any>
      }
    | Record<string, any>
}

declare module '*.png' {
  const src: string
  export default src
}

declare module 'sortablejs' {
  const Sortable: any
  export default Sortable
}
