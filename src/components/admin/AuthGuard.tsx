'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('認証セッション取得エラー:', error)
          router.push('/admin/login?error=session_error')
          return
        }
        
        if (session) {
          setAuthenticated(true)
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('認証チェックエラー:', error)
        router.push('/admin/login?error=auth_error')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('認証状態変更:', event, session?.user?.email)
        
        if (event === 'SIGNED_OUT' || !session) {
          setAuthenticated(false)
          router.push('/admin/login')
        } else if (session) {
          setAuthenticated(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
