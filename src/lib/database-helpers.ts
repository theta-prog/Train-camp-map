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
    ...campsite,
    facilities: jsonToArray(campsite.facilities),
    activities: jsonToArray(campsite.activities),
    images: jsonToArray(campsite.images)
  }
}

export function formatCampsiteForDb(data: any) {
  return {
    ...data,
    facilities: arrayToJson(data.facilities),
    activities: arrayToJson(data.activities),
    images: arrayToJson(data.images)
  }
}
