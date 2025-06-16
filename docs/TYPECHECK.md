# TypeScript TypeCheck プロジェクト

このプロジェクトには包括的なTypeScriptの型チェックシステムが導入されています。

## 利用可能なスクリプト

### 基本的なチェック
- `npm run typecheck` - 基本的なTypeScript型チェック
- `npm run lint` - ESLintによるコード品質チェック
- `npm run validate` - 型チェック + ESLint

### 厳密なチェック
- `npm run typecheck:strict` - より厳密なTypeScript型チェック
- `npm run validate:strict` - 厳密な型チェック + ESLint

### その他のチェック
- `npm run lint:fix` - ESLintエラーの自動修正
- `npm run check-types` - prettierな出力でのTypeScript型チェック
- `npm run test:types` - skipLibCheckなしの型チェック

### CI/CD
- `npm run ci` - CI環境用の包括的チェック（型チェック + lint + ビルド）
- `npm run full-check` - 完全なチェックスクリプト実行

## TypeScript設定

### tsconfig.json
基本的なTypeScript設定ファイルです。Next.js App Routerに最適化されています。

### tsconfig.strict.json
より厳密な型チェック用の設定ファイルです。以下のオプションが有効になっています：

- `noUnusedLocals`: 未使用のローカル変数を検出
- `noUnusedParameters`: 未使用のパラメータを検出
- `exactOptionalPropertyTypes`: オプショナルプロパティの厳密な型チェック
- `noImplicitReturns`: 戻り値が暗黙的に未定義になることを防止
- `noFallthroughCasesInSwitch`: switch文のfall-throughを防止
- `noUncheckedIndexedAccess`: インデックスアクセスでの安全性確保
- `noImplicitOverride`: オーバーライドの明示的な指定を要求

## VSCode設定

`.vscode/settings.json`には以下の設定が含まれています：

- TypeScriptの自動インポート
- ESLintの自動修正
- Tailwind CSSサポート
- ファイル除外設定

## ベストプラクティス

1. **開発前**: `npm run typecheck` でエラーチェック
2. **コミット前**: `npm run validate:strict` で厳密なチェック
3. **CI/CD**: `npm run ci` で包括的なチェック

## エラー対応

TypeScriptエラーが発生した場合：

1. エラーメッセージを確認
2. 該当箇所の型定義を確認
3. 必要に応じて型アノテーションを追加
4. `npm run typecheck` で修正を確認

## 追加リソース

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js TypeScript ドキュメント](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [ESLint 設定ガイド](https://eslint.org/docs/user-guide/configuring/)
