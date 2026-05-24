import { Elysia, t } from 'elysia'
import { cors } from '@elysia/cors'
import { node } from '@elysia/node'
import { betterAuthPlugin } from './plugins/better-auth.js'
import { prisma } from './lib/prisma.js'
import { users } from './slices/users.js'
import { Priority } from '@aincrad/database'

const tasks = new Elysia({ name: 'tasks' })
	.use(betterAuthPlugin)
	.get(
		'/tasks',
		async () => {
			const tasks = await prisma.task.findMany({
				orderBy: {
					ownerId: 'asc'
				},
				include: {
					author: true,
					manager: true,
				}
			})
			return tasks
		},
		{
			auth: true,
		}
	)
	.post(
		'/tasks',
		async ({ body}) => {
			const { title, description, ownerId, managerId, priority, endsAt } = body

			const task = await prisma.task.create({
				data: {
					title,
					description,
					ownerId,
					managerId,
					priority,
					endsAt,
				}
			})
			return task
		},
		{
			auth: true,
			body: t.Object({
				title: t.String(),
				description: t.String(),
				ownerId: t.String(),
				managerId: t.Nullable(t.String()),
				priority: t.Enum(Priority),
				endsAt: t.Date(),
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
