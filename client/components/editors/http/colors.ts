export function getHttpMethodColor(method: string): string {
  switch (method?.toLowerCase()) {
    case 'get':
      return 'info'
    case 'post':
      return 'success'
    case 'put':
    case 'delete':
      return 'danger'
    case 'head':
    case 'options':
      return 'contrast'
    case 'patch':
      return 'warn'
    default:
      return 'secondary'
  }
}
