import { Context } from 'cordis'
import { HTTP } from '@cordisjs/plugin-http'
import { Symbols } from './symbols'

export namespace HttpToolCaptureModule{
  export function apply(ctx: Context) {
    ctx.on('http/fetch-init', function (this: HTTP, url: URL, init: RequestInit, config: HTTP.Config) {
      ctx['http/data'].updatePluginStat(this.ctx, init.method)
      if (!ctx['http/data'].captureEnabled && !(Symbols.request in config)) { return }
      const stackTrace = new Error()
      const body = serializeBody(init)
      ctx['http/data'].capture(init, {
        method: init.method ?? 'GET',
        requestHeaders: config.headers ?? {},
        host: url.host,
        path: url.pathname,
        startTime: Date.now(),
        url: url.toString(),
        requestBody: ('then' in body) ? null : body,
        originalRequest: config[Symbols.request],
        stackTrace: stackTrace.stack,
      })
    })
    ctx.on('http/after-fetch', (data) => {
      const endTime = Date.now()
      if (data.result) {
        ctx['http/data'].fillCapture(data.init, {
          responseCode: data.result.status,
          responseStatus: data.result.statusText,
          responseHeaders: Object.fromEntries((() => {
            const h = []
            data.result.headers.forEach((value, key) => h.push([key, value]))
            return h
          })()),
          responseBody: null,
          endTime,
        })
        data.result.clone().arrayBuffer().then((body) => {
          ctx['http/data'].fillCapture(data.init, {
            responseBody: body,
          })
        })
      } else if (ctx.http.isError(data.error)) {
        ctx['http/data'].fillCapture(data.init, {
          responseCode: -1,
          responseStatus: data.error.code,
          endTime,
        })
      } else {
        ctx['http/data'].fillCapture(data.init, {
          responseCode: -1,
          responseStatus: 'E_UNKNOWN',
          endTime,
        })
      }
    })
  }

  function serializeBody(requestInit?: RequestInit): ArrayBuffer | Promise<ArrayBuffer> {
    if (!requestInit || !requestInit.body) {
      return new ArrayBuffer(0)
    }
    if (requestInit.body instanceof ReadableStream) {
      const [originalStream, forkStream] = requestInit.body.tee()
      requestInit.body = originalStream
      return forkStream.getReader().read().then(t => t.value).then(
        (value) => {
          if (!value) { return new ArrayBuffer(0) }
          if (value instanceof ArrayBuffer) { return value }
          if (typeof value === 'string') {
            return encodeTextToBuffer(value)
          }
        },
      )
    }
    if (requestInit.body instanceof Blob) {
      return requestInit.body.arrayBuffer()
    }
    if (requestInit.body instanceof FormData) {
      return encodeFormData(requestInit.body)!
    }
    if (requestInit.body instanceof URLSearchParams) {
      return encodeTextToBuffer(requestInit.body.toString())
    }
    if (typeof requestInit.body === 'string') {
      return encodeTextToBuffer(requestInit.body)
    }
    return new ArrayBuffer(0)
  }

  const textEncoder = new TextEncoder()
  function encodeTextToBuffer(str: string): ArrayBuffer {
    return textEncoder.encode(str)
  }

  function encodeFormData(body: FormData): ArrayBuffer | null {
    return null
  }
}
