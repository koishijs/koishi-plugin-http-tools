import { Context } from 'cordis'
import { HTTP } from '@cordisjs/plugin-http'

export namespace HttpToolCaptureModule{
  export function apply(ctx: Context) {
    ctx.on('http/fetch-init', (url: URL, init: RequestInit, config: HTTP.Config) => {
      if (!ctx['http/data'].captureEnabled) { return }

      const body = serializeBody(init)
      ctx['http/data'].capture({
        method: init.method ?? 'GET',
        requestHeaders: config.headers ?? {},
        host: url.host,
        path: url.pathname,
        startTime: Date.now(),
        url: url.toString(),
        requestBody: ('then' in body) ? null : body,
      })
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
      return encodeFormData(requestInit.body)
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

  function encodeFormData(body: FormData): ArrayBuffer {

  }
}
