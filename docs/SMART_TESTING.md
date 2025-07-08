# Smart Test Runner

このプロジェクトには、変更されたファイルに関連するテストのみを効率的に実行するスマートテストシステムが含まれています。

## 使用方法

### NPMスクリプト

```bash
# 変更されたファイル（未コミット）に関連するテストを実行
npm run test:smart

# ステージング済みファイルに関連するテストを実行
npm run test:smart:staged

# 特定のコミットからの変更に関連するテストを実行
npm run test:changed

# ウォッチモードでスマートテストを実行
npm run test:smart:watch

# 🎯 フォーカスドモード: 変更されたファイルのみのカバレッジを評価
npm run test:smart:focused

# フォーカスドモード + ウォッチモード
npm run test:smart:focused:watch

# ステージング済みファイルのフォーカスドモード
npm run test:smart:focused:staged

# 特定のファイルに関連するテストを実行
npm run test:related src/utils/facilityMapper.ts

# 特定のパターンのテストファイルを実行
npm run test:file CampsiteForm
```

### シェルスクリプト

```bash
# 未コミットの変更に関連するテストを実行
./scripts/test-changed.sh uncommitted

# ステージング済みの変更に関連するテストを実行
./scripts/test-changed.sh staged

# 特定のコミットからの変更に関連するテストを実行
./scripts/test-changed.sh since-commit HEAD~2
```

### Node.jsスクリプト

```bash
# 未コミットの変更に関連するテストを実行
node scripts/smart-test.js uncommitted

# ステージング済みの変更に関連するテストを実行
node scripts/smart-test.js staged

# ウォッチモードで実行
node scripts/smart-test.js uncommitted --watch
```

### VS Code タスク

`Ctrl+Shift+P` (Cmd+Shift+P on Mac) でコマンドパレットを開き、「Tasks: Run Task」を選択してから以下のタスクを選択：

- `test:changed` - 未コミットの変更に関連するテストを実行
- `test:staged` - ステージング済みの変更に関連するテストを実行
- `test:since-commit` - 特定のコミットからの変更に関連するテストを実行（コミット参照を入力）
- `test:focused` - 🎯 フォーカスドモード: 変更されたファイルのみのカバレッジを評価
- `test:focused:watch` - フォーカスドモード + ウォッチモード

## 機能

- **変更検出**: Gitを使用して変更されたファイルを自動検出
- **関連テスト発見**: Jestの`--findRelatedTests`を使用して関連するテストを自動発見
- **カバレッジ取得**: 実行されたテストのカバレッジレポートを生成
- **🎯 フォーカスドカバレッジ**: 変更されたファイルのみのカバレッジを評価（プロジェクト全体ではなく）
- **効率的な実行**: 変更されたファイルに関連するテストのみを実行して時間を節約
- **複数モード**: 未コミット、ステージング済み、特定コミットからの変更に対応

## 利点

- **高速**: 全テストではなく、関連するテストのみを実行
- **効率的**: 開発フローに統合して継続的にテスト品質を維持
- **柔軟**: 様々な変更パターンに対応
- **視覚的**: カラー出力と詳細なカバレッジ情報を提供

## 例

ファイル `src/utils/facilityMapper.ts` を変更した場合：

```bash
npm run test:smart
```

このコマンドは自動的に以下を実行します：
1. 変更されたファイルを検出 (`src/utils/facilityMapper.ts`)
2. 関連するテストファイルを発見 (`src/utils/__tests__/facilityMapper.test.ts`)
3. 関連するテストのみを実行
4. カバレッジレポートを生成

これにより、開発サイクルを高速化し、変更に対する適切なテストカバレッジを維持できます。
