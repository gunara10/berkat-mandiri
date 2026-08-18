import { PrismaClient } from '@prisma/client'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const defaultDatabasePath = path.resolve(process.cwd(), 'db', 'custom.db')
const configuredDatabaseUrl = process.env.DATABASE_URL

function isUsableDatabaseUrl(url: string | undefined) {
  if (!url?.startsWith('file:')) return Boolean(url)

  try {
    return existsSync(fileURLToPath(url))
  } catch {
    return false
  }
}

const databaseUrl = isUsableDatabaseUrl(configuredDatabaseUrl)
  ? configuredDatabaseUrl
  : `file:${defaultDatabasePath}`

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: databaseUrl,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
