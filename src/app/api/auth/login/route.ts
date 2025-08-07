import { generateToken } from '@/lib/auth'
import { verifyPassword } from '@/lib/auth-server'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

// POST /api/auth/login - ログイン
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが間違っています' },
        { status: 401 }
      )
    }

    // JWTトークンを生成
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // HttpOnly Cookieを設定
    const response = NextResponse.json({
      message: 'ログインしました',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7日間
    })

    return response

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'ログイン処理に失敗しました' },
      { status: 500 }
    )
  }
}
