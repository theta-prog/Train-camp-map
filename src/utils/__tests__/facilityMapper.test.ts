import { 
  mapFacilityToTranslationKey, 
  mapActivityToTranslationKey,
  mapFacilitiesToTranslationKeys,
  mapActivitiesToTranslationKeys
} from '@/utils/facilityMapper'

describe('facilityMapper', () => {
  describe('mapFacilityToTranslationKey', () => {
    it('英語の設備名を正しく翻訳キーに変換する', () => {
      expect(mapFacilityToTranslationKey('restroom')).toBe('restroom')
      expect(mapFacilityToTranslationKey('shower')).toBe('shower')
      expect(mapFacilityToTranslationKey('parking')).toBe('parking')
      expect(mapFacilityToTranslationKey('wifi')).toBe('wifi')
      expect(mapFacilityToTranslationKey('store')).toBe('store')
      expect(mapFacilityToTranslationKey('bbq')).toBe('bbq')
    })

    it('日本語の設備名を正しく翻訳キーに変換する', () => {
      expect(mapFacilityToTranslationKey('オートサイト')).toBe('campsite')
      expect(mapFacilityToTranslationKey('シャワー')).toBe('shower')
      expect(mapFacilityToTranslationKey('Wi-Fi')).toBe('wifi')
      expect(mapFacilityToTranslationKey('売店')).toBe('shop')
      expect(mapFacilityToTranslationKey('炊事場')).toBe('kitchen')
      expect(mapFacilityToTranslationKey('水洗トイレ')).toBe('toilet')
      expect(mapFacilityToTranslationKey('プール')).toBe('pool')
      expect(mapFacilityToTranslationKey('プール(夏季)')).toBe('pool')
    })

    it('存在しない設備名の場合は元の値を返す', () => {
      expect(mapFacilityToTranslationKey('存在しない設備')).toBe('存在しない設備')
      expect(mapFacilityToTranslationKey('unknown facility')).toBe('unknown facility')
      expect(mapFacilityToTranslationKey('')).toBe('')
    })
  })

  describe('mapActivityToTranslationKey', () => {
    it('英語のアクティビティ名を正しく翻訳キーに変換する', () => {
      expect(mapActivityToTranslationKey('hiking')).toBe('hiking')
      expect(mapActivityToTranslationKey('fishing')).toBe('fishing')
      expect(mapActivityToTranslationKey('cycling')).toBe('cycling')
      expect(mapActivityToTranslationKey('photography')).toBe('photography')
      expect(mapActivityToTranslationKey('boating')).toBe('boating')
      expect(mapActivityToTranslationKey('swimming')).toBe('swimming')
    })

    it('日本語のアクティビティ名を正しく翻訳キーに変換する', () => {
      expect(mapActivityToTranslationKey('ハイキング')).toBe('hiking')
      expect(mapActivityToTranslationKey('釣り')).toBe('fishing')
      expect(mapActivityToTranslationKey('川遊び')).toBe('river')
      expect(mapActivityToTranslationKey('星空観察')).toBe('stargazing')
      expect(mapActivityToTranslationKey('バーベキュー')).toBe('bbq')
      expect(mapActivityToTranslationKey('カヌー')).toBe('canoe')
      expect(mapActivityToTranslationKey('プール')).toBe('pool')
      expect(mapActivityToTranslationKey('写真撮影')).toBe('photography')
      expect(mapActivityToTranslationKey('バードウォッチング')).toBe('birdwatching')
    })

    it('存在しないアクティビティ名の場合は元の値を返す', () => {
      expect(mapActivityToTranslationKey('存在しないアクティビティ')).toBe('存在しないアクティビティ')
      expect(mapActivityToTranslationKey('unknown activity')).toBe('unknown activity')
      expect(mapActivityToTranslationKey('')).toBe('')
    })
  })

  describe('mapFacilitiesToTranslationKeys', () => {
    it('設備の配列を正しく翻訳する', () => {
      const facilities = ['シャワー', 'Wi-Fi', '売店']
      const result = mapFacilitiesToTranslationKeys(facilities)
      expect(result).toEqual(['shower', 'wifi', 'shop'])
    })

    it('混在した設備配列を正しく処理する', () => {
      const facilities = ['シャワー', 'restroom', 'Wi-Fi', 'bbq']
      const result = mapFacilitiesToTranslationKeys(facilities)
      expect(result).toEqual(['shower', 'restroom', 'wifi', 'bbq'])
    })

    it('空の配列を正しく処理する', () => {
      const facilities: string[] = []
      const result = mapFacilitiesToTranslationKeys(facilities)
      expect(result).toEqual([])
    })

    it('存在しない設備名も含めて処理する', () => {
      const facilities = ['シャワー', '存在しない設備', 'Wi-Fi']
      const result = mapFacilitiesToTranslationKeys(facilities)
      expect(result).toEqual(['shower', '存在しない設備', 'wifi'])
    })
  })

  describe('mapActivitiesToTranslationKeys', () => {
    it('アクティビティの配列を正しく翻訳する', () => {
      const activities = ['ハイキング', '釣り', '川遊び']
      const result = mapActivitiesToTranslationKeys(activities)
      expect(result).toEqual(['hiking', 'fishing', 'river'])
    })

    it('混在したアクティビティ配列を正しく処理する', () => {
      const activities = ['ハイキング', 'hiking', '釣り', 'swimming']
      const result = mapActivitiesToTranslationKeys(activities)
      expect(result).toEqual(['hiking', 'hiking', 'fishing', 'swimming'])
    })

    it('空の配列を正しく処理する', () => {
      const activities: string[] = []
      const result = mapActivitiesToTranslationKeys(activities)
      expect(result).toEqual([])
    })

    it('存在しないアクティビティ名も含めて処理する', () => {
      const activities = ['ハイキング', '存在しないアクティビティ', '釣り']
      const result = mapActivitiesToTranslationKeys(activities)
      expect(result).toEqual(['hiking', '存在しないアクティビティ', 'fishing'])
    })

    it('特殊なアクティビティ名を正しく変換する', () => {
      const activities = ['流しそうめん', '潮干狩り', '動物ふれあい', '電車見学']
      const result = mapActivitiesToTranslationKeys(activities)
      expect(result).toEqual(['nagashisomen', 'shellfishing', 'animals', 'train'])
    })
  })

  describe('複雑なケースの処理', () => {
    it('特殊な設備名を正しく変換する', () => {
      const facilities = ['グランピング', 'ハンモックサイト', '河原サイト', 'ログキャビン']
      const result = mapFacilitiesToTranslationKeys(facilities)
      expect(result).toEqual(['glamping', 'hammocksite', 'riverside', 'logcabin'])
    })

    it('温泉関連のアクティビティを正しく変換する', () => {
      const activities = ['温泉', '森林浴', '渓谷散策']
      const result = mapActivitiesToTranslationKeys(activities)
      expect(result).toEqual(['hotspring', 'forestbath', 'valley'])
    })

    it('大量のデータを効率的に処理する', () => {
      const facilities = ['オートサイト', 'シャワー', 'Wi-Fi', '売店', '炊事場', 'プール']
      const activities = ['ハイキング', '釣り', 'カヌー', '星空観察', 'バーベキュー', '写真撮影']
      
      const facilitiesResult = mapFacilitiesToTranslationKeys(facilities)
      const activitiesResult = mapActivitiesToTranslationKeys(activities)
      
      expect(facilitiesResult).toEqual(['campsite', 'shower', 'wifi', 'shop', 'kitchen', 'pool'])
      expect(activitiesResult).toEqual(['hiking', 'fishing', 'canoe', 'stargazing', 'bbq', 'photography'])
    })
  })
})
