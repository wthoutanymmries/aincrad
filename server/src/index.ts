import { Elysia, t } from 'elysia'
import { cors } from '@elysia/cors'
import { node } from '@elysia/node'
import { betterAuthPlugin } from './plugins/better-auth.js'
import { prisma } from './lib/prisma.js'
import { users } from './slices/users.js'
import { Priority, Status } from '@aincrad/database'

const tasks = new Elysia({ name: 'tasks' })
	.use(betterAuthPlugin)
	.get(
		'/tasks',
		async ({ user, query }) => {
			const include = { author: true, manager: true } as const

			if (query.endsAt) {
				return prisma.task.findMany({
					where: {
						ownerId: user.id,
						endsAt: { lte: new Date(query.endsAt) },
					},
					include,
				})
			}

			if (query.all === 'true') {
				return prisma.task.findMany({ include })
			}

			if (user.isManager) {
				return prisma.task.findMany({
					orderBy: { ownerId: 'asc' },
					include,
				})
			}

			return prisma.task.findMany({
				where: { ownerId: user.id },
				include,
			})
		},
		{
			auth: true,
			query: t.Object({
				all: t.Optional(t.String()),
				endsAt: t.Optional(t.String()),
			}),
		}
	)
	.post(
		'/tasks',
		async ({ body}) => {
			return prisma.task.create({
				data: {
					...body,
				},
			})
		},
		{
			auth: true,
			body: t.Object({
				title: t.String(),
				description: t.String(),
				ownerId: t.String(),
				managerId: t.Nullable(t.String()),
				priority: t.Enum(Priority),
				status: t.Enum(Status),
				endsAt: t.Date(),
			})
		}
	)
	.patch(
		'/tasks/:id',
		async ({ params: { id }, body }) => {
			return prisma.task.update({
				where: {
					id,
				},
				data: {
					...body
				},
			})
		},
		{
			auth: true,
			body: t.Object({
				title: t.Nullable(t.String()),
				description: t.Nullable(t.String()),
				ownerId: t.Nullable(t.String()),
				managerId: t.Nullable(t.String()),
				priority: t.Nullable(t.Enum(Priority)),
				status: t.Nullable(t.Enum(Status)),
				endsAt: t.Nullable(t.Date()),
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
	.use(tasks)
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
