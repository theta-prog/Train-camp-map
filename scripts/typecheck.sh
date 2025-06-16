#!/bin/bash

# TypeScript型チェックスクリプト
echo "🔍 TypeScript型チェックを開始しています..."

# 基本的な型チェック
echo "📋 基本的な型チェック..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ TypeScript型エラーが見つかりました"
    exit 1
fi

echo "✅ TypeScript型チェック完了"

# ESLintチェック
echo "📋 ESLintチェック..."
npm run lint

if [ $? -ne 0 ]; then
    echo "❌ ESLintエラーが見つかりました"
    exit 1
fi

echo "✅ ESLintチェック完了"

# Next.jsビルドテスト
echo "📋 Next.jsビルドテスト..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ ビルドエラーが見つかりました"
    exit 1
fi

echo "🎉 すべてのチェックが成功しました！"
