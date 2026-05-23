import { treaty } from '@elysia/eden'
import type { App } from '@aincrad/server'
import { authClient } from './auth-client'

export const apiClient = treaty<App>('http://localhost:3000', {
  fetch: {
    credentials: 'include',
    mode: "cors",
  }
})
