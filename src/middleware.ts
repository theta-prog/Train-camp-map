import { getAuthFromRequest } from '@/lib/auth'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

/**
 * セキュリティ強化ミドルウェア
 * 国際化機能 + 認証・セキュリティ制御
 */

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API routes は最初に処理して即座にreturn（国際化処理をスキップ）
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    // セキュアAPI(/api/secure/*)の保護
    if (pathname.startsWith('/api/secure/')) {
      const adminRequiredPaths = [
        '/api/secure/campsites',
        '/api/secure/admin'
      ]

      const requiresAdmin = adminRequiredPaths.some(path => 
        pathname.startsWith(path) && request.method !== 'GET'
      )

      if (requiresAdmin) {
        const auth = await getAuthFromRequest(request)
        
        if (!auth || auth.role !== 'ADMIN') {
          return NextResponse.json(
            { error: '管理者権限が必要です' },
            { status: 403 }
          )
        }
      }
    }
    
    return response
  }

  // 管理者エリアは国際化の対象外として先に処理
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    if (!pathname.startsWith('/admin/login')) {
      console.log('=== Admin認証チェック ===', pathname);
      const auth = await getAuthFromRequest(request)
      console.log('認証結果:', auth);
      
      if (!auth || auth.role !== 'ADMIN') {
        console.log('認証失敗 - ログインページにリダイレクト');
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      console.log('認証成功 - アクセス許可');
    }
    return response
  }

  // 国際化処理（管理者エリア以外）
  const intlMiddleware = createMiddleware(routing)
  return intlMiddleware(request)
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
