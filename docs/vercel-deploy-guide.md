# Train Camp App - Vercelデプロイガイド

## 前提条件
- GitHubアカウント
- Vercelアカウント
- このプロジェクトがGitHubにプッシュされていること

## デプロイ手順

### 1. プロジェクトの準備
```bash
# 依存関係の確認
npm install

# ビルドテスト
npm run build

# 型チェック
npm run typecheck
```

### 2. 環境変数の準備
Vercelで以下の環境変数を設定：

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Vercelでのデプロイ

#### 方法A: Vercel Dashboard（推奨）
1. [vercel.com](https://vercel.com) にアクセス
2. GitHubアカウントでサインアップ/ログイン
3. "New Project" をクリック
4. GitHubリポジトリを選択
5. 環境変数を設定
6. "Deploy" をクリック

#### 方法B: Vercel CLI
```bash
# Vercel CLIのインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ
vercel --prod
```

### 4. カスタムドメインの設定（オプション）
1. Vercel Dashboardでプロジェクトを選択
2. "Settings" > "Domains"
3. カスタムドメインを追加
4. DNSレコードを設定

### 5. 自動デプロイの設定
- GitHubにプッシュすると自動的にデプロイされる
- プレビュー環境も自動作成される

## その他の設定

### next.config.jsの本番環境向け設定
```javascript
const nextConfig = {
  // 画像最適化の設定を本番環境向けに調整
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ymdjulwkwoppfkbtnqnu.supabase.co',
      },
      // 他の信頼できるドメインのみ追加
    ],
  },
  // その他の設定...
}
```

## 監視とメンテナンス
- Vercel Analytics（無料）でパフォーマンス監視
- Supabase Dashboardでデータベース監視
- Google Cloud Consoleで Maps APIの使用量監視

## コスト管理
- **Vercel**: 個人プロジェクトは無料
- **Supabase**: 500MB DB、5GB転送量/月まで無料
- **Google Maps**: 月$200相当の無料枠

## トラブルシューティング
- ビルドエラー: 型エラーやlintエラーを修正
- 環境変数エラー: Vercel Dashboardで設定確認
- API制限: 各サービスの使用量を監視
