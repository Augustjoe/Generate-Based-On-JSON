import { CSSProperties, Transition, DefineComponent, ref, h, onMounted } from 'vue'
import Menu from '@/components/Menu'
import menuOptions from '../menu'
import iconImg from '@/assets/img/icon.png'
import { useLoadingBar, lightTheme, darkTheme } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import HearderButtons from './components/hearderButtons'
import './less/index.less'

export const indexComponent = defineComponent({
  name: 'Home',
  setup: () => {
    const router = useRouter()
    const route = useRoute()
    const routerKey = ref(1)
    const LoadingBar = useLoadingBar()
    LoadingBar.start()
    const layoutStyle: CSSProperties = {
      width: '100%',
      height: '100%',
    }
    const layoutContentStyle: CSSProperties = {
      height: '100%',
      padding: '24px',
    }
    const layoutHeaderStyle: CSSProperties = {}
    const collapsed = ref(false)

    const routeKey = computed(() => {
      return menuOptions.find(({ label }) => route.name === label)?.key || null
    })

    const MenuProps = reactive({
      collapsed: collapsed,
      collapsedWidth: 65,
      collapsedIconSize: 22,
      value: routeKey,
      'onUpdate:value': (path: string) => {
        router.push({ path })
      },
    })

    const refreshRoute = () => {
      routerKey.value += 1
    }

    onMounted(() => {
      LoadingBar.finish()
    })

    return {
      routerKey,
      layoutStyle,
      layoutContentStyle,
      layoutHeaderStyle,
      collapsed,
      MenuProps,
      refreshRoute,
      Collapse: () => {
        collapsed.value = true
      },
      Expand: () => {
        collapsed.value = false
      },
    }
  },
  render() {
    const {
      layoutStyle,
      layoutContentStyle,
      layoutHeaderStyle,
      collapsed,
      Collapse,
      Expand,
      MenuProps,
      refreshRoute,
    } = this
    return (
      <n-config-provider style={{ height: '100%' }} theme={lightTheme}>
        <n-layout style={layoutStyle} has-sider>
          <n-layout-sider
            bordered
            collapseMode="width"
            collapsedWidth={65}
            width={200}
            collapsed={collapsed}
            show-trigger
            onCollapse={Collapse}
            onExpand={Expand}
          >
            <div
              style={{
                height: '60px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60px',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <img style={{ width: '40px', marginRight: '10px' }} src={iconImg} alt="" />
                {!collapsed && <span>数据生成平台</span>}
              </div>
            </div>
            <Menu
              style={{
                height: 'calc(100% - 60px)',
                //  width: !collapsed ? "200px" : '65px'
              }}
              options={menuOptions}
              MenuProps={MenuProps}
            ></Menu>
          </n-layout-sider>
          <n-layout content-style={{ height: '100%' }} style={{ height: '100%' }}>
            <n-layout-header style={layoutHeaderStyle}>
              <HearderButtons
                collapsed={collapsed}
                onToggleCollapsed={() => {
                  this.collapsed = !this.collapsed
                }}
                onRefreshRoute={refreshRoute}
              ></HearderButtons>
            </n-layout-header>
            <n-layout-content
              style={{ height: 'calc(100% - 60px)', background: '#f5f7f9' }}
              content-style={layoutContentStyle}
            >
              <routerView
                key={`routerKey` + this.routerKey}
                v-slots={{
                  default: ({ Component }: { Component: DefineComponent }) => (
                    <Transition mode="out-in">{h(Component)}</Transition>
                  ),
                }}
              />
            </n-layout-content>
          </n-layout>
        </n-layout>
      </n-config-provider>
    )
  },
})
