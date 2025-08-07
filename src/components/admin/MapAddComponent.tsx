'use client'

interface MapAddComponentProps {
  onLocationSelect: (lat: number, lng: number) => void
}

export default function MapAddComponent({ onLocationSelect: _onLocationSelect }: MapAddComponentProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">地図で位置選択</h3>
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">
          Google Maps統合による位置選択機能は将来的に実装予定です。
        </p>
        <div className="text-xs text-gray-500">
          <p>実装予定の機能：</p>
          <ul className="list-disc list-inside">
            <li>インタラクティブマップ</li>
            <li>クリックによる座標取得</li>
            <li>マーカー配置・移動</li>
            <li>住所の逆ジオコーディング</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
