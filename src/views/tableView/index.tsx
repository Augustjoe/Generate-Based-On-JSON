import Form from '@/components/Form'

export const TableView = defineComponent({
  name: 'TableView',
  setup: () => {
    const FormData = reactive({})
    const FormItems = ref<FormItem[]>([
      {
        itemType: 'NInput',
        path: 'name',
        props: { placeholder: '请输入名称' },
        itemGiProps: { span: 8, label: '名称:' },
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
    ])

    const formProps = reactive({
      inline: true,
      'label-placement': 'left',
    })

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
            <Form
              formItems={FormItems.value}
              RowProps={{ gutter: '12' }}
              formProps={formProps}
              formData={FormData}
              onUpdate:formItems={(val) => {
                FormItems.value = val
              }}
            />
          </div>
        </div>
      )
    }
  },
})

export default TableView
