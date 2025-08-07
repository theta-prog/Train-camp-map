import { generateToken } from '@/lib/auth'
import { hashPassword, isEmailAllowed } from '@/lib/auth-server'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

/**
 * 管理者登録API
 * 完全にサーバーサイドで処理され、フロントエンドからDBへの直接アクセスは不可能
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = registerSchema.parse(body)

    // メールアドレスの許可チェック
    if (!isEmailAllowed(email)) {
      return NextResponse.json(
        { error: 'このメールアドレスでの登録は許可されていません' },
        { status: 403 }
      )
    }

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '既に登録済みのメールアドレスです' },
        { status: 409 }
      )
    }

    // パスワードハッシュ化
    const hashedPassword = await hashPassword(password)

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // JWTトークン生成
    const token = await generateToken({ 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    })

    // HttpOnly Cookieを設定
    const response = NextResponse.json({
      message: '管理者アカウントが作成されました',
      user
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7日間
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '登録処理に失敗しました' },
      { status: 500 }
    )
  }
}
