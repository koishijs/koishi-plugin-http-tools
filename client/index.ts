import { Context } from '@cordisjs/client'
import Page from './index.vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'

// @ts-ignore
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'
export default (ctx: Context, config: any) => {
  // 此 Context 非彼 Context
  // 我们只是在前端同样实现了一套插件逻辑
  ctx.page({
    name: 'HTTP Tools',
    path: '/http-tools',
    component: Page,
  })

  ctx.app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  ctx.app.use(ToastService)

  ctx.app.directive('tooltip', Tooltip)
}
