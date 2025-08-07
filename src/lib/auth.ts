import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const SALT_ROUNDS = 12

/**
 * パスワードをハッシュ化する
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * パスワードを検証する
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * JWTトークンを生成する
 */
export function generateToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * JWTトークンを検証する（Edge Runtime対応）
 */
export async function verifyTokenEdge(token: string) {
  try {
    console.log('Edge JWT検証開始:', { 
      tokenLength: token.length, 
      secret: JWT_SECRET.substring(0, 10) + '...' 
    });
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log('Edge JWT検証成功:', payload);
    return payload;
  } catch (error) {
    console.error('Edge JWT検証エラー:', error);
    return null;
  }
}

/**
 * JWTトークンを検証する
 */
export function verifyToken(token: string) {
  try {
    console.log('JWT検証開始:', { 
      tokenLength: token.length, 
      secret: JWT_SECRET.substring(0, 10) + '...' 
    });
    const result = jwt.verify(token, JWT_SECRET);
    console.log('JWT検証成功:', result);
    return result;
  } catch (error) {
    console.error('JWT検証エラー:', error);
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
  console.log('クッキーから取得したトークン:', token ? 'あり' : 'なし');
  
  if (!token) {
    return null
  }

  const payload = await verifyTokenEdge(token)
  console.log('JWT検証結果:', payload);
  return payload as { userId: string; email: string; role: string } | null
}

/**
 * 管理者権限をチェック
 */
export function requireAdmin(auth: any) {
  return auth && auth.role === 'ADMIN'
}
