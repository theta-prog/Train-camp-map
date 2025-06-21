import { 
  campsiteSchema, 
  AVAILABLE_FACILITIES, 
  AVAILABLE_ACTIVITIES 
} from '@/lib/validations/campsite'

describe('campsiteSchema', () => {
  const validCampsiteData = {
    name_ja: 'テストキャンプ場',
    name_en: 'Test Campsite',
    lat: 35.6762,
    lng: 139.6503,
    address_ja: '東京都渋谷区',
    address_en: 'Shibuya, Tokyo',
    phone: '03-1234-5678',
    website: 'https://test.example.com',
    price: '¥2,000/泊',
    nearest_station_ja: 'JR渋谷駅',
    nearest_station_en: 'JR Shibuya Station',
    access_time_ja: '徒歩15分',
    access_time_en: '15 min walk',
    description_ja: 'テスト用のキャンプ場です',
    description_en: 'A test campsite',
    facilities: ['restroom', 'shower'],
    activities: ['hiking', 'fishing'],
  }

  describe('正常なデータのバリデーション', () => {
    it('有効なデータが正しく検証される', () => {
      expect(() => campsiteSchema.parse(validCampsiteData)).not.toThrow()
    })

    it('オプションフィールドなしでも検証される', () => {
      const minimalData = {
        name_ja: 'テストキャンプ場',
        lat: 35.6762,
        lng: 139.6503,
        address_ja: '東京都渋谷区',
        price: '¥2,000/泊',
        nearest_station_ja: 'JR渋谷駅',
        access_time_ja: '徒歩15分',
        description_ja: 'テスト用のキャンプ場です',
        facilities: [],
        activities: [],
      }
      expect(() => campsiteSchema.parse(minimalData)).not.toThrow()
    })
  })

  describe('必須フィールドのバリデーション', () => {
    it('name_jaが空の場合エラー', () => {
      const invalidData = { ...validCampsiteData, name_ja: '' }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('latが範囲外の場合エラー', () => {
      const invalidData = { ...validCampsiteData, lat: 91 }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('lngが範囲外の場合エラー', () => {
      const invalidData = { ...validCampsiteData, lng: -181 }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('address_jaが空の場合エラー', () => {
      const invalidData = { ...validCampsiteData, address_ja: '' }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('priceが空の場合エラー', () => {
      const invalidData = { ...validCampsiteData, price: '' }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('nearest_station_jaが空の場合エラー', () => {
      const invalidData = { ...validCampsiteData, nearest_station_ja: '' }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('access_time_jaが空の場合エラー', () => {
      const invalidData = { ...validCampsiteData, access_time_ja: '' }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('description_jaが空の場合エラー', () => {
      const invalidData = { ...validCampsiteData, description_ja: '' }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })
  })

  describe('フィールド長のバリデーション', () => {
    it('name_jaが100文字超過でエラー', () => {
      const invalidData = { 
        ...validCampsiteData, 
        name_ja: 'a'.repeat(101) 
      }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('description_jaが1000文字超過でエラー', () => {
      const invalidData = { 
        ...validCampsiteData, 
        description_ja: 'a'.repeat(1001) 
      }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })
  })

  describe('URL/電話番号のバリデーション', () => {
    it('無効なURLでエラー', () => {
      const invalidData = { ...validCampsiteData, website: 'invalid-url' }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('空文字列のウェブサイトは許可', () => {
      const validData = { ...validCampsiteData, website: '' }
      expect(() => campsiteSchema.parse(validData)).not.toThrow()
    })

    it('無効な電話番号でエラー', () => {
      const invalidData = { ...validCampsiteData, phone: 'abc-def-ghij' }
      expect(() => campsiteSchema.parse(invalidData)).toThrow()
    })

    it('有効な電話番号形式は許可', () => {
      const validFormats = [
        '03-1234-5678',
        '090-1234-5678',
        '+81-3-1234-5678',
        '(03) 1234-5678'
      ]
      
      validFormats.forEach(phone => {
        const validData = { ...validCampsiteData, phone }
        expect(() => campsiteSchema.parse(validData)).not.toThrow()
      })
    })
  })

  describe('配列フィールドのバリデーション', () => {
    it('有効な設備配列が許可される', () => {
      const validData = { 
        ...validCampsiteData, 
        facilities: ['restroom', 'shower', 'parking'] 
      }
      expect(() => campsiteSchema.parse(validData)).not.toThrow()
    })

    it('有効なアクティビティ配列が許可される', () => {
      const validData = { 
        ...validCampsiteData, 
        activities: ['hiking', 'fishing', 'swimming'] 
      }
      expect(() => campsiteSchema.parse(validData)).not.toThrow()
    })

    it('空の配列が許可される', () => {
      const validData = { 
        ...validCampsiteData, 
        facilities: [],
        activities: []
      }
      expect(() => campsiteSchema.parse(validData)).not.toThrow()
    })
  })
})

describe('定数データ', () => {
  it('利用可能な設備一覧が正しく定義されている', () => {
    expect(AVAILABLE_FACILITIES).toHaveLength(8)
    expect(AVAILABLE_FACILITIES[0]).toHaveProperty('id')
    expect(AVAILABLE_FACILITIES[0]).toHaveProperty('label_ja')
    expect(AVAILABLE_FACILITIES[0]).toHaveProperty('label_en')
  })

  it('利用可能なアクティビティ一覧が正しく定義されている', () => {
    expect(AVAILABLE_ACTIVITIES).toHaveLength(8)
    expect(AVAILABLE_ACTIVITIES[0]).toHaveProperty('id')
    expect(AVAILABLE_ACTIVITIES[0]).toHaveProperty('label_ja')
    expect(AVAILABLE_ACTIVITIES[0]).toHaveProperty('label_en')
  })

  it('設備IDが重複していない', () => {
    const ids = AVAILABLE_FACILITIES.map(f => f.id)
    const uniqueIds = new Set(ids)
    expect(ids).toHaveLength(uniqueIds.size)
  })

  it('アクティビティIDが重複していない', () => {
    const ids = AVAILABLE_ACTIVITIES.map(a => a.id)
    const uniqueIds = new Set(ids)
    expect(ids).toHaveLength(uniqueIds.size)
  })
})
