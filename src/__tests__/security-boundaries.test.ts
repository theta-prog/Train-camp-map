import { POST as seed } from '@/app/api/admin/seed-data/route'
import { POST as setup } from '@/app/api/admin/setup-db/route'
import { POST as register } from '@/app/api/auth/register/route'
import { GET as debugEnvironment } from '@/app/api/debug/env/route'
import { verifyToken } from '@/lib/auth'
import { hasAdminSetupKey } from '@/lib/auth-server'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

jest.mock('jose', () => ({ jwtVerify: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    $executeRaw: jest.fn(),
    campsite: { createMany: jest.fn() },
    user: { findUnique: jest.fn(), create: jest.fn() },
  },
}))

afterEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

test('blocks environment diagnostics in production before connecting to the database', async () => {
  jest.replaceProperty(process, 'env', { ...process.env, NODE_ENV: 'production' })
  const response = await debugEnvironment()
  expect(response.status).toBe(403)
  expect(await response.json()).toEqual({ error: 'Forbidden' })
})

test.each([undefined, 'fallback-secret'])('rejects sessions with an unsafe signing key (%s)', async key => {
  jest.replaceProperty(process, 'env', { ...process.env, JWT_SECRET: key })
  await expect(verifyToken('untrusted-token')).resolves.toBeNull()
  expect(jwtVerify).not.toHaveBeenCalled()
})

test.each([undefined, 'setup-key'])('blocks bootstrap with an unsafe setup key (%s)', async key => {
  jest.replaceProperty(process, 'env', { ...process.env, ADMIN_SETUP_KEY: key })
  const request = new NextRequest('https://example.test/', {
    method: 'POST',
    headers: { authorization: 'Bearer setup-key' },
  })

  for (const handler of [setup, seed, register]) {
    expect((await handler(request)).status).toBe(401)
  }
  expect(prisma.$executeRaw).not.toHaveBeenCalled()
  expect(prisma.campsite.createMany).not.toHaveBeenCalled()
  expect(prisma.user.findUnique).not.toHaveBeenCalled()
  expect(prisma.user.create).not.toHaveBeenCalled()
})

test('accepts only the configured bootstrap credential', () => {
  jest.replaceProperty(process, 'env', { ...process.env, ADMIN_SETUP_KEY: 'test-only-bootstrap-key' })
  expect(hasAdminSetupKey('Bearer test-only-bootstrap-key')).toBe(true)
  expect(hasAdminSetupKey('Bearer wrong-key')).toBe(false)
  expect(hasAdminSetupKey(null)).toBe(false)
})
