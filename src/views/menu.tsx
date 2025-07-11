import { MenuOption } from 'naive-ui'
import { ControlOutlined } from '@vicons/antd'

export const MenuOptions: MenuOption[] = [
  {
    label: '主控台',
    key: 'home',
    icon: () => <ControlOutlined />,
  },
  {
    label: '工作台',
    key: 'workbench',
    icon: () => <ControlOutlined />,
  },
]

export default MenuOptions
