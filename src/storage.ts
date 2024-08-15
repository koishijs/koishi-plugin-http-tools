import { RequestSummary } from './type'
import { Context } from 'cordis'
import {} from 'minato'

export interface Request extends RequestSummary{
  url: string
  requestHeaders: Record<string, any>
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
      host: 'string',
      path: 'string',
    }, {
      primary: 'id',
      autoInc: true,
    })
  }
}
