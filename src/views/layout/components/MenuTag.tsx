import { defineComponent, watch } from 'vue'
import { NButton, NSpace, NIcon } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import MenuOptions from '@/views/menu'
import { Close } from '@vicons/ionicons5'
import Draggable from 'vuedraggable'
import { MenuOption } from 'naive-ui'

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
        router.push({ path: paths.value[0].path })
      }
      emit('update:tag', tag)
    }
    const handleClick = (path: string) => {
      router.push({ path })
    }
    const getSelectMenu = (path: string) => {
      const menuOptionArr: MenuOption[] = []
      // 取出其中的所有子菜单项
      MenuOptions.forEach((item) => {
        if (item.children) {
          item.children.forEach((child) => {
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
    )

    return () => (
      <Draggable v-model={paths.value} itemKey="path">
        {{
          item: ({ element: item }: { element: MenuItem }) => (
            <NButton
              type={item.path === currentPath.value ? 'info' : 'default'}
              size="small"
              tertiary
              key={item.path}
              dashed
              onClick={() => handleClick(item.path)}
              style={{ background: '#fff', marginRight: '10px' }}
            >
              <span>{item.name}</span>
              {item.path !== '/home' && (
                <NButton
                  renderIcon={() => <Close />}
                  text
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClose(item.path)
                  }}
                  style={{ color: '#999', marginLeft: '5px' }}
                />
              )}
            </NButton>
          ),
        }}
      </Draggable>
    )
  },
})

export default MenuTag
