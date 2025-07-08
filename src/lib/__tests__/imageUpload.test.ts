import { deleteImage, uploadImage, uploadMultipleImages } from '../imageUpload'

// Mock functions
const mockUpload = jest.fn()
const mockRemove = jest.fn()
const mockGetPublicUrl = jest.fn()

// Mock the entire supabase module
jest.mock('../supabase', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: mockUpload,
        remove: mockRemove,
        getPublicUrl: mockGetPublicUrl
      })
    }
  }
}))

describe('imageUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadImage', () => {
    it('画像を正常にアップロードできる', async () => {
      const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
      const mockCampsiteId = 'campsite-123'
      
      mockUpload.mockResolvedValue({
        data: { path: 'campsites/campsite-123/test.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://storage.example.com/campsites/campsite-123/test.jpg' }
      })

      const result = await uploadImage(mockFile, mockCampsiteId)

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('campsite-123/'),
        mockFile,
        {
          cacheControl: '3600',
          upsert: false
        }
      )
      expect(result).toBe('https://storage.example.com/campsites/campsite-123/test.jpg')
    })

    it('アップロードエラーの場合、エラーを投げる', async () => {
      const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
      const mockCampsiteId = 'campsite-123'
      
      mockUpload.mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' }
      })

      await expect(uploadImage(mockFile, mockCampsiteId)).rejects.toThrow('Upload failed')
    })

    it('ファイル名にタイムスタンプが含まれる', async () => {
      const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
      const mockCampsiteId = 'campsite-123'
      
      mockUpload.mockResolvedValue({
        data: { path: 'campsites/campsite-123/test.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://storage.example.com/campsites/campsite-123/test.jpg' }
      })

      await uploadImage(mockFile, mockCampsiteId)

      const uploadCall = mockUpload.mock.calls[0]
      const filePath = uploadCall[0]
      
      expect(filePath).toMatch(/^campsite-123\/\d+\.jpg$/)
    })

    it('ファイルサイズが大きすぎる場合エラーを投げる', async () => {
      const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 6 * 1024 * 1024 }) // 6MB
      const mockCampsiteId = 'campsite-123'

      await expect(uploadImage(mockFile, mockCampsiteId)).rejects.toThrow('ファイルサイズは5MB以下にしてください')
    })

    it('サポートされていないファイル形式の場合エラーを投げる', async () => {
      const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' })
      const mockCampsiteId = 'campsite-123'

      await expect(uploadImage(mockFile, mockCampsiteId)).rejects.toThrow('JPG、PNG、WebP、GIF形式の画像ファイルのみアップロード可能です')
    })
  })

  describe('uploadMultipleImages', () => {
    it('複数の画像を順次アップロードできる', async () => {
      const mockFiles = [
        new File(['dummy content 1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['dummy content 2'], 'test2.jpg', { type: 'image/jpeg' })
      ]
      const mockCampsiteId = 'campsite-123'
      const mockProgressCallback = jest.fn()
      
      mockUpload
        .mockResolvedValueOnce({
          data: { path: 'campsites/campsite-123/test1.jpg' },
          error: null
        })
        .mockResolvedValueOnce({
          data: { path: 'campsites/campsite-123/test2.jpg' },
          error: null
        })

      mockGetPublicUrl
        .mockReturnValueOnce({
          data: { publicUrl: 'https://storage.example.com/campsites/campsite-123/test1.jpg' }
        })
        .mockReturnValueOnce({
          data: { publicUrl: 'https://storage.example.com/campsites/campsite-123/test2.jpg' }
        })

      const result = await uploadMultipleImages(mockFiles, mockCampsiteId, mockProgressCallback)

      expect(result).toEqual([
        'https://storage.example.com/campsites/campsite-123/test1.jpg',
        'https://storage.example.com/campsites/campsite-123/test2.jpg'
      ])
      expect(mockProgressCallback).toHaveBeenCalledWith(50)
      expect(mockProgressCallback).toHaveBeenCalledWith(100)
    })

    it('一部のファイルがエラーの場合、成功したもののみ返す', async () => {
      const mockFiles = [
        new File(['dummy content 1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['dummy content 2'], 'test2.jpg', { type: 'image/jpeg' })
      ]
      const mockCampsiteId = 'campsite-123'
      
      mockUpload
        .mockResolvedValueOnce({
          data: { path: 'campsites/campsite-123/test1.jpg' },
          error: null
        })
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Upload failed' }
        })

      mockGetPublicUrl.mockReturnValueOnce({
        data: { publicUrl: 'https://storage.example.com/campsites/campsite-123/test1.jpg' }
      })

      const result = await uploadMultipleImages(mockFiles, mockCampsiteId)

      expect(result).toEqual([
        'https://storage.example.com/campsites/campsite-123/test1.jpg'
      ])
    })

    it('プログレスコールバックが正しく呼ばれる', async () => {
      const mockFiles = [
        new File(['dummy content 1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['dummy content 2'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['dummy content 3'], 'test3.jpg', { type: 'image/jpeg' })
      ]
      const mockCampsiteId = 'campsite-123'
      const mockProgressCallback = jest.fn()
      
      mockUpload.mockResolvedValue({
        data: { path: 'campsites/campsite-123/test.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://storage.example.com/campsites/campsite-123/test.jpg' }
      })

      await uploadMultipleImages(mockFiles, mockCampsiteId, mockProgressCallback)

      expect(mockProgressCallback).toHaveBeenCalledWith(33.33)
      expect(mockProgressCallback).toHaveBeenCalledWith(66.67)
      expect(mockProgressCallback).toHaveBeenCalledWith(100)
    })
  })

  describe('deleteImage', () => {
    it('画像を正常に削除できる', async () => {
      const imageUrl = 'https://storage.example.com/campsite-images/campsites/campsite-123/test.jpg'
      
      mockRemove.mockResolvedValue({
        data: ['campsites/campsite-123/test.jpg'],
        error: null
      })

      const result = await deleteImage(imageUrl)

      expect(mockRemove).toHaveBeenCalledWith(['campsites/campsite-123/test.jpg'])
      expect(result).toBe(true)
    })

    it('削除エラーの場合、falseを返す', async () => {
      const imageUrl = 'https://storage.example.com/campsite-images/campsites/campsite-123/test.jpg'
      
      mockRemove.mockResolvedValue({
        data: null,
        error: { message: 'Delete failed' }
      })

      const result = await deleteImage(imageUrl)

      expect(result).toBe(false)
    })

    it('無効なURLの場合、falseを返す', async () => {
      const invalidUrl = 'invalid-url'
      
      const result = await deleteImage(invalidUrl)

      expect(result).toBe(false)
    })

    it('外部URLの場合、falseを返す', async () => {
      const externalUrl = 'https://external.com/image.jpg'
      
      const result = await deleteImage(externalUrl)

      expect(result).toBe(false)
    })
  })
})