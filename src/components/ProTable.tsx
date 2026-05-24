import { defineComponent, ref, reactive, onMounted, watch, toRef } from 'vue'
import { NCard, NSpin, type DataTableColumns, type DataTableProps, type FormProps } from 'naive-ui'
import SearchFrom from './SearchFrom'
import CustomTable from './CustomTable'

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
      type: Array as () => Record<string, any>[],
      default: () => [],
    },
    // 数据加载 API
    request: {
      type: Function as unknown as () => (params: any) => Promise<{ data: any[]; total: number }>,
      required: false,
    },
  },
  emits: ['update:formItems', 'update:columns', 'update:tableButtons', 'action'],
  setup(props, { emit }) {
    const isEdit = toRef(props, 'isEdit')
    const loading = ref(false)
    const tableData = ref<Record<string, any>[]>([])
    const formData = reactive<Record<string, any>>({})

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
        const params = {
          page: pagination.page,
          pageSize: pagination.pageSize,
          ...formData,
        }
        const res = await props.request(params)
        tableData.value = res.data || []
        pagination.itemCount = res.total || 0
      } catch (err) {
        console.error('ProTable 加载数据失败:', err)
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
      emit('action', { source: 'search', actionType, data: formData })
    }

    // 处理 CustomTable 的操作
    const handleTableAction = (actionType: string, row: any) => {
      emit('action', { source: 'table', actionType, data: row })
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
                onAction={handleTableAction}
              />
            </NCard>
          </NSpin>
        </div>
      </div>
    )
  },
})
