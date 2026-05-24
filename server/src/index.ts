import { Elysia, t } from 'elysia'
import { cors } from '@elysia/cors'
import { node } from '@elysia/node'
import { betterAuthPlugin } from './plugins/better-auth.js'
import { prisma } from './lib/prisma.js'
import { users } from './slices/users.js'

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
