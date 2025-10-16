import { MenuOption } from 'naive-ui'
import { ControlOutlined } from '@vicons/antd'
import { TableChartOutlined } from '@vicons/material'
import { BookInformation20Regular } from '@vicons/fluent'

export const MenuOptions: MenuOption[] = [
  {
    label: '控制',
    key: 'control',
    children: [
      {
        label: '主控台',
        key: 'home',
      },
      {
        label: '工作台',
        key: 'workbench',
      },
    ],
    icon: () => <ControlOutlined />,
  },
  {
    label: '基本表格',
    key: 'tableView',
    icon: () => <TableChartOutlined />,
  },
  {
    label: '基本表单',
    key: 'formView',
    icon: () => <BookInformation20Regular />,
  },
]

export default MenuOptions
