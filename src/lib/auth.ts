import { jwtVerify, SignJWT } from 'jose'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

/**
 * JWTトークンを生成する（Edge Runtime対応）
 */
export async function generateToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret);
  return jwt;
}

/**
 * JWTトークンを検証する（Edge Runtime対応）
 */
export async function verifyToken(token: string) {
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

  const payload = await verifyToken(token)
  console.log('JWT検証結果:', payload);
  return payload as { userId: string; email: string; role: string } | null
}

/**
 * 管理者権限をチェック
 */
export function requireAdmin(auth: any) {
  return auth && auth.role === 'ADMIN'
}
