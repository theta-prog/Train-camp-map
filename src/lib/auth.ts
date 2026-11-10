import { jwtVerify, SignJWT } from 'jose';
import { NextRequest } from 'next/server';

export function getJwtKey() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret === 'fallback-secret') {
    throw new Error('JWT_SECRET must be configured')
  }
  return new TextEncoder().encode(secret)
}

/**
 * JWTトークンを生成する（Edge Runtime対応）
 */
export async function generateToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(getJwtKey());
  return jwt;
}

/**
 * JWTトークンを検証する（Edge Runtime対応）
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtKey(), { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

/**
 * 許可されたメールアドレスかチェック
 */
export function isEmailAllowed(email: string): boolean {
  const allowedEmails = process.env.ADMIN_ALLOWED_EMAILS?.split(',') || []
  return allowedEmails.includes(email)
}

/**
 * リクエストから認証情報を取得
 */
export async function getAuthFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  return payload as { userId: string; email: string; role: string } | null
}

/**
 * 管理者権限をチェック
 */
export function requireAdmin(auth: any) {
  return auth && auth.role === 'ADMIN'
}
