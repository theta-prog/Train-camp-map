'use client'

import { Campsite } from '@/types/campsite'

interface DuplicateCheckerProps {
  existingCampsites: Campsite[]
  currentData: any
  onDuplicateFound: (duplicates: Campsite[]) => void
}

export default function DuplicateChecker({ 
  existingCampsites, 
  currentData, 
  onDuplicateFound: _onDuplicateFound 
}: DuplicateCheckerProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">重複チェック</h3>
      <p className="text-sm text-gray-600 mb-4">
        既存のキャンプ場: {existingCampsites.length}件
      </p>
      {currentData?.name_ja && (
        <div className="text-sm text-gray-600">
          <p>入力中: {currentData.name_ja}</p>
        </div>
      )}
      <div className="text-xs text-gray-500 mt-2">
        <p>実装予定の機能：</p>
        <ul className="list-disc list-inside">
          <li>名前による重複検出</li>
          <li>住所による重複検出</li>
          <li>座標による近接チェック</li>
        </ul>
      </div>
    </div>
  )
}
