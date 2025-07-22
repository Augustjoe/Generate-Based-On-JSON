import { NDropdown, NAvatar } from 'naive-ui'

export const UserAvatar = defineComponent({
  name: 'UserAvatar',
  props: {},
  setup() {
    const divStyle = {
      display: 'flex',
      alignItems: 'center',
    }

    const renderCustomHeader = () => {
      return (
        <div style={divStyle}>
          <NAvatar size="medium" src={new URL('@/assets/img/avatar1.png', import.meta.url).href} />
          <span style="margin-left:10px;">嘶~~哈~~~~~ </span>
        </div>
      )
    }

    const handleSelect = () => {}
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
          <span style="margin-left:10px;">哈基米</span>
        </div>
      </NDropdown>
    )
  },
})

export default UserAvatar
