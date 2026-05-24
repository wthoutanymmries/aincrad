import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@aincrad/database'
import { PrismaPg } from '@prisma/adapter-pg'

import "dotenv/config"
import { env } from "prisma/config"

// console.log('Database URL:', env("DATABASE_URL"))

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env("DATABASE_URL") })
})

const BASE_URL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'

export const auth = betterAuth({
  baseURL: BASE_URL,
  trustedOrigins: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Your server
  ],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },
  user: {
    additionalFields: {
      surname: {
        type: 'string',
        required: true,
      },
      patronymic: {
        type: 'string',
        required: true,
      },
      managerId: {
        type: 'string',
        required: false,
      },
      isManager: {
        type: 'boolean',
        required: true,
      },
    },
  },
})
