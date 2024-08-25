export interface RequestSummary{
  id?: number
  method: string
  host: string
  path: string

  responseCode?: number
  responseStatus?: string
  timeCost?: number

  startTime?: number
  originalRequest?: number
}
