import { defineComponent, ref } from 'vue'
import { NButton, NSpace, NBreadcrumb, NDropdown } from 'naive-ui'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd'
import { Refresh } from '@vicons/ionicons5'

export const LeftHeaderComponent = defineComponent({
    name: 'HeaderComponent',
    props: {
        collapsed: {
            type: Boolean,
            required: true,
            default: false,
        },
        onToggleCollapsed: {
            type: Function,
            required: true,
            default: () => { },
        },
        onRefreshRoute: {
            type: Function,
            required: true,
            default: () => { },
        }
    },
    setup(props) {
        const collapsed = ref(props.collapsed)

        const toggleCollapse = () => {
            collapsed.value = !collapsed.value
            props.onToggleCollapsed(collapsed.value)
        }

        return () => (
            <n-layout-header style={{ height: '60px' }}>
                <div
                    style={{
                        height: '100%',
                        marginLeft: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <div class="left-header-buttons">
                        {/* 缩放按钮 */}
                        <NButton
                            class="item-button"
                            text
                            onClick={toggleCollapse}
                        >
                            {{
                                icon: () => (collapsed.value ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)
                            }}
                        </NButton>
                        {/* 刷新按钮 */}
                        <NButton
                            class="item-button"
                            text
                            onClick={() => {
                                props.onRefreshRoute() // 调用传递过来的 onToggleCollapsed
                            }}
                        >
                            {{
                                icon: () => <Refresh />
                            }}
                        </NButton>
                        {/* 菜单题头 */}
                        <NBreadcrumb class="item-button">
                            <n-breadcrumb-item>
                                <NDropdown options={[]}>
                                    <div>
                                        控制面板
                                    </div>
                                </NDropdown>
                            </n-breadcrumb-item>
                            <n-breadcrumb-item>
                                菜单
                            </n-breadcrumb-item>
                        </NBreadcrumb>
                    </div>
                    <NSpace style={{ height: '100%' }} align="center" justify="start">
                        <NButton
                            text
                            onClick={toggleCollapse}
                        >
                            {{
                                icon: () => (collapsed.value ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)
                            }}
                        </NButton>
                    </NSpace>
                </div>
            </n-layout-header>
        )
    }
})

export default LeftHeaderComponent
