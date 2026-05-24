import { Elysia, type Context } from "elysia"
import { auth } from '@aincrad/auth'

// https://better-auth.com/docs/installation#mount-handler
const betterAuthView = async (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET']

  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    const res = await auth.handler(context.request)
    return res
  }
  else {
    return new Response('Method Not Allowed', { status: 405 })
  }
}

export const betterAuthPlugin = new Elysia({ name: 'better-auth' })
  .all('/api/auth/*', betterAuthView)
  // https://elysiajs.com/integrations/better-auth
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers })

        if (!session) return status(401)

        return {
          user: session.user,
          session: session.session
        }
      }
    }
  })
  .as('scoped')
