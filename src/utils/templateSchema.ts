import type { TemplateAsset, TemplateKind } from '@/types/template'

const nowDate = () => new Date().toISOString().slice(0, 10)

export const createMockTemplates = (): TemplateAsset[] => [
  {
    id: 'tpl-form-001',
    name: '员工基础信息表单',
    type: 'form',
    description: '用于录入员工基础资料的表单模板',
    updatedAt: nowDate(),
    config: {
      formItems: [
        { itemType: 'NInput', path: 'name', props: { placeholder: '请输入姓名' }, itemGiProps: { span: 24, label: '姓名' } },
        { itemType: 'NInput', path: 'phone', props: { placeholder: '请输入手机号' }, itemGiProps: { span: 24, label: '手机号' } },
      ],
      formProps: {
        labelPlacement: 'left',
      },
    },
  },
  {
    id: 'tpl-table-001',
    name: '订单查询表格',
    type: 'proTable',
    description: '含搜索区与分页表格的订单管理模板',
    updatedAt: nowDate(),
    config: {
      formItems: [
        { itemType: 'NInput', path: 'orderNo', props: { placeholder: '订单号' }, itemGiProps: { span: 8, label: '订单号' } },
      ],
      formButtonItems: [
        { buttonText: '查询', type: 'primary', actionType: 'search' },
        { buttonText: '重置', actionType: 'reset' },
      ],
      columns: [
        { title: '订单号', key: 'orderNo' },
        { title: '客户', key: 'customer' },
      ],
      tableButtons: [{ buttonText: '新增', type: 'primary', actionType: 'add' }],
      tableProps: { striped: true },
    },
  },
]

export const validateTemplateAsset = (raw: unknown): { ok: true; value: TemplateAsset } | { ok: false; error: string } => {
  if (!raw || typeof raw !== 'object') return { ok: false, error: '模板必须是对象' }
  const item = raw as Record<string, unknown>
  const type = item.type as TemplateKind
  if (type !== 'form' && type !== 'proTable') return { ok: false, error: '模板 type 仅支持 form 或 proTable' }
  if (typeof item.id !== 'string' || !item.id) return { ok: false, error: '模板 id 无效' }
  if (typeof item.name !== 'string' || !item.name) return { ok: false, error: '模板名称无效' }
  if (typeof item.description !== 'string') return { ok: false, error: '模板描述无效' }
  if (!item.config || typeof item.config !== 'object') return { ok: false, error: '模板 config 无效' }
  if (!Array.isArray((item.config as Record<string, unknown>).formItems)) return { ok: false, error: 'config.formItems 必须为数组' }
  if (type === 'proTable' && !Array.isArray((item.config as Record<string, unknown>).columns)) {
    return { ok: false, error: 'proTable 模板要求 config.columns 为数组' }
  }
  return {
    ok: true,
    value: {
      id: item.id,
      name: item.name,
      type,
      description: item.description,
      updatedAt: typeof item.updatedAt === 'string' && item.updatedAt ? item.updatedAt : nowDate(),
      config: item.config as TemplateAsset['config'],
    },
  }
}
