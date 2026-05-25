import { Elysia, t } from 'elysia'
import { prisma } from '../lib/prisma.js'
import { betterAuthPlugin } from '../plugins/better-auth.js'
import { Priority, Status } from '@aincrad/database'

export const tasks = new Elysia({ name: 'tasks' })
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
					orderBy: { updatedAt: 'desc' },
					include,
				})
			}

			if (query.all === 'true') {
				return prisma.task.findMany({
					orderBy: { updatedAt: 'desc' },
					include,
				})
			}

			if (user.isManager) {
				return prisma.task.findMany({
					orderBy: { ownerId: 'asc' },
					include,
				})
			}

			return prisma.task.findMany({
				where: { ownerId: user.id },
				orderBy: { updatedAt: 'desc' },
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
		async ({ params: { id }, body, user }) => {
			const isManagerNotAllowedToEdit =
				(body.managerId && body.managerId !== user.id)
				|| (!body.managerId && user.id !== body.ownerId)

			if (isManagerNotAllowedToEdit) {
				throw new Error('Not your subordinate.')
			}

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
