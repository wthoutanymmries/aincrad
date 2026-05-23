import { Elysia, type Context } from 'elysia'
import { cors } from '@elysia/cors'
import { node } from '@elysia/node'
import { auth } from './lib/auth.js'

const betterAuthView = async (context: Context) => {
	const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]

	const origin = context.request.headers.get('origin')
	console.log('Auth request Origin:', origin)

	// validate request method
	if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
		const res = await auth.handler(context.request)
		console.log('Auth handler response status:', res?.status)
		return res
	}
	else {
		return new Response('Method Not Allowed', { status: 405 })
	}
}

const app = new Elysia({ adapter: node() })
	.use(
			cors({
				origin: 'http://localhost:5173',
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
				credentials: true,
				allowedHeaders: ['Content-Type', 'Authorization']
			})
	)
	// .use(cors())
	.all("/api/auth/*", betterAuthView)
	.get('/', () => {
    console.log('elysia')
    return 'Hello Elysia'
  })
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})