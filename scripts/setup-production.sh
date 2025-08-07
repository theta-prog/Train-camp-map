#!/bin/bash

# Vercel本番環境セットアップスクリプト
# 使用方法: ./scripts/setup-production.sh

echo "🚀 本番環境のデータベースセットアップを開始します..."

# 環境変数の確認
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL環境変数が設定されていません"
    echo ""
    echo "Vercelでの設定手順:"
    echo "1. Vercelダッシュボード > Storage > Marketplace Database Providers"
    echo "2. Neon (Serverless Postgres) を選択"
    echo "3. Install & Connect to Vercel"
    echo "4. DATABASE_URLを確認してこのスクリプトを再実行"
    echo ""
    echo "現在の環境変数をチェック:"
    echo "https://your-app.vercel.app/api/debug/env?debug=true"
    exit 1
fi

if [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ ADMIN_PASSWORD環境変数が設定されていません"
    echo "例: ADMIN_PASSWORD=secure_password ./scripts/setup-production.sh"
    exit 1
fi

echo "📊 データベース接続テスト..."
psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ データベースに接続できません。DATABASE_URLを確認してください"
    echo "DATABASE_URL: ${DATABASE_URL:0:30}..."
    exit 1
fi

echo "✅ データベース接続成功"

echo "🗃️ テーブル作成中..."
psql "$DATABASE_URL" -f database/postgresql-schema.sql

if [ $? -eq 0 ]; then
    echo "✅ テーブル作成完了"
else
    echo "⚠️ テーブル作成でエラーが発生しました（既に存在する可能性があります）"
fi

echo "🔧 Prismaクライアント生成..."
npx prisma generate

echo "👤 管理者アカウント作成..."
DATABASE_URL="$DATABASE_URL" ADMIN_PASSWORD="$ADMIN_PASSWORD" node scripts/create-admin.js

echo "🎉 本番環境のセットアップが完了しました！"
echo ""
echo "次のステップ:"
echo "1. Vercelサイトにアクセスして動作確認"
echo "2. /admin/login で管理者ログインテスト"
echo "3. Google Maps APIキーの設定確認"
