import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuOptions from '@/views/menu'
import { Close } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import Draggable from 'vuedraggable'

type MenuItem = { name: string; path: string }

export const MenuTag = defineComponent({
  name: 'MenuTag',
  emits: ['update:tag'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()

    const paths = ref<MenuItem[]>([{ name: '主控台', path: '/home' }])

    const currentPath = computed(() => {
      return route.path
    })

    const handleClose = async (tag: string) => {
      paths.value = paths.value.filter((item) => item.path !== tag)
      if (tag === currentPath.value) {
        router.push({ path: paths.value[paths.value.length - 1]?.path || '/home' })
      }
      emit('update:tag', tag)
    }
    const handleClick = (path: string) => {
      router.push({ path })
    }
    const getSelectMenu = (path: string) => {
      const menuOptionArr: any[] = []
      MenuOptions.forEach((item: any) => {
        if (item.children) {
          item.children.forEach((child: any) => {
            menuOptionArr.push(child)
          })
        } else {
          menuOptionArr.push(item)
        }
      })
      return menuOptionArr.find((option) => option.key === path)
    }

    watch(
      () => route.path,
      (path) => {
        const selectKey = path.replace('/', '')
        const menu = getSelectMenu(selectKey)
        if (menu && !paths.value.some((item) => item.path === path)) {
          paths.value.push({ name: menu.label as string, path })
        }
      },
      { immediate: true },
    )

    return () => (
      <Draggable v-model={paths.value} itemKey="path" style={{ display: 'flex', gap: '8px', overflowX: 'auto', width: '100%', height: '100%', alignItems: 'center' }}>
        {{
          item: ({ element: item }: { element: MenuItem }) => {
            const isActive = item.path === currentPath.value
            return (
              <div
                class={`custom-tag-item ${isActive ? 'active' : ''}`}
                onClick={() => handleClick(item.path)}
              >
                <span class={isActive ? 'dot active-dot' : 'dot'}></span>
                <span class="tag-text">{item.name}</span>
                {item.path !== '/home' && (
                  <span
                    class="close-icon"
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation()
                      handleClose(item.path)
                    }}
                  >
                    <NIcon component={Close} />
                  </span>
                )}
              </div>
            )
          },
        }}
      </Draggable>
    )
  },
})

export default MenuTag
