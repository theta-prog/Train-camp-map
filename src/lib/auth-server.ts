import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

/**
 * パスワードをハッシュ化する（サーバーサイド専用）
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * パスワードを検証する（サーバーサイド専用）
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * 許可されたメールアドレスかチェック
 */
export function isEmailAllowed(email: string): boolean {
  const allowedEmails = process.env.ADMIN_ALLOWED_EMAILS?.split(',') || []
  return allowedEmails.includes(email)
}
