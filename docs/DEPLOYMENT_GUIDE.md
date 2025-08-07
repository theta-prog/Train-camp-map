# デプロイメントガイド

## 1. 環境変数の設定

### 必須の環境変数

プロダクション環境では以下の環境変数を設定してください：

```bash
# データベース設定（PostgreSQL）
DATABASE_URL=postgresql://username:password@host:5432/database_name

# JWT設定
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 管理者設定
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=your_very_secure_password
ADMIN_ALLOWED_EMAILS=admin1@example.com,admin2@example.com

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Next.js設定
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-key
NODE_ENV=production
```

## 2. データベースの準備

### PostgreSQLの設定
```bash
# Prismaのマイグレーション実行
npx prisma generate
npx prisma migrate deploy

# 管理者アカウントの作成
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secure_password node scripts/create-admin.js
```

## 3. ビルドとデプロイ

### ローカルでのビルドテスト
```bash
npm run build
npm start
```

### Vercelでのデプロイ
1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. PostgreSQLデータベースを用意（Vercel Postgres推奨）
4. 自動デプロイ設定

**重要**: Prismaクライアントの生成は自動的に実行されます：
- `package.json`の`build`スクリプトに`prisma generate`が含まれています
- `vercel.json`でビルドコマンドを明示的に指定
- PostgreSQL用のバイナリターゲットを設定済み

### その他のプラットフォーム
- Docker化対応
- AWS/GCP/Azureでのデプロイ対応

## 4. セキュリティチェックリスト

- [ ] 強力なJWT_SECRETを設定
- [ ] 管理者パスワードを環境変数で管理
- [ ] HTTPS接続の確保
- [ ] データベース接続の暗号化
- [ ] CORS設定の確認
- [ ] 本番環境でのコンソールログ削除

## 5. パフォーマンス最適化

- [ ] 画像の最適化
- [ ] CDNの設定
- [ ] データベースインデックスの確認
- [ ] キャッシュ戦略の実装

## 6. 監視とログ

- [ ] エラーログの監視設定
- [ ] パフォーマンス監視
- [ ] アップタイム監視
- [ ] データベース監視

## 7. トラブルシューティング

### よくある問題
1. **データベース接続エラー**
   - DATABASE_URLの確認
   - ネットワーク設定の確認

2. **認証エラー**
   - JWT_SECRETの確認
   - 管理者アカウントの存在確認

3. **ビルドエラー**
   - 型エラーの修正
   - 依存関係の確認
