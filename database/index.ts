export { UserPlain, UserPlainInputCreate } from "./prisma/generated/prismabox/User"

export { PrismaClient } from "./prisma/generated/prisma/client"
export * from "./prisma/generated/prisma/client.js"
export * from "./prisma/generated/prisma/internal/prismaNamespace.js"

// import { PrismaClient } from "./prisma/generated/prisma/client"

// const prisma = new PrismaClient({})

// const users = await prisma.user.findMany()
// prisma.user.update({
//   where: { id: 'some-id' },
//   data: { name: 'New Name' }
// })