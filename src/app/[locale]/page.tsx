import CampsiteSearchApp from '@/components/CampsiteSearchApp'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

// Server Componentでparamsを処理し、Client Componentに渡す
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  return <CampsiteSearchApp locale={locale} />
}
