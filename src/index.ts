import { Context } from 'cordis'
import { Entry } from '@cordisjs/plugin-webui'
import { HttpToolsStorage } from './storage'
import { HttpToolCaptureModule } from './capture'
import { HttpDataService, HttpSummary } from './data'
import { HttpApi } from './api'

export const inject = {
  required: ['webui', 'database'],
}

export function apply(ctx: Context) {
  ctx.plugin(HttpToolsStorage)
  let entry: Entry<HttpSummary> = null
  entry = ctx.webui.addEntry<HttpSummary>({
    base: import.meta.url,
    dev: '../client/index.ts',
    prod: [
      '../dist/index.js',
      '../dist/style.css',
    ],
  }, () => ctx.get('http/data')?.getSummary())
  ctx.plugin(HttpDataService, { entry })

  ctx.inject(['http/data'], (ctx) => {
    ctx.plugin(HttpApi)
    ctx.plugin(HttpToolCaptureModule)
    ctx.inject(['http'], (ctx) => {
      let i = 0
      ctx.setInterval(async () => {
        try {
          console.info(await ctx.http.get('https://www.timebather.cn/my-url-address' + (i++)))
        } catch (e) {
        }
      }, 10000)
    })
  })
}
