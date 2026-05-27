import { defineComponent, ref, reactive, onMounted, watch, toRef } from 'vue'
import { NCard, NSpin, type DataTableColumns, type DataTableProps, type FormProps } from 'naive-ui'
import SearchFrom from './SearchFrom'
import CustomTable from './CustomTable'

type ProTableRequestParams = {
  page: number
  pageSize: number
} & Record<string, unknown>

type ProTableRequestResult = {
  data: Record<string, unknown>[]
  total: number
}

type ProTableRequest = (params: ProTableRequestParams) => Promise<ProTableRequestResult>

type ProTableActionPayload = {
  source: 'search' | 'table'
  actionType: string
  data: Record<string, unknown> | null
}

export default defineComponent({
  name: 'ProTable',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 搜索表单的配置项
    formItems: {
      type: Array as () => FormItem[],
      default: () => [],
    },
    // 搜索表单的属性
    formProps: {
      type: Object as () => FormProps,
      default: () => ({}),
    },
    // 搜索表单底部的按钮
    formButtonItems: {
      type: Array as () => searchButtonItem,
      default: () => [
        { buttonText: '查询', type: 'primary', actionType: 'search' },
        { buttonText: '重置', actionType: 'reset' },
        { type: 'expand' },
      ],
    },
    // 表格的列定义
    columns: {
      type: Array as () => DataTableColumns<Record<string, any>>,
      required: true,
      default: () => [],
    },
    // 表格顶部的操作按钮
    tableButtons: {
      type: Array as () => tableButtonItem,
      default: () => [],
    },
    // 表格属性
    tableProps: {
      type: Object as () => DataTableProps,
      default: () => ({}),
    },
    // 静态数据（如果不提供 request，使用此静态数据）
    data: {
      type: Array as () => Record<string, unknown>[],
      default: () => [],
    },
    // 数据加载 API
    request: {
      type: Function as unknown as () => ProTableRequest,
      required: false,
    },
  },
  emits: [
    'update:formItems',
    'update:formProps',
    'update:formButtonItems',
    'update:columns',
    'update:tableButtons',
    'update:tableProps',
    'action',
  ],
  setup(props, { emit }) {
    const isEdit = toRef(props, 'isEdit')
    const loading = ref(false)
    const tableData = ref<Record<string, unknown>[]>([])
    const formData = reactive<Record<string, unknown>>({})

    // 初始化分页状态
    const pagination = reactive({
      page: 1,
      pageSize: 10,
      itemCount: 0,
      showSizePicker: true,
      pageSizes: [10, 20, 50, 100],
      onChange: (page: number) => {
        pagination.page = page
        loadData()
      },
      onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
        loadData()
      }
    })

    // 加载数据的方法
    const loadData = async () => {
      if (!props.request) {
        tableData.value = props.data
        return
      }

      loading.value = true
      try {
        const params: ProTableRequestParams = {
          page: pagination.page,
          pageSize: pagination.pageSize,
          ...formData,
        }
        const res = await props.request(params)
        tableData.value = res.data || []
        pagination.itemCount = res.total || 0
      } catch (err) {
        console.error('ProTable 加载数据失败:', err)
        tableData.value = []
        pagination.itemCount = 0
        window.$message?.error('数据加载失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 监听静态 data 变化（在非 request 模式下有用）
    watch(
      () => props.data,
      (newVal) => {
        if (!props.request) {
          tableData.value = newVal
        }
      },
      { immediate: true }
    )

    // 处理 SearchForm 的操作
    const handleSearchAction = (actionType: string) => {
      if (actionType === 'search') {
        pagination.page = 1
        loadData()
      } else if (actionType === 'reset') {
        // 重置表单值
        Object.keys(formData).forEach((key) => {
          formData[key] = null
        })
        pagination.page = 1
        loadData()
      }
      const payload: ProTableActionPayload = { source: 'search', actionType, data: formData }
      emit('action', payload)
    }

    // 处理 CustomTable 的操作
    const handleTableAction = (actionType: string, row: Record<string, unknown> | null) => {
      const payload: ProTableActionPayload = { source: 'table', actionType, data: row }
      emit('action', payload)
    }

    onMounted(() => {
      loadData()
    })

    // 这里的 tableProps 会与内部的分页进行合并
    const getMergedTableProps = () => {
      const externalProps = props.tableProps || {}
      return {
        ...externalProps,
        pagination: props.request
          ? {
              page: pagination.page,
              pageSize: pagination.pageSize,
              itemCount: pagination.itemCount,
              showSizePicker: pagination.showSizePicker,
              pageSizes: pagination.pageSizes,
              'onUpdate:page': pagination.onChange,
              'onUpdate:pageSize': pagination.onUpdatePageSize,
            }
          : externalProps.pagination,
      } as DataTableProps
    }

    return () => (
      <div
        class="pro-table"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          gap: '12px',
        }}
      >
        {props.formItems && props.formItems.length > 0 && (
          <div style={{ flex: '0 0 auto' }}>
            <SearchFrom
              isEdit={isEdit.value}
              formData={formData}
              formItems={props.formItems}
              formProps={props.formProps}
              ButtonItems={props.formButtonItems}
              onUpdate:formItems={(val) => emit('update:formItems', val)}
              onUpdate:formProps={(val) => emit('update:formProps', val)}
              onUpdate:ButtonItems={(val) => emit('update:formButtonItems', val)}
              onAction={handleSearchAction}
            />
          </div>
        )}
        <div style={{ flex: '1 1 auto', minHeight: 0, position: 'relative' }}>
          <NSpin show={loading.value} style={{ height: '100%' }} contentStyle={{ height: '100%' }}>
            <NCard
              bordered={false}
              contentStyle={{ padding: '0px', height: '100%' }}
              style={{ height: '100%', borderRadius: '8px' }}
            >
              <CustomTable
                isEdit={isEdit.value}
                columns={props.columns}
                data={tableData.value}
                tableButtons={props.tableButtons}
                tableProps={getMergedTableProps()}
                onUpdate:columns={(val) => emit('update:columns', val)}
                onUpdate:tableButtons={(val) => emit('update:tableButtons', val)}
                onUpdate:tableProps={(val) => emit('update:tableProps', val)}
                onAction={handleTableAction}
              />
            </NCard>
          </NSpin>
        </div>
      </div>
    )
  },
})
