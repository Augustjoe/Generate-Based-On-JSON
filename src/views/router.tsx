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
          component: Home,
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
      ],
    },
    // {
    //   path: '/tableView',
    //   name: 'tableView',
    //   component: TableView,
    // },
  ],
}
