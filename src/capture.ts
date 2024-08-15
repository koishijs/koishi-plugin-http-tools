import { Context } from 'cordis'
import { HTTP } from '@cordisjs/plugin-http'

export namespace HttpToolCaptureModule{
  export function apply(ctx: Context) {
    ctx.on('http/fetch-init', (url: URL, init: RequestInit, config: HTTP.Config) => {
      if (!ctx['http/data'].captureEnabled) { return }
      ctx['http/data'].capture({
        method: init.method ?? 'GET',
        requestHeaders: config.headers ?? {},
        host: url.host,
        path: url.pathname,
        startTime: Date.now(),
        url: url.toString(),
      })
    })
  }
}
