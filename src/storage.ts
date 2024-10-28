import { RequestSummary } from './type'
import { Context } from 'cordis'
import {} from 'minato'

export interface Request extends RequestSummary{
  url: string
  requestHeaders: Record<string, any>
  requestBody: ArrayBuffer | string
  responseHeaders?: Record<string, any>
  responseBody?: ArrayBuffer | string
  stackTrace?: string
  endTime?: number
}

export interface PluginRecord{
  id: string
  requests: number
  get: number
  post: number
  options: number
  head: number
  put: number
  update: number
  delete: number
}

declare module 'minato'{
  interface Tables{
    requests: Request
    request_records: PluginRecord
  }
}

export namespace HttpToolsStorage{
  export function apply(ctx: Context) {
    ctx.database.extend('requests', {
      id: 'unsigned',
      method: 'string',
      url: 'string',
      host: 'string',
      path: 'string',
      requestHeaders: 'json',
      requestBody: 'binary',
      responseCode: 'integer',
      responseStatus: 'string',
      responseHeaders: 'json',
      responseBody: 'binary',
      startTime: 'unsigned',
      endTime: 'unsigned',
      originalRequest: {
        type: 'unsigned',
        nullable: true,
      },
      stackTrace: 'text',
    }, {
      primary: 'id',
      autoInc: true,
    })

    ctx.database.extend('request_records', {
      id: 'string',
      requests: 'integer',
      get: 'integer',
      post: 'integer',
      options: 'integer',
      head: 'integer',
      put: 'integer',
      update: 'integer',
      delete: 'integer',
    })
  }
}
