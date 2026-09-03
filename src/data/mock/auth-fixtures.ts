import type { AuthUser } from '../../lib/types'

type DemoAccount = AuthUser & { password: string }

export const demoAccounts: DemoAccount[] = [
  { id: 'user-admin-001', username: 'admin', password: 'admin123', displayName: 'Nguyễn An', role: 'admin' },
  { id: 'user-student-001', username: 'student', password: 'student123', displayName: 'Nguyễn Minh Anh', role: 'student', studentCode: 'B20DCCN001', residentId: 'res-001', gender: 'Nữ' },
]

export function findDemoAccount(username: string, password: string): AuthUser | undefined {
  const account = demoAccounts.find((item) => item.username === username.trim() && item.password === password)
  if (!account) return undefined
  const { password: _password, ...user } = account
  return user
}
