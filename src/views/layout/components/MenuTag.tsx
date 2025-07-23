import { defineComponent, watch } from "vue";
import { NButton, NSpace, NIcon } from 'naive-ui'
import { useRoute, useRouter } from "vue-router";
import MenuOptions from '@/views/menu'
import { Close } from '@vicons/ionicons5'

export const MenuTag = defineComponent({
    name: 'MenuTag',
    props: {},
    emits: ['update:tag'],
    setup(props, { emit }) {

        const router = useRouter();
        const route = useRoute();

        const paths = ref<{ name: string, path: string }[]>([])

        const handleClose = (tag: string) => {
            emit('update:tag', tag);
        };
        const handleClick = (path: string) => {
            router.push({ path });
        };
        const getSelectMenu = (path: string) => {
            return MenuOptions.find(option => option.key === path);
        }

        watch(() => route.path, (path) => {
            const menu = getSelectMenu(path.replace('/', ''));
            if (menu) {
                paths.value.push({ name: (menu.label) as string, path });
            }
        })

        return () => (
            <NSpace>
                {paths.value.map((item) => (
                    <NButton
                        type="info"
                        tertiary
                        key={item.path}
                        dashed
                        // onClose={() => handleClose(item.path)}
                        onClick={() => handleClick(item.path)}
                        style={{
                            background: '#fff',
                        }}
                    >
                        <span> {item.name} </span>
                        <NButton  renderIcon={ () =><Close />} text onClick={() => handleClose(item.path)} style={{ color:'#999',marginLeft: '5px' }}>
                        </NButton>
                    </NButton>
                ))}

            </NSpace>

        );
    }
})

export default MenuTag