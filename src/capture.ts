import { Context } from 'cordis'
import { HTTP } from '@cordisjs/plugin-http'
import { Symbols } from './symbols'
import { PluginRecord } from './data'

export namespace HttpToolCaptureModule{

  export function createRecordFromSnapshot(url: string, init: RequestInit, config: HTTP.Config): Partial<PluginRecord> {
    const record: Partial<PluginRecord> = {}
    switch (init.method?.toLowerCase()) {
      case 'get':
        record.getCount = 1
        record.getUploadSize = ('HTTP/1.1 GET ' + url + '\n' + JSON.stringify(config.headers)).length
        record.getDownloadSize = 0
        break
      case 'post':
        record.postCount = 1
        record.postUploadSize = ('HTTP/1.1 GET ' + url + '\n' + JSON.stringify(config.headers)).length
        record.postDownloadSize = 0
        break
      default:
        record.otherCount = 1
        record.otherCount = ('HTTP/1.1 GET ' + url + '\n' + JSON.stringify(config.headers)).length
        record.otherCount = 0
    }

    return record
  }

  function createRecordFromResponse(method?: string, size?: number): Partial<PluginRecord> {
    switch (method?.toLowerCase()) {
      case 'get':
        return { getDownloadSize: size }
      case 'post':
        return { postDownloadSize: size }
      default:
        return { otherDownloadSize: size }
    }
  }
  export function apply(ctx: Context) {
    ctx.on('http/fetch-init', function (this: HTTP, url: URL, init: RequestInit, config: HTTP.Config) {
      const thatContext = this?.ctx;
      (function () {
        try {
          if (thatContext == null) { return }
          const locatedPath = ctx.loader.locate(thatContext)
          if (locatedPath == null || locatedPath.length === 0) {
            return
          }
          ctx['http/data'].updatePluginRecord(locatedPath[0], createRecordFromSnapshot(url.toString(), init, config))
        } catch (e) {}
      })()
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
        const thatContext = this?.ctx;
        (function () {
          try {
            if (thatContext == null) { return }
            const locatedPath = ctx.loader.locate(thatContext)
            if (locatedPath == null || locatedPath.length === 0) {
              return
            }
            ctx['http/data'].updatePluginRecord(locatedPath[0], createRecordFromResponse(data.init.method, data.result.length))
          } catch (e) {}
        })()

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
