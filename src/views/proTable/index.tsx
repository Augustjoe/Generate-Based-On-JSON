import ProTable from '@/components/ProTable'
import { useAppSettingsStore } from '@/stores/appSettings'
import { computed, defineComponent, h, ref, watch, onBeforeUnmount } from 'vue'
import { NButton, NSpace, NTag, type DataTableColumns, type DataTableProps, type FormProps } from 'naive-ui'
import { openJsonConfigDrawer, type JsonConfigSection } from '@/components/JsonConfigDrawer'
import { useAppDrawerStore } from '@/stores/appDrawerStore'

type OrderStatus = 'success' | 'pending' | 'failed'

type OrderRecord = {
  id: number
  orderNo: string
  customer: string
  status: OrderStatus
  amount: number
  owner: string
  createdAt: string
}

type TableActionPayload = {
  source: 'search' | 'table'
  actionType: string
  data: Record<string, unknown> | null
}

const statusMeta: Record<OrderStatus, { label: string; type: 'success' | 'warning' | 'error' }> = {
  success: { label: '已完成', type: 'success' },
  pending: { label: '处理中', type: 'warning' },
  failed: { label: '已失败', type: 'error' },
}

const allOrders: OrderRecord[] = Array.from({ length: 67 }).map((_, index) => {
  const statuses: OrderStatus[] = ['success', 'pending', 'failed']
  const status = statuses[index % statuses.length]

  return {
    id: index + 1,
    orderNo: `ORD-${String(index + 1).padStart(5, '0')}`,
    customer: ['杭州云舟科技', '上海青木贸易', '北京星河制造', '深圳明远电子'][index % 4],
    status,
    amount: 1200 + index * 137,
    owner: ['Alice', 'Bob', 'Cindy', 'David'][index % 4],
    createdAt: `2026-05-${String((index % 25) + 1).padStart(2, '0')}`,
  }
})

export const ProTableView = defineComponent({
  name: 'ProTableView',
  setup: () => {
    const ProTableAny = ProTable as any
    const appSettings = useAppSettingsStore()
    const appDrawerStore = useAppDrawerStore()
    const isEdit = computed(() => appSettings.isEdit)

    const formItems = ref<FormItem[]>([
      {
        itemType: 'NInput',
        path: 'orderNo',
        props: {
          placeholder: '请输入订单编号',
          clearable: true,
        },
        itemGiProps: { span: 8, label: '订单编号:' },
      },
      {
        itemType: 'NInput',
        path: 'customer',
        props: {
          placeholder: '请输入客户名称',
          clearable: true,
        },
        itemGiProps: { span: 8, label: '客户名称:' },
      },
      {
        itemType: 'NSelect',
        path: 'status',
        props: {
          placeholder: '请选择状态',
          clearable: true,
          options: [
            { label: '已完成', value: 'success' },
            { label: '处理中', value: 'pending' },
            { label: '已失败', value: 'failed' },
          ],
        },
        itemGiProps: { span: 8, label: '订单状态:' },
      },
    ])

    const columns = ref<DataTableColumns<any>>([
      {
        title: '订单编号',
        key: 'orderNo',
        width: 140,
      },
      {
        title: '客户名称',
        key: 'customer',
        minWidth: 160,
      },
      {
        title: '状态',
        key: 'status',
        width: 110,
        render: (row) => {
          const meta = statusMeta[row.status as OrderStatus] ?? { label: String(row.status ?? 'Unknown'), type: 'warning' as const }
          return <NTag type={meta.type}>{meta.label}</NTag>
        },
      },
      {
        title: '金额',
        key: 'amount',
        width: 120,
        render: (row) => `¥${Number(row.amount).toLocaleString()}`,
      },
      {
        title: '负责人',
        key: 'owner',
        width: 110,
      },
      {
        title: '创建日期',
        key: 'createdAt',
        width: 130,
      },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        render: (row) =>
          h(
            NSpace,
            { size: 8 },
            {
              default: () => [
                h(
                  NButton,
                  {
                    size: 'small',
                    text: true,
                    type: 'primary',
                    onClick: () => window.$message?.info(`查看 ${String(row.orderNo)}`),
                  },
                  { default: () => '查看' },
                ),
                h(
                  NButton,
                  {
                    size: 'small',
                    text: true,
                    type: 'error',
                    onClick: () => window.$message?.warning(`删除 ${String(row.orderNo)}`),
                  },
                  { default: () => '删除' },
                ),
              ],
            },
          ),
      },
    ])

    const tableButtons = ref<tableButtonItem>([
      {
        type: 'primary',
        buttonText: '新增订单',
        icon: 'Add12Filled',
        actionType: 'add',
      },
      {
        buttonText: '批量导出',
        actionType: 'export',
      },
    ])
    const formProps = ref<FormProps>({
      inline: true,
      labelPlacement: 'left',
    })
    const formButtonItems = ref<searchButtonItem>([
      { buttonText: '查询', type: 'primary', actionType: 'search' },
      { buttonText: '重置', actionType: 'reset' },
      { type: 'expand' },
    ])
    const tableProps = ref<DataTableProps>({
      rowKey: (row: OrderRecord) => row.id,
      striped: true,
      singleLine: false,
    })

    const request = async (params: Record<string, unknown>) => {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const filtered = allOrders.filter((item) => {
        if (params.orderNo && !item.orderNo.toLowerCase().includes(String(params.orderNo).toLowerCase())) {
          return false
        }
        if (params.customer && !item.customer.includes(String(params.customer))) {
          return false
        }
        if (params.status && item.status !== params.status) {
          return false
        }
        return true
      })

      const page = Number(params.page || 1)
      const pageSize = Number(params.pageSize || 10)
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        data: filtered.slice(start, end),
        total: filtered.length,
      }
    }

    const handleAction = ({ source, actionType }: TableActionPayload) => {
      if (source === 'table' && actionType === 'add') {
        window.$message?.success('准备新增订单')
      }
      if (source === 'table' && actionType === 'export') {
        window.$message?.info('准备导出当前筛选结果')
      }
    }

    const openConfigPanel = () => {
      const sections: JsonConfigSection[] = [
        { key: 'formItems', title: '搜索表单项 (formItems)', value: formItems.value },
        { key: 'formProps', title: '搜索表单属性 (formProps)', value: formProps.value },
        { key: 'formButtonItems', title: '搜索按钮 (formButtonItems)', value: formButtonItems.value },
        { key: 'columns', title: '表格列 (columns)', value: columns.value },
        { key: 'tableProps', title: '表格属性 (tableProps)', value: tableProps.value },
        { key: 'tableButtons', title: '表格按钮 (tableButtons)', value: tableButtons.value },
      ]
      openJsonConfigDrawer({
        title: 'ProTable 配置面板',
        sections,
        onApply: (items) => {
          items.forEach((item) => {
            if (item.key === 'formItems') formItems.value = item.value as FormItem[]
            if (item.key === 'formProps') formProps.value = item.value as FormProps
            if (item.key === 'formButtonItems') formButtonItems.value = item.value as searchButtonItem
            if (item.key === 'columns') columns.value = item.value as DataTableColumns<any>
            if (item.key === 'tableProps') tableProps.value = item.value as DataTableProps
            if (item.key === 'tableButtons') tableButtons.value = item.value as tableButtonItem
          })
        },
      })
    }

    watch(
      isEdit,
      (val) => {
        if (val) openConfigPanel()
        else appDrawerStore.setDrawerProps({ show: false })
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      appDrawerStore.setDrawerProps({ show: false })
    })

    return () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          minHeight: 0,
          boxSizing: 'border-box',
        }}
      >
        <ProTableAny
          isEdit={isEdit.value}
          formItems={formItems.value}
          formProps={formProps.value}
          formButtonItems={formButtonItems.value}
          columns={columns.value}
          tableButtons={tableButtons.value}
          request={request}
          tableProps={tableProps.value}
          onUpdate:formItems={(val: FormItem[]) => {
            formItems.value = val
          }}
          onUpdate:columns={(val: any[]) => {
            columns.value = val
          }}
          onUpdate:tableButtons={(val: tableButtonItem) => {
            tableButtons.value = val
          }}
          onAction={handleAction}
        />
      </div>
    )
  },
})

export default ProTableView
