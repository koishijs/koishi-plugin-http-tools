import { Context } from 'cordis'
import {} from '@cordisjs/plugin-webui'
import { Request } from './storage'

declare module '@cordisjs/plugin-webui' {
  interface Events {
    'http/capture.start'(): any
    'http/capture.stop'(): any
    'http/capture.clear'(): any
    'http/request'(param: {type: string; id: number}): Promise<Request | undefined>
    'http/request.create'(request: Request): Promise<number | undefined>
    'http/request.save'(request: Request): Promise<number | undefined>
    'http/request.delete'(request: any): Promise<void>
    'http/request.make'(param: {requestId: number}): Promise<number|string>
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

    ctx.webui.addListener('http/request', async (param) => {
      return serializeBinary(await ctx['http/data'].getRequest(param.type, param.id))
    })

    ctx.webui.addListener('http/request.create', async (request) => {
      delete request['id']
      return await ctx['http/data'].createRequest(deserializeBinary(request))
    })

    ctx.webui.addListener('http/request.save', async (request) => {
      return await ctx['http/data'].saveRequest(deserializeBinary(request))
    })

    ctx.webui.addListener('http/request.delete', async (requestInfo) => {
      return await ctx['http/data'].deleteRequest(requestInfo)
    })

    ctx.webui.addListener('http/request.make', async (param) => {
      return await ctx['http/data'].doRequest(param.requestId)
    })

    function serializeBinary(request: Request): Request {
      return {
        ...request,
        requestBody: request?.requestBody ? Buffer.from(request.requestBody as ArrayBuffer).toString('base64') : undefined,
        responseBody: request?.responseBody ? Buffer.from(request.responseBody as ArrayBuffer).toString('base64') : undefined,
      }
    }

    function deserializeBinary(request: Request): Request {
      return {
        ...request,
        requestBody: request?.requestBody ? Buffer.from(request.requestBody as string, 'base64') as Buffer : undefined,
        responseBody: request?.responseBody ? Buffer.from(request.responseBody as string, 'base64') as Buffer : undefined,
      }
    }
  }
}
