import { Elysia, t } from 'elysia'
import { prisma } from '../lib/prisma.js'
import { betterAuthPlugin } from '../plugins/better-auth.js'

export const users = new Elysia({ name: 'users' })
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
  .get(
    '/subordinates',
    async ({ user }) => {
      const users = await prisma.user.findMany({
        where: {
          managerId: user.id,
        }
      })

      return users
    },
    {
      auth: true,
    }
  )
