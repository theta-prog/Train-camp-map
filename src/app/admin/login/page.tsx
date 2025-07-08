import LoginForm from '@/components/admin/LoginForm'
import { Suspense } from 'react'

function LoginFormWrapper() {
  return <LoginForm />
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          data-testid="loading-fallback"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      }
    >
      <LoginFormWrapper />
    </Suspense>
  )
}
