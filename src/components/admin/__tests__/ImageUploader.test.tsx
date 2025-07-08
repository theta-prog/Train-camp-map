import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImageUploader from '../ImageUploader'

// imageUpload関数をモック
jest.mock('@/lib/imageUpload', () => ({
  uploadMultipleImages: jest.fn()
}))

const mockOnImagesUploaded = jest.fn()

describe('ImageUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('コンポーネントが正しくレンダリングされる', () => {
    render(<ImageUploader campsiteId="test-id" onImagesUploaded={mockOnImagesUploaded} />)
    expect(screen.getByText('画像をアップロード')).toBeInTheDocument()
    expect(screen.getByText('ファイルをドラッグ&ドロップするか、クリックして選択')).toBeInTheDocument()
  })

  it('既存画像がある場合、残り枚数を表示する', () => {
    const existingImages = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    render(
      <ImageUploader 
        campsiteId="test-id" 
        onImagesUploaded={mockOnImagesUploaded}
        existingImages={existingImages}
        maxImages={5}
      />
    )
    
    expect(screen.getByText('あと3枚追加できます')).toBeInTheDocument()
  })

  it('ファイル選択で画像をアップロードできる', async () => {
    const { uploadMultipleImages } = require('@/lib/imageUpload')
    uploadMultipleImages.mockResolvedValue(['https://example.com/uploaded1.jpg'])

    const user = userEvent.setup()
    render(<ImageUploader campsiteId="test-id" onImagesUploaded={mockOnImagesUploaded} />)

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText('画像ファイル') as HTMLInputElement
    
    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(uploadMultipleImages).toHaveBeenCalledWith([file], 'test-id', expect.any(Function))
      expect(mockOnImagesUploaded).toHaveBeenCalledWith(['https://example.com/uploaded1.jpg'])
    })
  })

  it('アップロード中はローディング状態を表示する', async () => {
    const { uploadMultipleImages } = require('@/lib/imageUpload')
    let resolvePromise: (value: any) => void
    uploadMultipleImages.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve
      })
    )

    const user = userEvent.setup()
    render(<ImageUploader campsiteId="test-id" onImagesUploaded={mockOnImagesUploaded} />)

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText('画像ファイル') as HTMLInputElement
    
    await user.upload(fileInput, file)

    expect(screen.getByText('アップロード中...')).toBeInTheDocument()

    // Promise を解決してローディング状態を終了
    resolvePromise!(['https://example.com/uploaded.jpg'])

    await waitFor(() => {
      expect(screen.queryByText('アップロード中...')).not.toBeInTheDocument()
    })
  })

  it('最大枚数に達している場合、アップロードが無効になる', () => {
    const existingImages = Array(10).fill('https://example.com/image.jpg')
    render(
      <ImageUploader 
        campsiteId="test-id" 
        onImagesUploaded={mockOnImagesUploaded}
        existingImages={existingImages}
        maxImages={10}
      />
    )

    expect(screen.getByText('最大枚数に達しています')).toBeInTheDocument()
    
    // "最大枚数に達しています" のdivの親（ラッパー）にクラスが付与されている場合も考慮
    const textDiv = screen.getByText('最大枚数に達しています').closest('div')
    const wrapperDiv = textDiv?.parentElement?.parentElement
    expect(wrapperDiv?.className).toMatch(/opacity-50/)
    expect(wrapperDiv?.className).toMatch(/cursor-not-allowed/)
  })

  it('ドラッグ&ドロップでファイルをアップロードできる', async () => {
    const { uploadMultipleImages } = require('@/lib/imageUpload')
    uploadMultipleImages.mockResolvedValue(['https://example.com/uploaded.jpg'])

    render(<ImageUploader campsiteId="test-id" onImagesUploaded={mockOnImagesUploaded} />)

    const dropzone = screen.getByText('ファイルをドラッグ&ドロップするか、クリックして選択').closest('div')
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })

    fireEvent.drop(dropzone!, {
      dataTransfer: {
        files: [file],
        types: ['Files']
      }
    })

    await waitFor(() => {
      expect(uploadMultipleImages).toHaveBeenCalledWith([file], 'test-id', expect.any(Function))
      expect(mockOnImagesUploaded).toHaveBeenCalledWith(['https://example.com/uploaded.jpg'])
    })
  })

  it('画像URLで追加できる', async () => {
    // promptをモック
    const mockPrompt = jest.spyOn(window, 'prompt')
    mockPrompt.mockReturnValue('https://example.com/new-image.jpg')

    const user = userEvent.setup()
    render(<ImageUploader campsiteId="test-id" onImagesUploaded={mockOnImagesUploaded} />)

    const urlButton = screen.getByText('または画像URLで追加')
    await user.click(urlButton)

    expect(mockPrompt).toHaveBeenCalledWith('画像のURLを入力してください:')
    expect(mockOnImagesUploaded).toHaveBeenCalledWith(['https://example.com/new-image.jpg'])

    mockPrompt.mockRestore()
  })

  it('最大枚数制限を超えた場合、アラートを表示する', async () => {
    const { uploadMultipleImages } = require('@/lib/imageUpload')
    uploadMultipleImages.mockResolvedValue(['https://example.com/uploaded.jpg'])

    // alertをモック
    const mockAlert = jest.spyOn(window, 'alert')
    mockAlert.mockImplementation(() => {})

    const existingImages = Array(9).fill('https://example.com/image.jpg')
    const user = userEvent.setup()
    render(
      <ImageUploader 
        campsiteId="test-id" 
        onImagesUploaded={mockOnImagesUploaded}
        existingImages={existingImages}
        maxImages={10}
      />
    )

    const files = [
      new File(['dummy content 1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['dummy content 2'], 'test2.jpg', { type: 'image/jpeg' })
    ]
    const fileInput = screen.getByLabelText('画像ファイル') as HTMLInputElement
    
    await user.upload(fileInput, files)

    expect(mockAlert).toHaveBeenCalledWith('最大10枚まで追加できます。1枚のファイルをアップロードします。')

    mockAlert.mockRestore()
  })

  it('アップロードエラーの場合、アラートを表示する', async () => {
    const { uploadMultipleImages } = require('@/lib/imageUpload')
    uploadMultipleImages.mockRejectedValue(new Error('Upload failed'))

    // alertをモック
    const mockAlert = jest.spyOn(window, 'alert')
    mockAlert.mockImplementation(() => {})

    const user = userEvent.setup()
    render(<ImageUploader campsiteId="test-id" onImagesUploaded={mockOnImagesUploaded} />)

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText('画像ファイル') as HTMLInputElement
    
    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('ファイルのアップロードに失敗しました。もう一度お試しください。')
    })

    mockAlert.mockRestore()
  })
})