import { defineComponent, ref, reactive } from 'vue'
import { NFlex, NButton, useMessage } from 'naive-ui'
import Form from '@/components/Form'
import { FormProps } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export const LoginFrom = defineComponent({
  name: 'LoginFrom',
  setup: () => {
    const message = useMessage()
    const router = useRouter()
    const authStore = useAuthStore()
    const loading = ref(false)
    const formRef = ref<any>(null)

    const FormItems = ref<any[]>([
      {
        itemType: 'NInput',
        path: 'userName',
        props: { placeholder: '请输入用户名' },
        itemGiProps: { span: 24, label: '用户名' },
      },
      {
        itemType: 'NInput',
        path: 'password',
        props: { placeholder: '请输入密码', type: 'password', showPasswordOn: 'click' },
        itemGiProps: { span: 24, label: '密码' },
      },
    ])
    const formData = reactive<Record<string, any>>({
      userName: '',
      password: '',
    })
    const formProps = reactive<FormProps>({
      labelPlacement: 'top',
      size: 'large',
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

    const handleLogin = async () => {
      try {
        await formRef.value?.validate()
      } catch (errors) {
        return
      }

      loading.value = true
      try {
        await authStore.login(formData.userName)
        message.success('登录成功')
        router.push('/')
      } catch (err) {
        message.error('登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    return () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '16px 24px',
        }}
      >
        <NFlex vertical align="center" style={{ marginBottom: '32px' }}>
          <NFlex align="center" justify="center" style={{ marginBottom: '8px' }}>
            <img
              style={{
                width: '36px',
                height: '36px',
                marginRight: '8px',
                filter: 'drop-shadow(0 4px 6px rgba(24, 144, 255, 0.2))'
              }}
              src={new URL('@/assets/img/icon.png', import.meta.url).href}
              alt=""
            />
            <span style={{
              fontSize: '26px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
            }}>数据生成平台</span>
          </NFlex>
          <span style={{ fontSize: '14px', color: '#666', letterSpacing: '0.5px' }}>
            基于 JSON 数据动态构建表单
          </span>
        </NFlex>
        <Form ref={formRef} formItems={FormItems.value} formData={formData} formProps={formProps}></Form>
        <NFlex style={{ marginTop: '32px' }}>
          <NButton
            type="primary"
            block
            loading={loading.value}
            onClick={handleLogin}
            class="login-btn"
            style={{
              width: '100%',
              height: '46px',
              fontSize: '16px',
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            登录
          </NButton>
        </NFlex>
      </div>
    )
  },
})

export default LoginFrom

