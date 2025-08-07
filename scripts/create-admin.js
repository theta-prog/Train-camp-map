const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // 環境変数から管理者情報を取得
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('❌ ADMIN_PASSWORD環境変数が設定されていません')
      console.log('使用方法: ADMIN_PASSWORD=your_secure_password node scripts/create-admin.js')
      process.exit(1)
    }

    if (adminPassword.length < 8) {
      console.error('❌ パスワードは8文字以上である必要があります')
      process.exit(1)
    }

    // 既存のadminユーザーを確認
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('⚠️  Adminユーザーは既に存在します')
      
      // パスワードを更新するかの確認
      if (process.env.UPDATE_PASSWORD === 'true') {
        const hashedPassword = await bcrypt.hash(adminPassword, 12)
        await prisma.user.update({
          where: { email: adminEmail },
          data: { password: hashedPassword }
        })
        console.log('✅ Adminユーザーのパスワードを更新しました')
      } else {
        console.log('パスワードを更新する場合は UPDATE_PASSWORD=true を設定してください')
      }
      return
    }

    // パスワードをハッシュ化（強度を12に上げる）
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // adminユーザーを作成
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Adminユーザーが作成されました')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Role:', admin.role)
    console.log('⚠️  パスワードは安全に保管してください')
  } catch (error) {
    console.error('❌ Adminユーザー作成エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
