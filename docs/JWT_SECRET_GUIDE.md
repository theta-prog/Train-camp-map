# JWT_SECRET セキュリティガイド

## 🔐 JWT_SECRETとは

JWT_SECRET（JSON Web Token Secret）は、JWTトークンの署名と検証に使用される暗号鍵です。この値がシステムのセキュリティの要となります。

## 🎯 生成方法

### 推奨ツール

```bash
# プロジェクト専用ツール
npm run jwt:generate

# Node.js crypto（推奨）
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Python
python3 -c "import secrets; print(secrets.token_hex(64))"
```

### ❌ 避けるべき方法

- 辞書に載っている単語
- 短い文字列（32文字未満）
- 推測しやすいパターン
- 既存のパスワードの流用

## 🛡️ セキュリティ要件

### 最小要件
- **長さ**: 64文字以上（本番は128文字推奨）
- **エントロピー**: 暗号学的に安全なランダム性
- **文字種**: 16進数またはBase64エンコード

### ベストプラクティス
- 環境ごとに異なる値を使用
- 定期的な更新（6ヶ月〜1年）
- 適切な保管（環境変数、秘密管理システム）
- バックアップとローテーション計画

## 🔄 使用場面

1. **トークン生成時**
   ```typescript
   const jwt = await new SignJWT(payload).sign(secret);
   ```

2. **トークン検証時**
   ```typescript
   const { payload } = await jwtVerify(token, secret);
   ```

## 🚨 セキュリティリスク

### JWT_SECRETが漏洩した場合
- 攻撃者が偽のJWTトークンを生成可能
- 任意のユーザーになりすまし
- 管理者権限の不正取得

### 対策
- 即座にJWT_SECRETをローテーション
- 全ユーザーの強制ログアウト
- セキュリティ監査の実施

## 📋 チェックリスト

- [ ] 128文字以上のランダム文字列
- [ ] 暗号学的に安全な生成方法を使用
- [ ] 環境変数で管理
- [ ] .envファイルをGitignoreに追加
- [ ] 本番と開発で異なる値
- [ ] 定期的な更新計画

## 🛠️ 実装例

```bash
# 新しいJWT_SECRET生成
npm run jwt:generate

# .env.localに設定
echo 'JWT_SECRET="生成された値"' >> .env.local

# Vercel環境変数に設定
vercel env add JWT_SECRET
```
