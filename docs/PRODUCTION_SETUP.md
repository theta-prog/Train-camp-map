# 本番環境セットアップガイド

## 📋 Vercelデプロイ後のセットアップ手順

### ステップ 1: Vercelでデータベースと環境変数を設定

#### A. Neon Postgres使用（推奨）

1. **Vercelダッシュボード** > **Storage** > **Marketplace Database Providers**
2. **Neon** (Serverless Postgres) を選択
3. **Install** をクリック
4. Neonアカウントの作成/ログイン
5. データベース作成（プロジェクト名: `train-camp-app` など）
6. **Connect to Vercel** でプロジェクトを選択
7. 環境変数が自動設定される：
   - `DATABASE_URL` (プール接続用)
   - `DIRECT_URL` (直接接続用)

#### B. 環境変数の追加設定

**Vercelダッシュボード** > **プロジェクト** > **Settings** > **Environment Variables**

Neonで自動設定されない環境変数を手動追加：
```bash
JWT_SECRET=your-super-secret-production-key-min-32-chars
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_very_secure_password
ADMIN_ALLOWED_EMAILS=admin@yourdomain.com,another@admin.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

**重要**: すべての環境変数で **Environment** を `Production` に設定してください。

#### C. 環境変数確認

デプロイ後、以下のURLで環境変数を確認：
```
https://your-app.vercel.app/api/debug/env?debug=true
```

### ステップ 2: ローカルから本番データベースをセットアップ

#### 方法A: 自動セットアップスクリプト（推奨）

```bash
# Vercelから本番のDATABASE_URLをコピー
export DATABASE_URL="postgresql://username:password@host:port/database"
export ADMIN_PASSWORD="your_secure_password"

# セットアップ実行
./scripts/setup-production.sh
```

#### 方法B: 手動セットアップ

```bash
# 1. 環境変数設定
export DATABASE_URL="postgresql://username:password@host:port/database"
export ADMIN_PASSWORD="your_secure_password"

# 2. データベーススキーマ作成
npm run db:schema

# 3. 管理者アカウント作成
npm run admin:create
```

### ステップ 3: 動作確認

1. **メインサイト**にアクセス: `https://your-app.vercel.app`
2. **管理者ログイン**をテスト: `https://your-app.vercel.app/admin/login`
3. **APIテスト**: ブラウザの開発者ツールでネットワークエラーを確認

## 🔧 トラブルシューティング

### エラー: "psql: command not found"

PostgreSQLクライアントをインストール：

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-client
```

**Windows:**
- PostgreSQL公式サイトからインストーラーをダウンロード
- または Docker を使用

### エラー: "connection refused"

1. DATABASE_URLが正しいことを確認
2. Vercel Postgresの場合、接続制限を確認
3. IPアドレス制限がある場合は許可リストに追加

### エラー: "table already exists"

```bash
# テーブルを削除して再作成
psql "$DATABASE_URL" -c "DROP TABLE IF EXISTS campsites, users CASCADE;"
npm run db:schema
```

## 🏗️ 代替セットアップ方法

### Vercel Functions経由でのセットアップ

管理者用のAPIエンドポイントを作成してVercel上で直接実行：

1. `/api/admin/setup` エンドポイントにアクセス
2. 初回セットアップを自動実行
3. セキュリティのため、セットアップ後は無効化

### Prisma Studio使用

```bash
# ローカルでPrisma Studio起動
DATABASE_URL="your-production-url" npx prisma studio
```

ブラウザでデータベースを直接編集可能

## 📊 セットアップ完了確認

- [ ] テーブルが正常に作成された
- [ ] 管理者アカウントでログイン可能
- [ ] キャンプサイトAPI（/api/campsites）が正常動作
- [ ] 地図表示が正常（Google Maps API）
- [ ] 管理画面でCRUD操作が可能
