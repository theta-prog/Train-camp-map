'use client'

import { uploadMultipleImages } from '@/lib/imageUpload'
import { useRef, useState } from 'react'

interface ImageUploaderProps {
  campsiteId: string
  onImagesUploaded: (urls: string[]) => void
  existingImages?: string[]
  maxImages?: number
  className?: string
}

export default function ImageUploader({
  campsiteId,
  onImagesUploaded,
  existingImages = [],
  maxImages = 10,
  className = ''
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canAddMore = existingImages.length < maxImages

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || !canAddMore) return

    // 制限チェック
    const remainingSlots = maxImages - existingImages.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (filesToUpload.length < files.length) {
      alert(`最大${maxImages}枚まで追加できます。${filesToUpload.length}枚のファイルをアップロードします。`)
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedUrls = await uploadMultipleImages(
        filesToUpload,
        campsiteId,
        setUploadProgress
      )

      if (uploadedUrls.length > 0) {
        onImagesUploaded(uploadedUrls)
      }

      if (uploadedUrls.length < filesToUpload.length) {
        alert(`${uploadedUrls.length}/${filesToUpload.length}枚のファイルがアップロードされました。`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('ファイルのアップロードに失敗しました。もう一度お試しください。')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleClick = () => {
    if (canAddMore && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-label="画像ファイル"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={!canAddMore || isUploading}
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${dragOver ? 'border-green-400 bg-green-50' : 'border-gray-300'}
          ${!canAddMore ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 hover:bg-gray-50'}
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
            <div>
              <p className="text-sm text-gray-600 mb-2">アップロード中...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(uploadProgress)}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-lg font-medium text-gray-700">
                {canAddMore ? '画像をアップロード' : '最大枚数に達しています'}
              </span>
            </div>
            
            {canAddMore && (
              <div className="text-sm text-gray-500 space-y-1">
                <p>ファイルをドラッグ&ドロップするか、クリックして選択</p>
                <p>JPG、PNG、WebP、GIF（最大5MB）</p>
                <p>あと{maxImages - existingImages.length}枚追加できます</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* URLでの追加オプション */}
      {canAddMore && !isUploading && (
        <div className="mt-4">
          <button
            onClick={() => {
              const url = prompt('画像のURLを入力してください:')
              if (url && url.trim()) {
                onImagesUploaded([url.trim()])
              }
            }}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            または画像URLで追加
          </button>
        </div>
      )}
    </div>
  )
}
