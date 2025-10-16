import { indexComponent } from './layout/index'
import Home from './home'
import Workbench from './workbench'
import TableView from './tableView'

export const config = {
  routes: [
    {
      path: '/',
      name: 'index',
      component: indexComponent,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: '主控台',
          component: () => import('./home'),
        },
        {
          path: '/workbench',
          name: '工作台',
          component: Workbench,
        },
        {
          path: '/tableView',
          name: '基本表格',
          component: TableView,
        },
        {
          path: '/formView',
          name: '基本表单',
          component: () => import('./formView'),
        },
      ],
    },
  ],
}
