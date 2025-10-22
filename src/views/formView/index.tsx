import From from '@/components/Form'
import { FormProps, NFlex, NCard, NRadio, NButton, FormValidationError } from 'naive-ui'

export const FromView = defineComponent({
  name: 'FromView',
  setup: () => {
    const formRef = ref<any>(null)
    const formData = reactive<Record<string, any>>({
      name: '张三',
      workNo: '101100',
      isEmployed: true,
      gender: '1',
      expectedSalary: 20000,
      expectedEntryTime: 1761840000000,
      expectedWorkTime: 12,
      badgeColor: 'rgba(88, 23, 23, 1)',
    })
    const FormItems = ref<FormItem[]>([
      {
        itemType: 'NInput',
        path: 'name',
        props: { placeholder: '请输入名称' },
        itemGiProps: { span: 24, label: '名称:' },
      },
      {
        itemType: 'NInput',
        path: 'workNo',
        props: { placeholder: '请输入工号' },
        itemGiProps: { span: 24, label: '工号:' },
      },
      {
        itemType: 'NSwitch',
        path: 'isEmployed',
        props: {},
        slots: {
          checked: () => '是',
          unchecked: () => '否',
        },
        itemGiProps: { span: 24, label: '是否入职:' },
      },
      {
        itemType: 'NRadioGroup',
        path: 'gender',
        props: {},
        slots: {
          default: () => {
            return [
              {
                key: 'Male',
                label: '男',
                value: '1',
              },
              {
                key: 'Female',
                label: '女',
                value: '2',
              },
            ].map(({ key, label, value }) => (
              <NRadio value={value} key={key}>
                {label}
              </NRadio>
            ))
          },
        },
        itemGiProps: { span: 24, label: '性别:' },
      },
      {
        itemType: 'NInputNumber',
        path: 'expectedSalary',
        props: { placeholder: '请输入期望薪资', style: { width: '100%' } },
        itemGiProps: { span: 24, label: '期望薪资:' },
      },
      {
        itemType: 'NDatePicker',
        path: 'expectedEntryTime',
        props: { placeholder: '预计入职时间', style: { width: '100%' } },
        itemGiProps: { span: 24, label: '预计入职时间:' },
      },
      {
        itemType: 'NSlider',
        path: 'expectedWorkTime',
        props: { step: 1, max: 16, min: 6 },
        itemGiProps: { span: 24, label: '期望工作时间:' },
      },
      {
        itemType: 'NColorPicker',
        path: 'badgeColor',
        props: { placeholder: '希望工牌颜色' },
        itemGiProps: { span: 24, label: '希望工牌颜色:' },
      },
    ])

    const formProps = reactive<FormProps>({
      labelPlacement: 'left',
      rules: {
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入姓名',
        },
        workNo: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入工号',
        },
        isEmployed: {
          type: 'boolean',
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择是否已经入职',
        },
        gender: {
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择性别',
        },
      },
    })

    const confirm = () => {
      formRef.value.validate((error: Array<FormValidationError> | undefined) => {
        if (!error) {
          window.$message.success('校验通过')
          console.log('表单数据：', JSON.parse(JSON.stringify(formData)))
        }
      })
    }
    const clear = () => {
      Object.keys(formData).forEach((key) => {
        formData[key] = undefined
      })
      formRef.value.restoreValidation()
    }

    return () => (
      <div
        style={{
          height: '100%',
          background: '#fff',
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
          margin: 'auto',
        }}
      >
        <NCard
          style={{
            width: '50%',
          }}
          title={'表单'}
        >
          <From
            ref={formRef}
            formData={formData}
            formItems={FormItems.value}
            formProps={formProps}
          ></From>
          <NFlex justify="end" style={{ marginTop: '10px' }}>
            <NButton type="info" onClick={confirm}>
              确认
            </NButton>
            <NButton onClick={clear}>清空</NButton>
          </NFlex>
        </NCard>
        <NCard
          style={{
            width: 'calc(50% - 10px)',
            marginLeft: '10px',
          }}
          title={'表单结果'}
        >
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </NCard>
      </div>
    )
  },
})

export default FromView
