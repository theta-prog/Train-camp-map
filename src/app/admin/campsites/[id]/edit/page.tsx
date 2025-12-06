import CampsiteEditClient from '@/components/admin/CampsiteEditClient'

interface CampsiteEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CampsiteEditPage({ params }: CampsiteEditPageProps) {
  const { id } = await params
  return <CampsiteEditClient id={id} />
}
