import { Context } from 'cordis'
import {} from '@cordisjs/plugin-webui'
import { Request } from './storage'

declare module '@cordisjs/plugin-webui' {
  interface Events {
    'http/capture.start'(): any
    'http/capture.stop'(): any
    'http/capture.clear'(): any
    'http/request'(param: {type: string; id: number}): Promise<Request | undefined>
  }
}

export namespace HttpApi{
  export function apply(ctx: Context) {
    ctx.webui.addListener('http/capture.start', () => {
      ctx['http/data'].enableCapture()
    })

    ctx.webui.addListener('http/capture.stop', () => {
      ctx['http/data'].disableCapture()
    })

    ctx.webui.addListener('http/capture.clear', () => {
      ctx['http/data'].clearCapture()
    })

    ctx.webui.addListener('http/request', (param) => {
      return ctx['http/data'].getRequest(param.type, param.id)
    })
  }
}
