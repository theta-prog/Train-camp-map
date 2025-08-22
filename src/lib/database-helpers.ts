/**
 * データベースヘルパー関数
 * SQLiteとPostgreSQLの両方に対応
 */

const isPostgreSQL = process.env.DATABASE_URL?.includes('postgresql')

export function arrayToJson(arr: string[]): string | string[] {
  if (isPostgreSQL) {
    return arr || []
  }
  return JSON.stringify(arr || [])
}

export function jsonToArray(json: string | string[]): string[] {
  // PostgreSQLの場合、既に配列として返される
  if (isPostgreSQL && Array.isArray(json)) {
    return json
  }
  
  // SQLiteの場合、JSON文字列をパース
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('JSON parse error:', error)
      return []
    }
  }
  
  return Array.isArray(json) ? json : []
}

export function formatCampsiteForClient(campsite: any) {
  return {
    id: campsite.id,
    name: campsite.nameJa,
    lat: campsite.lat,
    lng: campsite.lng,
    address: campsite.addressJa,
    phone: campsite.phone,
    website: campsite.website,
    reservationUrl: campsite.reservationUrl,
    price: campsite.price,
    priceMin: campsite.priceMin,
    priceMax: campsite.priceMax,
    facilities: jsonToArray(campsite.facilities),
    activities: jsonToArray(campsite.activities),
    nearestStation: campsite.nearestStationJa,
    accessTime: campsite.accessTimeJa,
    description: campsite.descriptionJa,
    images: jsonToArray(campsite.images),
    checkInTime: campsite.checkInTime,
    checkOutTime: campsite.checkOutTime,
    cancellationPolicy: campsite.cancellationPolicyJa,
    // 管理者用に追加フィールドも含める
    nameEn: campsite.nameEn,
    addressEn: campsite.addressEn,
    nearestStationEn: campsite.nearestStationEn,
    accessTimeEn: campsite.accessTimeEn,
    descriptionEn: campsite.descriptionEn,
    cancellationPolicyEn: campsite.cancellationPolicyEn,
    reservationPhone: campsite.reservationPhone,
    reservationEmail: campsite.reservationEmail,
    createdAt: campsite.createdAt,
    updatedAt: campsite.updatedAt
  }
}

export function formatCampsiteForDb(data: any) {
  const dbData: any = {
    nameJa: data.nameJa || data.name,
    nameEn: data.nameEn,
    lat: data.lat,
    lng: data.lng,
    addressJa: data.addressJa || data.address,
    addressEn: data.addressEn,
    phone: data.phone,
    website: data.website,
    price: data.price,
    nearestStationJa: data.nearestStationJa || data.nearestStation,
    nearestStationEn: data.nearestStationEn,
    accessTimeJa: data.accessTimeJa || data.accessTime,
    accessTimeEn: data.accessTimeEn,
    descriptionJa: data.descriptionJa || data.description,
    descriptionEn: data.descriptionEn,
    facilities: arrayToJson(data.facilities),
    activities: arrayToJson(data.activities),
    images: arrayToJson(data.images),
    priceMin: data.priceMin,
    priceMax: data.priceMax,
    reservationUrl: data.reservationUrl,
    reservationPhone: data.reservationPhone,
    reservationEmail: data.reservationEmail,
    checkInTime: data.checkInTime,
    checkOutTime: data.checkOutTime,
    cancellationPolicyJa: data.cancellationPolicyJa || data.cancellationPolicy,
    cancellationPolicyEn: data.cancellationPolicyEn
  }

  // undefinedのフィールドを削除
  Object.keys(dbData).forEach(key => {
    if (dbData[key] === undefined) {
      delete dbData[key]
    }
  })

  return dbData
}
