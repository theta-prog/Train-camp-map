# 電車で行けるキャンプ場検索アプリ

[![CI](https://github.com/theta-prog/Train-camp-map/actions/workflows/ci.yml/badge.svg)](https://github.com/theta-prog/Train-camp-map/actions/workflows/ci.yml)
[![Security Check](https://github.com/theta-prog/Train-camp-map/actions/workflows/security.yml/badge.svg)](https://github.com/theta-prog/Train-camp-map/actions/workflows/security.yml)
[![codecov](https://codecov.io/gh/theta-prog/Train-camp-map/branch/main/graph/badge.svg)](https://codecov.io/gh/theta-prog/Train-camp-map)

公共交通機関でアクセス可能なキャンプ場を検索できるWebアプリケーションです。

## 主な機能

- **インタラクティブ地図**: Google Maps APIを使用した地図表示
- **詳細検索**: キーワード、価格、設備、アクティビティでの絞り込み
- **電車アクセス情報**: 最寄り駅からのアクセス時間を表示
- **リアルタイム表示**: 地図上でキャンプ場の位置を確認
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- **管理機能**: キャンプ場の登録・編集・削除
- **多言語対応**: 日本語・英語対応
- **セキュリティ**: Edge Runtime対応JWT認証
- **テスト**: Jest + Testing Library（現在のカバレッジ: 45%）

## 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes, Prisma ORM
- **データベース**: SQLite (開発環境), PostgreSQL (本番環境)
- **認証**: JWT + HttpOnly Cookies (Edge Runtime対応)
- **地図表示**: Google Maps API
- **国際化**: next-intl
- **テスト**: Jest, Testing Library
- **デプロイ**: Vercel対応

## セットアップ

### 開発環境

1. **依存関係のインストール**
```bash
npm install
```

2. **環境変数の設定**
`.env.local`ファイルを作成：
```bash
# データベース設定（SQLite for development）
DATABASE_URL="file:./dev.db"

# JWT認証設定
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 管理者設定
ADMIN_EMAIL="admin@example.com"
ADMIN_ALLOWED_EMAILS="admin@example.com"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

3. **データベースセットアップ**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **管理者アカウント作成**
```bash
ADMIN_PASSWORD=secure_password node scripts/create-admin.js
```

5. **開発サーバー起動**
```bash
npm run dev
```

## ビルド & デプロイ

### ローカルビルド
```bash
npm run build
npm start
```

## プロジェクト構造

```
src/
├── app/
│   ├── admin/                 # 管理画面
│   │   ├── campsites/         # キャンプ場管理
│   │   ├── login/             # ログイン
│   │   └── page.tsx           # 管理ダッシュボード
│   ├── api/
│   │   └── campsites/         # キャンプ場API
│   ├── [locale]/              # 国際化対応ページ
│   ├── layout.tsx             # アプリケーションレイアウト
│   └── page.tsx               # メインページ
├── components/
│   ├── admin/                 # 管理画面コンポーネント
│   │   ├── AdminLayout.tsx    # 管理画面レイアウト
│   │   ├── CampsiteForm.tsx   # キャンプ場フォーム
│   │   ├── LoginForm.tsx      # ログインフォーム
│   │   └── ...               # その他管理画面コンポーネント
│   ├── MapComponent.tsx       # 地図表示コンポーネント
│   ├── SearchFilters.tsx     # 検索フィルターコンポーネント
│   ├── CampsiteList.tsx      # キャンプ場リストコンポーネント
│   └── LanguageSwitcher.tsx  # 言語切り替え
├── lib/
│   ├── auth-server.ts        # サーバーサイド認証
│   ├── auth.ts              # クライアントサイド認証
│   ├── database-helpers.ts   # データベースヘルパー
│   ├── imageUpload.ts       # 画像アップロード
│   ├── prisma.ts            # Prismaクライアント
│   └── validations/
│       └── campsite.ts       # バリデーションスキーマ
├── types/
│   ├── campsite.ts           # キャンプ場型定義
│   └── jest-dom.d.ts         # Jest DOM型定義
├── i18n/                     # 国際化設定
├── utils/                    # ユーティリティ関数
└── __tests__/                # テストファイル
```

## 管理機能

### アクセス方法
`/admin`にアクセスして管理画面を利用できます：

- **ダッシュボード**: `/admin` - 統計情報とクイックアクション
- **キャンプ場一覧**: `/admin/campsites` - 登録済みキャンプ場の一覧・編集・削除
- **新規登録**: `/admin/campsites/new` - 新しいキャンプ場の登録

### キャンプ場登録フォーム
以下の情報を入力してキャンプ場を登録できます：

- **基本情報**: 名前（日本語・英語）、位置情報（緯度・経度）、住所
- **連絡先**: 電話番号、ウェブサイト、料金
- **アクセス**: 最寄り駅、アクセス時間
- **詳細**: 説明文（日本語・英語）
- **設備**: トイレ、シャワー、駐車場、WiFi、BBQ場など
- **アクティビティ**: ハイキング、釣り、水泳、サイクリングなど

## 機能詳細

### 地図表示機能
- Google Maps APIを使用した地図表示
- キャンプ場の位置をマーカーで表示
- マーカークリックで詳細情報を表示

### 検索・フィルタリング機能
- **キーワード検索**: キャンプ場名、住所での検索
- **価格フィルター**: 最大料金での絞り込み（¥1,000〜¥10,000）
- **設備フィルター**: トイレ、シャワー、炊事場などの設備
- **アクティビティフィルター**: ハイキング、釣り、バーベキューなど

### キャンプ場情報
各キャンプ場には以下の情報が含まれます：
- 基本情報（名前、住所、電話番号、ウェブサイト）
- 料金情報
- 利用可能な設備
- 楽しめるアクティビティ
- 最寄り駅とアクセス時間
- 詳細説明

## 今後の拡張予定

- 実際のキャンプ場データベースとの連携
- 公共交通機関の路線情報表示
- ルート検索機能（出発地からキャンプ場まで）
- ユーザーレビュー機能
- お気に入り機能
- キャンプ場の管理者向け登録・編集機能
- オフライン対応
- 多言語対応の拡張

## ライセンス

MIT License

## CI/CD

このプロジェクトはGitHub Actionsを使用した継続的インテグレーション（CI）を実装しています。

### ワークフロー

#### メインCI (`ci.yml`)
- **トリガー**: `main`, `develop` ブランチへのプッシュ・プルリクエスト
- **実行内容**:
  - TypeScript型チェック
  - ESLint実行
  - Jest テストカバレッジ付き実行
  - Next.js ビルド
  - Codecovへのカバレッジレポート送信

#### プルリクエストチェック (`pr.yml`)
- **トリガー**: プルリクエストの作成・更新
- **実行内容**:
  - 変更ファイルの検出
  - 変更されたファイルに関連するテストのみ実行
  - バンドルサイズチェック
  - ESLint（変更ファイルのみ）


### Dependabot

- **npm依存関係**: 毎週月曜日にチェック
- **GitHub Actions**: 毎月チェック
- 自動でプルリクエストを作成し、セキュリティアップデートを提案



### スクリプト

- `npm run dev`: 開発サーバーの起動
- `npm run build`: プロダクションビルド
- `npm run start`: プロダクションサーバーの起動
- `npm run lint`: ESLintによるコードチェック
- `npm run test`: テスト実行
- `npm run test:coverage`: テストカバレッジ確認
- `npm run typecheck`: TypeScript型チェック

### API エンドポイント

- `GET /api/campsites` - キャンプ場一覧取得
- `POST /api/campsites` - キャンプ場新規作成
- `GET /api/campsites/[id]` - 個別キャンプ場取得
- `PUT /api/campsites/[id]` - キャンプ場更新
- `DELETE /api/campsites/[id]` - キャンプ場削除

### データ構造

キャンプ場データは以下の型で管理されています：

```typescript
interface Campsite {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  phone: string
  website: string
  price: string
  facilities: string[]
  activities: string[]
  nearestStation: string
  accessTime: string
  description: string
}
```
