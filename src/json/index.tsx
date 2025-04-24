import { RouterView } from 'vue-router'
import { CSSProperties, Transition } from 'vue'
import Menu from '@/components/Menu'
import menuOptions from './menu'

export const indexComponent = defineComponent({
  name: 'Home',
  setup: () => {
    const layoutStyle: CSSProperties = {
      width: '100%',
      height: '100%',
    }
    const layoutContentStyle: CSSProperties = {
      height: '100%',
      padding: '24px',
    }
    const layoutHeaderStyle: CSSProperties = {
      height: '60px',
    }

    return { layoutStyle, layoutContentStyle, layoutHeaderStyle }
  },
  render() {
    const { layoutStyle, layoutContentStyle, layoutHeaderStyle } = this
    return (
      <n-layout style={layoutStyle} has-sider>
        <n-layout-sider
          content-style={{
            padding: '24px',
            width: '200px',
          }}
        >
          <div
            style={{
              height: '60px',
            }}
          >
            数据菜单平台
          </div>
          <Menu
            style={{
              height: 'calc(100% - 60px)',
            }}
            options={menuOptions}
          ></Menu>
        </n-layout-sider>
        <n-layout>
          <n-layout-header style={layoutHeaderStyle}>颐和园路</n-layout-header>
          <n-layout-content content-style={layoutContentStyle}>
            <Transition>
              <RouterView />
            </Transition>
          </n-layout-content>
        </n-layout>
      </n-layout>
    )
  },
})
