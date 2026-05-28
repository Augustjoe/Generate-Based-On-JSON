import type { DataTableColumns, DataTableProps, FormProps } from 'naive-ui'

export type TemplateKind = 'form' | 'proTable'

export type FormTemplateConfig = {
  formItems: FormItem[]
  formProps?: FormProps
}

export type ProTableTemplateConfig = {
  formItems: FormItem[]
  formProps?: FormProps
  formButtonItems?: searchButtonItem
  columns: DataTableColumns<Record<string, any>>
  tableButtons?: tableButtonItem
  tableProps?: DataTableProps
}

export type TemplateConfig = FormTemplateConfig | ProTableTemplateConfig

export type TemplateAsset = {
  id: string
  name: string
  type: TemplateKind
  description: string
  updatedAt: string
  config: TemplateConfig
}
