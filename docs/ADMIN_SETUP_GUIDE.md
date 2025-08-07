# 管理者アカウント作成ガイド

## セキュリティ重要事項

**⚠️ 管理者パスワードは絶対にコードにハードコードしないでください**

## 安全な管理者作成方法

### 1. 環境変数ファイルの作成

```bash
# .env.local ファイルを作成（このファイルはGitに含まれません）
cp .env.example .env.local
```

### 2. 管理者情報の設定

`.env.local` ファイルを編集：

```bash
# 管理者設定
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=your_very_secure_password_here
```

### 3. 管理者アカウントの作成

```bash
# 新規作成
ADMIN_PASSWORD=your_secure_password node scripts/create-admin.js

# または .env.local に設定済みの場合
node scripts/create-admin.js
```

### 4. パスワード更新（必要時）

```bash
UPDATE_PASSWORD=true ADMIN_PASSWORD=new_secure_password node scripts/create-admin.js
```

## パスワード要件

- **最低8文字以上**
- 英数字・記号を組み合わせることを推奨
- 辞書にある単語は避ける
- 他のサービスと同じパスワードは使用しない

## 本番環境での注意事項

1. **環境変数での管理**：本番環境では必ず環境変数でパスワードを設定
2. **定期的な変更**：管理者パスワードは定期的に変更
3. **アクセスログの監視**：管理者アクセスのログを監視
4. **2FA推奨**：可能であれば2要素認証を導入

## トラブルシューティング

### エラー: ADMIN_PASSWORD環境変数が設定されていません

```bash
# 直接指定して実行
ADMIN_PASSWORD=your_password node scripts/create-admin.js
```

### パスワードが短すぎるエラー

8文字以上のパスワードを設定してください。

## セキュリティチェックリスト

- [ ] `.env.local` ファイルが `.gitignore` に含まれている
- [ ] ハードコードされたパスワードがコードに含まれていない
- [ ] 管理者パスワードが8文字以上
- [ ] 本番環境で環境変数が適切に設定されている
- [ ] 不要な管理者アカウントが存在しない
