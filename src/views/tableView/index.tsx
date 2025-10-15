import SearchFrom from '@/components/SearchFrom'
import CustomTable from '@/components/CustomTable'
import { NIcon, NSwitch } from 'naive-ui'
import { Add12Filled } from '@vicons/fluent'

export const TableView = defineComponent({
  name: 'TableView',
  setup: () => {
    const FormData = reactive<Record<string, any>>({})
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
        props: { placeholder: '请输入名称' },
        itemGiProps: { span: 8, label: '工号:' },
      },
      {
        itemType: 'NInput',
        path: 'pro',
        props: { placeholder: '请输入名称' },
        itemGiProps: { span: 8, label: '职务:' },
      },
      {
        itemType: 'NSelect',
        path: '类型',
        props: {
          placeholder: '请选择名称',
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

    const ButtonItems = ref<searchButtonItem>([
      {
        buttonText: '查询',
        type: 'primary',
        onClick: () => {
          console.log('查询', FormData)
        },
      },
      {
        buttonText: '重置',
        onClick: () => {
          Object.keys(FormData).forEach((key) => {
            FormData[key] = null
          })
        },
      },
      {
        type: 'expand',
      },
    ])

    const data = Array.from({ length: 46 }).map((_, index) => ({
      key: index,
      name: `Edward King ${index}`,
      age: 32,
      address: `London, Park Lane no. ${index}`,
    }))
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
    const isEdit = ref(false)

    const tableButtons = ref<tableButtonItem>([
      {
        type: 'primary',
        buttonText: '新增',
        renderIcon: () => {
          return <NIcon component={Add12Filled}></NIcon>
        },
        onClick: () => {
          console.log('新增')
        },
      },
      {
        type: 'error',
        buttonText: '批量删除',
        onClick: () => {
          console.log('批量删除')
        },
      },
      {
        type: 'custom',
        render: () => {
          return (
            <n-switch v-model:value={isEdit.value}>
              {{ checked: () => '编辑模式', unchecked: () => '预览模式' }}
            </n-switch>
          )
        },
      },
    ])

    return () => {
      return (
        <div
          class="tableView"
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: '0 0 auto',
            }}
            class="tableSearchFrom"
          >
            <SearchFrom
              isEdit={isEdit.value}
              formItems={FormItems.value}
              RowProps={{ gutter: '12' }}
              formProps={formProps}
              formData={FormData}
              onUpdate:formItems={(val) => {
                FormItems.value = val
              }}
              onUpdate:ButtonItems={(val) => {
                ButtonItems.value = val
              }}
              ButtonItems={ButtonItems.value}
            />
          </div>
          <div
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              overflow: 'auto',
            }}
          >
            <CustomTable
              isEdit={isEdit.value}
              data={data}
              columns={columns.value}
              tableProps={{ pagination: { pageSize: 10 } }}
              tableButtons={tableButtons.value}
              onUpdate:columns={(val) => {
                columns.value = val
              }}
              onUpdate:tableButtons={(val) => {
                tableButtons.value = val
              }}
            ></CustomTable>
          </div>
        </div>
      )
    }
  },
})

export default TableView
