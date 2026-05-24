import type { ButtonProps } from 'naive-ui'

declare global {
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
}
