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
      })
    | { type: 'expand' }
  )[]
  type tableButtonItem = (
    | (ButtonProps & {
        buttonText: string
      })
    | {
        type: 'custom'
        render?: () => HTMLElement | VNode
        key?: string
      }
  )[]
}
