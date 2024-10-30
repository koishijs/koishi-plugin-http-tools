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

declare module 'minato'{
  interface Tables{
    requests: Request
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
  }
}
