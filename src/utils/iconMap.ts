import { h, type Component } from 'vue'
import { NIcon } from 'naive-ui'
import {
  Add12Filled,
  EditSettings24Regular,
  Settings32Regular,
  TableSettings24Regular,
} from '@vicons/fluent'
import { DisplaySettingsFilled } from '@vicons/material'

// 全局注册的图标映射表
const iconMap: Record<string, Component> = {
  Add12Filled,
  EditSettings24Regular,
  Settings32Regular,
  TableSettings24Regular,
  DisplaySettingsFilled,
}

/**
 * 动态获取并渲染图标组件
 * @param iconName 图标的字符串标识，如 'Add12Filled'
 */
export function renderIconFromString(iconName?: string) {
  if (!iconName) return undefined
  const IconComponent = iconMap[iconName]
  if (!IconComponent) {
    console.warn(`Icon ${iconName} not found in iconMap`)
    return undefined
  }
  return () => h(NIcon, null, { default: () => h(IconComponent) })
}
