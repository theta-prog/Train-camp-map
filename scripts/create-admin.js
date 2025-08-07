const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // 既存のadminユーザーを確認
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })

    if (existingAdmin) {
      console.log('Adminユーザーは既に存在します')
      return
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // adminユーザーを作成
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Adminユーザーが作成されました:', admin)
  } catch (error) {
    console.error('Adminユーザー作成エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
