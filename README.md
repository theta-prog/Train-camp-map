# 電車で行けるキャンプ場検索アプリ

公共交通機関でアクセス可能なキャンプ場を検索できるWebアプリケーションです。

## 主な機能

- 🗺️ **インタラクティブ地図**: Google Maps APIを使用した地図表示
- 🔍 **詳細検索**: キーワード、価格、設備、アクティビティでの絞り込み
- 🚂 **電車アクセス情報**: 最寄り駅からのアクセス時間を表示
- 📍 **リアルタイム表示**: 地図上でキャンプ場の位置を確認
- 📱 **レスポンシブデザイン**: PC・タブレット・スマートフォン対応

## 技術スタック

- **フロントエンド**: React 18, Next.js 14
- **スタイリング**: Tailwind CSS
- **地図**: Google Maps API (@react-google-maps/api)
- **言語**: TypeScript

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Maps APIキーの設定

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. Maps JavaScript APIを有効化
3. APIキーを作成
4. `.env.local`ファイルを作成し、以下を追加：

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## プロジェクト構造

```
src/
├── app/
│   ├── globals.css      # グローバルスタイル
│   ├── layout.tsx       # アプリケーションレイアウト
│   └── page.tsx         # メインページ
├── components/
│   ├── MapComponent.tsx       # 地図表示コンポーネント
│   ├── SearchFilters.tsx     # 検索フィルターコンポーネント
│   └── CampsiteList.tsx      # キャンプ場リストコンポーネント
└── types/
    └── campsite.ts      # 型定義
```

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
