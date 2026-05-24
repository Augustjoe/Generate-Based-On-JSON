import { defineComponent } from 'vue'
import { NDropdown, NAvatar, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export const UserAvatar = defineComponent({
  name: 'UserAvatar',
  props: {},
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const message = useMessage()

    const divStyle = {
      display: 'flex',
      alignItems: 'center',
      minWidth: '100px',
    }

    const renderCustomHeader = () => {
      return (
        <div style={divStyle}>
          <NAvatar size="medium" src={new URL('@/assets/img/avatar1.png', import.meta.url).href} />
          <span style="margin-left:10px;">{authStore.userInfo?.userName || '未登录'}</span>
        </div>
      )
    }

    const handleSelect = (key: string) => {
      if (key === 'loginout') {
        authStore.logout()
        message.success('已退出登录')
        router.push('/login')
      }
    }
    const options = [
      {
        key: 'header',
        type: 'render',
        render: renderCustomHeader,
      },
      {
        key: 'header-divider',
        type: 'divider',
      },
      {
        label: '个人设置',
        key: 'settings',
      },
      {
        label: '退出登录',
        key: 'loginout',
      },
    ]

    return () => (
      <NDropdown trigger="hover" options={options} onSelect={handleSelect}>
        <div style={divStyle}>
          <NAvatar
            round
            size="medium"
            src={new URL('@/assets/img/avatar.png', import.meta.url).href}
          />
          <span style="margin-left:10px;">{authStore.userInfo?.userName || '未登录'}</span>
        </div>
      </NDropdown>
    )
  },
})

export default UserAvatar
