import { Elysia, type Context } from 'elysia'
import { cors } from '@elysia/cors'
import { node } from '@elysia/node'
import { auth } from '@aincrad/auth'

// https://better-auth.com/docs/installation#mount-handler
const betterAuthView = async (context: Context) => {
	const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]

	if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
		const res = await auth.handler(context.request)
		return res
	}
	else {
		return new Response('Method Not Allowed', { status: 405 })
	}
}

const betterAuth = new Elysia({ name: 'better-auth' })
  .all("/api/auth/*", betterAuthView)
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

const app = new Elysia({ adapter: node() })
	.use(
			cors({
				origin: 'http://localhost:5173',
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
				credentials: true,
				allowedHeaders: ['Content-Type', 'Authorization']
			})
	)
	.use(betterAuth)
	.get(
		'/user',
		({ user }) => {
			return user
		},
		{
			auth: true
    }
	)
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})

export type App = typeof app
