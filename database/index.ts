export { UserPlain, UserPlainInputCreate } from "./prisma/generated/prismabox/User"

export {
  PrismaClient,
  Priority,
  Status,
  Account,
  Session,
  Task,
  User,
  Verification,
} from "./prisma/generated/prisma/client"
export * from "./prisma/generated/prisma/client.js"
export * from "./prisma/generated/prisma/internal/prismaNamespace.js"

// import { PrismaClient } from "./prisma/generated/prisma/client"

// const prisma = new PrismaClient({})

// const users = await prisma.user.findMany()
// prisma.task.findMany({
//   orderBy: {
//     authorId: 'asc'
//   },
//   include: {
//     author: true,
//     manager: true,
//   }
// })