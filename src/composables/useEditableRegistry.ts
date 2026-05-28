import { useEditableRegistryStore, type EditableSectionRecord } from '@/stores/editableRegistryStore'
import { openJsonConfigDrawer, type JsonConfigSection } from '@/components/JsonConfigDrawer'

const getCurrentPath = () => window.location.pathname || '/'

export const registerEditableSection = (section: Omit<EditableSectionRecord, 'path'> & { path?: string }) => {
  const store = useEditableRegistryStore()
  const path = section.path || getCurrentPath()
  store.registerSection({
    ...section,
    path,
  })
  return () => store.unregisterSection(section.id)
}

export const openEditablePanelForPath = (path?: string, drawerTitle = '页面配置面板') => {
  const store = useEditableRegistryStore()
  const targetPath = path || getCurrentPath()
  const records = store.sectionsByPath(targetPath)
  if (records.length === 0) {
    window.$message?.warning('当前页面暂无可编辑组件')
    return false
  }

  const sections: JsonConfigSection[] = records.map((item) => ({
    key: item.key,
    title: item.title,
    value: item.getValue(),
  }))

  openJsonConfigDrawer({
    title: drawerTitle,
    sections,
    onApply: (applied) => {
      applied.forEach((section) => {
        const target = records.find((record) => record.key === section.key)
        target?.apply(section.value)
      })
    },
  })

  return true
}

