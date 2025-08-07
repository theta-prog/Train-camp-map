'use client'

interface AddressGeocoderProps {
  onLocationFound: (lat: number, lng: number, address: string) => void
}

export default function AddressGeocoder({ onLocationFound: _onLocationFound }: AddressGeocoderProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">住所検索（ジオコーディング）</h3>
      <p className="text-sm text-gray-600 mb-4">
        この機能は将来的に実装予定です。現在は手動で緯度・経度を入力してください。
      </p>
      <div className="text-xs text-gray-500">
        <p>実装予定の機能：</p>
        <ul className="list-disc list-inside">
          <li>住所入力によるGoogle Geocoding API連携</li>
          <li>自動的な緯度・経度取得</li>
          <li>住所の正規化</li>
        </ul>
      </div>
    </div>
  )
}
