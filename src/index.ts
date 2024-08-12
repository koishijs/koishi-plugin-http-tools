import { Context } from 'koishi'
import { } from '@koishijs/plugin-console'
import { resolve } from 'path'

export const inject = {
  required: ['console'],
}

export function apply(ctx: Context) {
  ctx.console.addEntry({
    dev: resolve(__dirname, '../client/index.ts'),
    prod: resolve(__dirname, '../dist'),
  })
}
