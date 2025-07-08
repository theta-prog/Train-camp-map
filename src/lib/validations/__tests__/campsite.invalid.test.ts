　　import { campsiteSchema } from '@/lib/validations/campsite'

describe('campsiteSchema 異常系', () => {
  it('必須フィールドが欠けている場合はエラー', () => {
    const invalidData = {
      lat: 35.6,
      lng: 139.6,
      address_ja: '東京都',
      price: '¥1,000/泊',
      nearest_station_ja: '駅',
      access_time_ja: '徒歩1分',
      description_ja: '説明',
      facilities: [],
      activities: [],
    }
    expect(() => campsiteSchema.parse(invalidData)).toThrow()
  })

  it('緯度・経度が数値でない場合はエラー', () => {
    const invalidData = {
      name_ja: 'テスト',
      lat: 'not-a-number',
      lng: 'not-a-number',
      address_ja: '東京都',
      price: '¥1,000/泊',
      nearest_station_ja: '駅',
      access_time_ja: '徒歩1分',
      description_ja: '説明',
      facilities: [],
      activities: [],
    }
    expect(() => campsiteSchema.parse(invalidData)).toThrow()
  })

  it('facilities/activitiesが配列でない場合はエラー', () => {
    const invalidData = {
      name_ja: 'テスト',
      lat: 35.6,
      lng: 139.6,
      address_ja: '東京都',
      price: '¥1,000/泊',
      nearest_station_ja: '駅',
      access_time_ja: '徒歩1分',
      description_ja: '説明',
      facilities: 'restroom',
      activities: 'hiking',
    }
    expect(() => campsiteSchema.parse(invalidData)).toThrow()
  })

  it('不正な値のfacilities/activitiesでもエラーにならない（現在の実装）', () => {
    const dataWithInvalidValues = {
      name_ja: 'テスト',
      lat: 35.6,
      lng: 139.6,
      address_ja: '東京都',
      price: '¥1,000/泊',
      nearest_station_ja: '駅',
      access_time_ja: '徒歩1分',
      description_ja: '説明',
      facilities: ['invalid'], // 現在の実装では文字列配列なので通る
      activities: ['invalid'], // 現在の実装では文字列配列なので通る
    }
    expect(() => campsiteSchema.parse(dataWithInvalidValues)).not.toThrow()
  })
})
