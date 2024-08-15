import { RequestSummary } from './type'
import { Context, Service } from 'cordis'
import { Request } from './storage'
import { Entry } from '@cordisjs/plugin-webui'

export interface HttpSummary{
    user: RequestSummary[]
    capture: RequestSummary[]
    captureEnabled: boolean
}
declare module 'cordis'{
    interface Context{
        'http/data': HttpDataService
    }
}
export class HttpDataService extends Service {
  entry: Entry<HttpSummary>
  constructor(ctx: Context, config: {entry: Entry<HttpSummary>}) {
    super(ctx, 'http/data')
    this.entry = config.entry
  }

  async start() {
    await this.loadSummary()
    this.entry.refresh()
  }

  userSummary: RequestSummary[] = []

  capturedSummary: RequestSummary[] = []

  captured: Request[] = []

  initMap: WeakMap<RequestInit, Request> = new WeakMap()

  captureEnabled: boolean = true

  idCounter: number = 0

  async loadSummary() {
    this.userSummary = await this.ctx.database.get('requests', {}, [
      'id', 'method', 'path', 'host',
    ])
  }

  getSummary() {
    return {
      user: this.userSummary,
      capture: this.capturedSummary,
      captureEnabled: this.captureEnabled,
    }
  }

  capture(request: Request) {
    request.id = this.idCounter++
    this.captured.unshift(request)
    const data = {
      host: request.host,
      method: request.method,
      id: request.id,
      path: request.path,
      startTime: request.startTime,
    }
    this.capturedSummary.unshift(data)
    this.entry?.refresh()
  }

  enableCapture() {
    this.captureEnabled = true
    this.entry?.patch({ captureEnabled: true })
  }

  disableCapture() {
    this.captureEnabled = false
    this.entry?.patch({ captureEnabled: false })
  }

  clearCapture() {
    this.captured = []
    this.capturedSummary = []
    this.entry?.refresh()
  }

  async getRequest(type: string, id: number) {
    if (type === 'capture') {
      return this.captured.find((request) => request.id === id)
    }
    if (type === 'user') {
      return (await this.ctx.database.get('requests', { id }))?.[0]
    }
  }
}
