import { defineComponent } from 'vue'
import Form from '@/components/Form'

export const test = {
  routes: [
    {
      path: '/',
      name: 'home',
      component: defineComponent({
        name: 'Home',
        render: () => (
          <div>
            <h1>Home</h1>
            <p>Home page content</p>
            <Form></Form>
          </div>
        ),
      }),
    },
  ],
}
