import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            ページが見つかりません
          </h2>
          <p className="text-gray-600 mb-8">
            お探しのページは存在しないか、移動された可能性があります。
          </p>
          <Link 
            href="/"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ja', ['common'])),
    },
  }
}
