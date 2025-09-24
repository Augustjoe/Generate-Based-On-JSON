import SearchFrom from '@/components/SearchFrom'
import type { ButtonProps } from 'naive-ui'

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

    return () => {
      return (
        <div
          class="tableView"
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
          }}
        >
          <div class="tableSearchFrom">
            <SearchFrom
              formItems={FormItems.value}
              RowProps={{ gutter: '12' }}
              formProps={formProps}
              formData={FormData}
              onUpdate:formItems={(val) => {
                FormItems.value = val
              }}
              ButtonItems={ButtonItems.value}
            />
          </div>
        </div>
      )
    }
  },
})

export default TableView
