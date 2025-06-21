'use client'

import { ReactNode } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'

interface GoogleMapsProviderProps {
  children: ReactNode
}

export default function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return <>{children}</>
  }

  return (
    <APIProvider apiKey={apiKey}>
      {children}
    </APIProvider>
  )
}
