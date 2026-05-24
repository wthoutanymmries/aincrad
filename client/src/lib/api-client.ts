import { treaty } from '@elysia/eden'
import type { App } from '@aincrad/server'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

const router = createRouter({ routeTree })

export const apiClient = treaty<App>('http://localhost:3000', {
  fetch: {
    credentials: 'include',
    mode: "cors",
  },
  onResponse: async (response) => {
    if (response.status === 401) {
      router.navigate({ to: '/login'})
    }
  },
})
