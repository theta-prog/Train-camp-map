import { supabase } from './supabase'

/**
 * 画像ファイルをSupabase Storageにアップロードする
 */
export async function uploadImage(file: File, campsiteId: string): Promise<string> {
  try {
    // ファイル名を生成（タイムスタンプ + オリジナル名）
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${campsiteId}/${timestamp}.${fileExt}`

    // ファイルサイズチェック（5MB制限）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('ファイルサイズは5MB以下にしてください')
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('JPG、PNG、WebP、GIF形式の画像ファイルのみアップロード可能です')
    }

    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from('campsite-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw new Error(`アップロードに失敗しました: ${error.message}`)
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('campsite-images')
      .getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error('Image upload error:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('画像のアップロードに失敗しました')
  }
}

/**
 * Supabase Storageから画像を削除する
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // URLからファイルパスを抽出
    const url = new URL(imageUrl)
    const pathSegments = url.pathname.split('/')
    const bucketIndex = pathSegments.indexOf('campsite-images')
    
    if (bucketIndex === -1) {
      throw new Error('Invalid image URL')
    }
    
    const filePath = pathSegments.slice(bucketIndex + 1).join('/')
    
    const { error } = await supabase.storage
      .from('campsite-images')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      throw new Error(`削除に失敗しました: ${error.message}`)
    }
  } catch (error) {
    console.error('Image delete error:', error)
    // 削除エラーは致命的ではないので、ログのみ出力
  }
}

/**
 * 複数の画像を一括でアップロードする
 */
export async function uploadMultipleImages(
  files: File[], 
  campsiteId: string,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  const uploadedUrls: string[] = []
  const total = files.length

  for (let i = 0; i < total; i++) {
    const file = files[i]
    if (!file) continue
    
    try {
      const url = await uploadImage(file, campsiteId)
      uploadedUrls.push(url)
      
      if (onProgress) {
        onProgress(((i + 1) / total) * 100)
      }
    } catch (error) {
      console.error(`Failed to upload file ${file.name}:`, error)
      // 一つのファイルが失敗しても続行
    }
  }

  return uploadedUrls
}
