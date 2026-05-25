import ProTable from '@/components/ProTable'
import useEditMode from '@/stores/editMode'
import { storeToRefs } from 'pinia'
import { defineComponent, h, ref } from 'vue'
import { NButton, NSpace, NTag, type DataTableColumns } from 'naive-ui'

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
    const { isEdit } = storeToRefs(useEditMode())

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

    const columns = ref<DataTableColumns<Record<string, any>>>([
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
          const meta = statusMeta[row.status as OrderStatus]
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

    const request = async (params: Record<string, any>) => {
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

      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize

      return {
        data: filtered.slice(start, end),
        total: filtered.length,
      }
    }

    const handleAction = ({
      source,
      actionType,
    }: {
      source: string
      actionType: string
      data: any
    }) => {
      if (source === 'table' && actionType === 'add') {
        window.$message?.success('准备新增订单')
      }
      if (source === 'table' && actionType === 'export') {
        window.$message?.info('准备导出当前筛选结果')
      }
    }

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
        <ProTable
          isEdit={isEdit.value}
          formItems={formItems.value}
          columns={columns.value}
          tableButtons={tableButtons.value}
          request={request}
          tableProps={{
            rowKey: (row: Record<string, any>) => row.id,
            striped: true,
            singleLine: false,
          }}
          onUpdate:formItems={(val) => {
            formItems.value = val
          }}
          onUpdate:columns={(val) => {
            columns.value = val
          }}
          onUpdate:tableButtons={(val) => {
            tableButtons.value = val
          }}
          onAction={handleAction}
        />
      </div>
    )
  },
})

export default ProTableView
