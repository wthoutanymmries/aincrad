import 'dotenv/config'
import { Elysia, t, type Context } from 'elysia'
import { cors } from '@elysia/cors'
import { node } from '@elysia/node'
import { auth } from '@aincrad/auth'
import {
	PrismaClient,
	UserPlain,
	UserPlainInputCreate,
} from '@aincrad/database'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

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

const betterAuthPlugin = new Elysia({ name: 'better-auth' })
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

const users = new Elysia({ name: 'users' })
	.use(betterAuthPlugin)
  .get(
		'/users',
		async () => {
			const users = await prisma.user.findMany()
			return users
		},
		{
			auth: true
		}
	)
	.patch(
		'/users/:id',
		async ({ params: { id }, body: { managerId } }) => {
			return await prisma.user.update({
				where: { id },
				data: { managerId }
			})
		},
		{
			auth: true,
			body: t.Object({
				managerId: t.Nullable(t.String())
			})
		}
	)

const app = new Elysia({ adapter: node() })
	.use(
			cors({
				origin: 'http://localhost:5173',
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
				credentials: true,
				allowedHeaders: ['Content-Type', 'Authorization']
			})
	)
	.use(betterAuthPlugin)
	.use(users)
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
