# 管理者アカウント登録制限設定ガイド

## 🔒 セキュリティ設定の選択肢

### 方法1: 特定メールアドレス制限（推奨）

特定のメールアドレスのみアカウント登録を許可します。

#### 設定手順
1. `.env.local` ファイルを編集
2. `ADMIN_ALLOWED_EMAILS` を設定

```bash
# 単一メールアドレス
ADMIN_ALLOWED_EMAILS=your-email@example.com

# 複数メールアドレス（カンマ区切り）
ADMIN_ALLOWED_EMAILS=admin1@example.com,admin2@example.com,admin3@example.com
```

#### 動作
- 設定されたメールアドレスのみ登録可能
- 未設定の場合は全てのメールを許可（開発時）
- 設定外のメールアドレスでは「このメールアドレスでは登録できません」エラー

### 方法2: 招待コード方式

事前定義された招待コードが必要です。

#### 設定手順
1. `.env.local` ファイルに招待コードを追加
2. LoginFormを招待コード対応版に変更

```bash
# 招待コード設定
ADMIN_INVITE_CODES=SECRET123,ADMIN456,INVITE789
```

## 🚀 実装状況

### ✅ 現在実装済み
- メールアドレス制限機能
- API Route (`/api/admin/check-email`)
- セキュアなサーバーサイドチェック

### 📋 選択可能な追加実装
- 招待コード方式（API Route は作成済み）
- 初回登録のみ許可
- 管理者承認方式

## 💡 推奨設定

### 個人利用の場合
```bash
ADMIN_ALLOWED_EMAILS=your-actual-email@gmail.com
```

### チーム利用の場合
```bash
ADMIN_ALLOWED_EMAILS=admin@company.com,manager@company.com
```

## 🔧 本番環境での注意点

1. **必ず環境変数を設定**: 未設定だと誰でも登録可能
2. **メールアドレスは小文字で**: システムが自動的に小文字変換
3. **Vercel デプロイ時**: Environment Variables に同じ設定を追加

## 🎯 現在の動作確認

1. http://localhost:3002/admin/login にアクセス
2. 「アカウントをお持ちでない方はこちら」をクリック
3. 未許可のメールアドレスで登録を試す → エラーメッセージ表示
4. 許可されたメールアドレスで登録 → 正常処理

## 📝 次のステップ

現在の `.env.local` の `ADMIN_ALLOWED_EMAILS` を実際のメールアドレスに変更してください：

```bash
ADMIN_ALLOWED_EMAILS=your-actual-email@example.com
```
