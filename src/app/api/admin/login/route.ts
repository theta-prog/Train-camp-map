import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// 簡単なハードコードされたadminアカウント（本番環境では環境変数やデータベースを使用）
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 認証チェック
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // JWTトークンを生成
    const token = jwt.sign(
      { 
        userId: username, 
        email: `${username}@admin.local`, 
        role: 'ADMIN' 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('生成されたJWTトークンペイロード:', {
      userId: username, 
      email: `${username}@admin.local`, 
      role: 'ADMIN'
    });

    // レスポンスを作成してクッキーを設定
    const response = NextResponse.json({ token, message: 'ログイン成功' });
    
    // HttpOnlyクッキーとしてトークンを設定
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24時間
    });

    return response;
  } catch (error) {
    console.error('ログインエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラー' },
      { status: 500 }
    );
  }
}
