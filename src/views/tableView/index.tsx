import ProTable from '@/components/ProTable'
import { useAppSettingsStore } from '@/stores/appSettings'
import { computed, reactive, ref, defineComponent } from 'vue'

export const TableView = defineComponent({
  name: 'TableView',
  setup: () => {
    const appSettings = useAppSettingsStore()
    const isEdit = computed(() => appSettings.isEdit)
    const FormItems = ref<FormItem[]>([
      {
        itemType: 'NInput',
        path: 'name',
        props: { placeholder: '请输入名称' },
        itemGiProps: { span: 8, label: '名称:' },
      },
      {
        itemType: 'NInput',
        path: 'num',
        props: { placeholder: '请输入工号' },
        itemGiProps: { span: 8, label: '工号:' },
      },
      {
        itemType: 'NInput',
        path: 'pro',
        props: { placeholder: '请输入职务' },
        itemGiProps: { span: 8, label: '职务:' },
      },
      {
        itemType: 'NSelect',
        path: '类型',
        props: {
          placeholder: '请选择类型',
          options: [
            { label: '成功', value: 'success' },
            { label: '失败', value: 'error' },
          ],
        },
        itemGiProps: { span: 8, label: '类型:' },
      },
      {
        itemType: 'NSelect',
        path: 'sex',
        props: {
          placeholder: '请选择性别',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '2' },
          ],
        },
        itemGiProps: { span: 8, label: '性别:' },
      },
    ])

    const formProps = reactive({
      inline: true,
      'label-placement': 'left',
    })

    const formButtonItems = ref<searchButtonItem>([
      {
        buttonText: '查询',
        type: 'primary',
        actionType: 'search',
      },
      {
        buttonText: '重置',
        actionType: 'reset',
      },
      {
        type: 'expand',
      },
    ])

    const columns = ref([
      {
        title: 'Name',
        key: 'name',
      },
      {
        title: 'Age',
        key: 'age',
      },
      {
        title: 'Address',
        key: 'address',
      },
    ])
    const tableButtons = ref<tableButtonItem>([
      {
        type: 'primary',
        buttonText: '新增',
        icon: 'Add12Filled',
        actionType: 'add',
      },
      {
        type: 'error',
        buttonText: '批量删除',
        actionType: 'batchDelete',
      },
      {
        type: 'custom',
        render: () => {
          return <div>自定义模块</div>
        },
      },
    ])

    // 模拟服务端分页和搜索请求
    const handleRequest = (params: any) => {
      console.log('ProTable 请求参数:', params)
      return new Promise<{ data: any[]; total: number }>((resolve) => {
        setTimeout(() => {
          const allData = Array.from({ length: 46 }).map((_, index) => ({
            key: index,
            name: `Edward King ${index}`,
            age: 32 + (index % 10),
            address: `London, Park Lane no. ${index}`,
          }))

          // 本地模拟过滤
          const filteredData = allData.filter((item) => {
            if (params.name && !item.name.toLowerCase().includes(params.name.toLowerCase())) {
              return false
            }
            return true
          })

          const start = (params.page - 1) * params.pageSize
          const end = start + params.pageSize

          resolve({
            data: filteredData.slice(start, end),
            total: filteredData.length,
          })
        }, 400)
      })
    }

    const handleAction = ({ source, actionType, data }: { source: string; actionType: string; data: any }) => {
      console.log(`Action triggered from ${source}:`, actionType, data)
      if (actionType === 'add') {
        window.$message?.success('点击了新增按钮')
      } else if (actionType === 'batchDelete') {
        window.$message?.warning('点击了批量删除按钮')
      }
    }

    return () => {
      return (
        <div
          class="tableView"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            minHeight: 0,
            boxSizing: 'border-box'
          }}
        >
          <ProTable
            isEdit={isEdit.value}
            formItems={FormItems.value}
            formProps={formProps}
            formButtonItems={formButtonItems.value}
            columns={columns.value}
            tableButtons={tableButtons.value}
            request={handleRequest}
            onUpdate:formItems={(val) => {
              FormItems.value = val
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
    }
  },
})

export default TableView

