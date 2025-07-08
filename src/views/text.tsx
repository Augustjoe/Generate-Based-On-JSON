import { defineComponent, reactive } from 'vue'
import Form from '@/components/Form'
import { NSpace, NButton } from 'naive-ui'
import { RouterView } from 'vue-router'
import { indexComponent } from './layout/index'
import Home from './home'
import Workbench from './workbench'

export const test = {
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
      ],
    },
  ],
}
