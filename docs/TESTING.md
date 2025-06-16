# ユニットテスト設定ガイド

## 概要

train-camp-appプロジェクトにJest + React Testing Libraryを使用したユニットテスト環境を構築しました。

## 設定ファイル

### Jest設定 (`jest.config.js`)
- Next.jsのJest設定を使用
- TypeScriptサポート
- モジュールエイリアス (`@/` -> `src/`)
- ESMモジュール対応 (next-intl)

### セットアップファイル (`jest.setup.js`)
- Testing Library Jest DOM設定
- next-intlのモック
- next/navigationのモック
- Global Reactの設定

### TypeScript型定義 (`src/types/jest-dom.d.ts`)
- Jest DOMのカスタムマッチャー型定義

## テストファイル構造

```
src/
├── components/
│   └── __tests__/
│       ├── CampsiteList.test.tsx
│       └── LanguageSwitcher.test.tsx
└── utils/
    ├── campsiteUtils.ts
    └── __tests__/
        └── campsiteUtils.test.ts
```

## 実装されたテスト

### CampsiteListコンポーネント
- ✅ キャンプ場リストの表示
- ✅ 空の状態メッセージ
- ✅ 設備とアクティビティの表示
- ✅ 詳細クリックメッセージ
- ✅ カウント表示

### LanguageSwitcherコンポーネント
- ✅ 基本的なレンダリング（simplified）

### ユーティリティ関数
- ✅ filterCampsites関数のテスト
  - キーワードフィルタリング
  - 設備フィルタリング
  - アクティビティフィルタリング
  - 条件に合わない場合の処理
- ✅ extractPrice関数のテスト
  - 価格文字列からの数値抽出
  - コンマ区切り対応
  - 無効な文字列の処理

## テストコマンド

```bash
# テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジレポート生成
npm run test:coverage
```

## カバレッジ結果

現在のテストカバレッジ:
- **CampsiteList.tsx**: 84.61% (良好)
- **campsiteUtils.ts**: 100% (完全)
- **全体**: 18.45% (他のコンポーネントのテストが必要)

## 今後の改善点

### 1. 追加テストが必要なコンポーネント
- [ ] CampsiteSearchApp.tsx
- [ ] LanguageSwitcher.tsx (完全版)
- [ ] MapComponent.tsx
- [ ] SearchFilters.tsx

### 2. E2Eテスト
- [ ] Playwright設定
- [ ] ユーザーフロー全体のテスト

### 3. テストユーティリティ
- [ ] カスタムレンダー関数
- [ ] モックデータファクトリー
- [ ] テストヘルパー関数

## ベストプラクティス

1. **テストの命名**: 日本語で期待する動作を記述
2. **モックの使用**: 外部依存を適切にモック
3. **型安全性**: TypeScriptの型チェックを活用
4. **アクセシビリティ**: Testing Libraryの推奨方法を使用
5. **カバレッジ**: 重要なロジックは100%を目指す

## トラブルシューティング

### よくある問題

1. **next-intlのESMエラー**
   - `transformIgnorePatterns`でnext-intlを除外

2. **型定義エラー**
   - jest-dom.d.tsで型定義を追加

3. **モックの問題**
   - jest.setup.jsで適切にモック設定

### 参考リンク

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing/jest)
