import { NFlex } from 'naive-ui'
import Form from '@/components/Form'
import { FormProps } from 'naive-ui'

export const LoginFrom = defineComponent({
  name: 'LoginFrom',
  setup: () => {
    const FormItems = ref<FormItem[]>([
      {
        itemType: 'NInput',
        path: 'userName',
        props: { placeholder: '请输入用户名' },
        itemGiProps: { span: 24, label: '名称:' },
      },
      {
        itemType: 'NInput',
        path: 'password',
        props: { placeholder: '请输入密码' },
        itemGiProps: { span: 24, label: '工号:' },
      },
    ])
    const formData = reactive<Record<string, any>>({})
    const formProps = reactive<FormProps>({
      labelPlacement: 'left',
      rules: {
        userName: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入用户名',
        },
        password: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入密码',
        },
      },
    })

    return () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
        }}
      >
        <NFlex style={{ padding: '18px' }} justify="center" align="center">
          <img
            style={{ width: '30px' }}
            src={new URL('@/assets/img/icon.png', import.meta.url).href}
            alt=""
          />
          <span style={{ fontSize: '20px' }}>数据生成平台</span>
        </NFlex>
        <n-divider>
          <span style={{ fontSize: '14px', color: '#808080' }}>尝试利用数据生成表单</span>
        </n-divider>
        <NFlex style={{ padding: '16px' }} justify="center">
          <span style={{ fontSize: '18px' }}>账号登陆</span>
        </NFlex>
        <Form formItems={FormItems.value} formData={formData} formProps={formProps}></Form>
      </div>
    )
  },
})

export default LoginFrom
