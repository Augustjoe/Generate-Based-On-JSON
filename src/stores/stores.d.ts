import type * as NaiveUI from 'naive-ui'

declare global {
  type NaiveUIComponents = Partial<typeof NaiveUI>
  type NaiveUI = typeof NaiveUI
  type RenderableComponents = {
    [K in keyof NaiveUIComponents]: NaiveUIComponents[K] extends { render: (...args: any[]) => any }
      ? K
      : never
  }[keyof NaiveUIComponents]
  type NaiveUIComponentsKeys = keyof NaiveUIComponents
  type FormItem =
    | {
        itemType: string
        path?: string
        props?: Record<string, any>
        itemGiProps?: Record<string, any>
        render?: () => HTMLElement
      }
    | Record<string, any>
}
