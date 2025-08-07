/**
 * データベースヘルパー関数
 * SQLiteのJSON文字列フィールドを扱うためのユーティリティ
 */

export function arrayToJson(arr: string[]): string {
  return JSON.stringify(arr || [])
}

export function jsonToArray(json: string): string[] {
  try {
    const parsed = JSON.parse(json || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('JSON parse error:', error)
    return []
  }
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
