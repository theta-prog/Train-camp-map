'use client'

export default function CsvImportForm() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">CSVインポート</h3>
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">
          CSVファイルからのキャンプ場データ一括インポート機能は将来的に実装予定です。
        </p>
        <div className="text-xs text-gray-500">
          <p>実装予定の機能：</p>
          <ul className="list-disc list-inside">
            <li>CSVフォーマット検証</li>
            <li>データプレビュー</li>
            <li>一括インポート</li>
            <li>エラーハンドリング</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
