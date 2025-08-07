import { PrismaClient } from '@prisma/client'

/**
 * セキュア分離型データベースクライアント
 * - フロントエンドからは絶対にアクセス不可
 * - サーバーサイドでのみ利用可能
 */

declare global {
  // グローバル変数の型定義（開発環境でのホットリロード対応）
  var prisma: PrismaClient | undefined
}

// データベースクライアントのシングルトンパターン
const prisma = globalThis.prisma || new PrismaClient()

// 開発環境ではグローバルに保存（ホットリロード対応）
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma

/**
 * データベース接続をテストする関数
 */
export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

/**
 * データベース接続を閉じる関数
 */
export async function closeDatabaseConnection() {
  await prisma.$disconnect()
}
