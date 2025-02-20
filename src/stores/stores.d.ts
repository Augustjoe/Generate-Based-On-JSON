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
}
