import { RouterView } from 'vue-router'
import { CSSProperties } from 'vue'

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
        <n-layout-sider content-style="padding: 24px;">海淀桥</n-layout-sider>
        <n-layout>
          <n-layout-header style={layoutHeaderStyle}>颐和园路</n-layout-header>
          <n-layout-content content-style={layoutContentStyle}>
            <RouterView />
          </n-layout-content>
        </n-layout>
      </n-layout>
    )
  },
})
