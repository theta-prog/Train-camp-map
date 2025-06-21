#!/usr/bin/env node

/**
 * Supabase接続テスト用スクリプト
 * 使用方法: node scripts/test-supabase-connection.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function testSupabaseConnection() {
  console.log('🔍 Supabase接続テストを開始...\n')

  // 環境変数の確認
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('環境変数の確認:')
  console.log(`- SUPABASE_URL: ${supabaseUrl ? '✅ 設定済み' : '❌ 未設定'}`)
  console.log(`- SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ 設定済み' : '❌ 未設定'}\n`)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ 環境変数が設定されていません。')
    console.log('   .env.localファイルにSupabaseの設定を追加してください。\n')
    return
  }

  // Supabaseクライアントの作成
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // 接続テスト（campsitesテーブルの存在確認）
    console.log('🔄 データベース接続をテスト中...')
    const { data, error } = await supabase
      .from('campsites')
      .select('*')
      .limit(1)

    if (error) {
      console.log('❌ データベース接続エラー:')
      console.log(`   ${error.message}\n`)
      
      if (error.code === 'PGRST116') {
        console.log('💡 ヒント: campsitesテーブルが存在しない可能性があります。')
        console.log('   database/create_campsites_table.sql を使用してテーブルを作成してください。\n')
      }
    } else {
      console.log('✅ Supabase接続成功！')
      console.log(`   campsitesテーブルにアクセスできました。\n`)
    }

  } catch (err) {
    console.log('❌ 予期しないエラー:')
    console.log(`   ${err.message}\n`)
  }
}

// スクリプト実行
if (require.main === module) {
  testSupabaseConnection()
}

module.exports = { testSupabaseConnection }
