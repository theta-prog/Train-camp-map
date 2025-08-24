# CI/CD Environment Variables

GitHub Actionsのワークフローで使用される環境変数について説明します。

## テスト環境用環境変数

CIでは以下の環境変数が自動的に設定されます。これらはテスト用の値であり、本番環境では使用されません。

### 必須環境変数

```bash
# Node.js環境
NODE_ENV=test

# Google Maps API（テスト用ダミーキー）
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=test-api-key

# JWT秘密鍵（テスト用）
JWT_SECRET=test-jwt-secret-for-ci-only-not-for-production

# データベースURL（SQLiteテストDB）
DATABASE_URL="file:./test.db"
```

## 本番環境での設定

本番環境（Vercel）では、以下の環境変数を適切に設定する必要があります：

### Vercel Environment Variables

1. **Google Maps API Key**
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key
   ```

2. **JWT Secret**
   ```
   JWT_SECRET=your_secure_production_jwt_secret
   ```

3. **Database URL**
   ```
   DATABASE_URL=your_production_database_url
   ```

4. **Admin Password Hash**
   ```
   ADMIN_PASSWORD_HASH=hashed_admin_password
   ```

## セキュリティ注意事項

- CI環境で使用される値は **テスト専用** です
- 本番環境では必ず異なる、セキュアな値を使用してください
- 秘密情報はGitHubのSecretsまたはVercelの環境変数設定を使用してください
- `NEXT_PUBLIC_` プレフィックスが付いた変数はクライアントサイドに公開されます

## CI設定の変更

環境変数を変更する場合は、以下のファイルを更新してください：

- `.github/workflows/ci.yml`
- `.github/workflows/pr.yml`
- `.github/workflows/security.yml`

## トラブルシューティング

### よくある問題

1. **TypeScript エラー**
   - 型定義ファイルの更新: `npm run typecheck`
   - 厳密チェック: `npm run typecheck:strict`

2. **テスト失敗**
   - ローカル実行: `npm test`
   - カバレッジ確認: `npm run test:coverage`

3. **ビルド失敗**
   - 環境変数の確認
   - 依存関係の確認: `npm ci`

### デバッグ

GitHub ActionsのログでCI実行状況を確認できます：
- [Actions タブ](https://github.com/theta-prog/Train-camp-map/actions)
- 失敗したジョブの詳細ログを確認
- エラーメッセージからトラブルシューティング
