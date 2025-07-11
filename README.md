# 電車で行けるキャンプ場検索アプリ

公共交通機関でアクセス可能なキャンプ場を検索できるWebアプリケーションです。

## 主な機能

- 🗺️ **インタラクティブ地図**: Google Maps APIを使用した地図表示
- 🔍 **詳細検索**: キーワード、価格、設備、アクティビティでの絞り込み
- 🚂 **電車アクセス情報**: 最寄り駅からのアクセス時間を表示
- 📍 **リアルタイム表示**: 地図上でキャンプ場の位置を確認
- 📱 **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- ⚙️ **管理機能**: キャンプ場の登録・編集・削除
- 🌍 **多言語対応**: 日本語・英語対応
- 🧪 **100%テストカバレッジ**: Jest + Testing Library

## 技術スタック

- **フロントエンド**: React 18, Next.js 14 (App Router)
- **バックエンド**: Next.js API Routes, Supabase
- **データベース**: PostgreSQL (Supabase)
- **スタイリング**: Tailwind CSS
- **地図**: Google Maps API (@vis.gl/react-google-maps)
- **フォーム管理**: React Hook Form + Zod
- **言語**: TypeScript
- **国際化**: next-intl

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下を追加：

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabaseセットアップ

1. [Supabase](https://supabase.com/)でアカウントを作成
2. 新しいプロジェクトを作成
3. SQL Editorで`database/create_campsites_table.sql`を実行
4. プロジェクトURLとAnon Keyを`.env.local`に設定

### 4. Google Maps APIキーの設定

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. Maps JavaScript APIを有効化
3. APIキーを作成し、`.env.local`に設定

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## プロジェクト構造

```
src/
├── app/
│   ├── admin/                 # 管理画面
│   │   ├── campsites/
│   │   │   └── new/page.tsx   # キャンプ場新規登録
│   │   └── page.tsx           # 管理ダッシュボード
│   ├── api/
│   │   └── campsites/         # キャンプ場API
│   ├── [locale]/              # 国際化対応ページ
│   ├── globals.css            # グローバルスタイル
│   ├── layout.tsx             # アプリケーションレイアウト
│   └── page.tsx               # メインページ
├── components/
│   ├── admin/                 # 管理画面コンポーネント
│   │   ├── AdminLayout.tsx
│   │   └── CampsiteForm.tsx
│   ├── MapComponent.tsx       # 地図表示コンポーネント
│   ├── SearchFilters.tsx     # 検索フィルターコンポーネント
│   ├── CampsiteList.tsx      # キャンプ場リストコンポーネント
│   └── LanguageSwitcher.tsx  # 言語切り替え
├── lib/
│   ├── supabase.ts           # Supabaseクライアント
│   └── validations/
│       └── campsite.ts       # バリデーションスキーマ
├── types/
│   └── campsite.ts           # 型定義
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

- [ ] 実際のキャンプ場データベースとの連携
- [ ] 公共交通機関の路線情報表示
- [ ] ルート検索機能（出発地からキャンプ場まで）
- [ ] ユーザーレビュー機能
- [ ] お気に入り機能
- [ ] キャンプ場の管理者向け登録・編集機能
- [ ] オフライン対応
- [ ] 多言語対応

## ライセンス

MIT License

## 開発者向け情報

### 環境変数

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps APIキー（必須）

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
