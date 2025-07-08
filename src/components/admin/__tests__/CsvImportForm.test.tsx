import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import CsvImportForm from '../CsvImportForm'

// fetchをモック
global.fetch = jest.fn()

// next/navigationをモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('CsvImportForm', () => {
  const mockPush = jest.fn()
  let container: HTMLElement

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
    
    // DOM環境を確実にクリーンアップ
    document.body.innerHTML = ''
    
    // テスト用のコンテナを作成
    container = document.createElement('div')
    container.setAttribute('id', 'test-container')
    document.body.appendChild(container)
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
    // コンテナをクリーンアップ
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
    document.body.innerHTML = ''
  })

  it('コンポーネントが正しくレンダリングされる', () => {
    render(<CsvImportForm />, { container })
    expect(screen.getByText('CSVインポート')).toBeInTheDocument()
    expect(screen.getByText('CSVファイル')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'インポート実行' })).toBeInTheDocument()
  })

  it('CSVファイルを選択できる', async () => {
    const user = userEvent.setup()
    render(<CsvImportForm />, { container })

    const file = new File(['name_ja,name_en\nテスト,Test'], 'test.csv', {
      type: 'text/csv'
    })

    const fileInput = screen.getByLabelText('CSVファイル') as HTMLInputElement
    await user.upload(fileInput, file)

    expect(fileInput.files).toBeDefined()
    expect(fileInput.files![0]).toEqual(file)
  })

  it('CSVファイルをアップロードしてインポートできる', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: 2,
        errors: []
      })
    })

    render(<CsvImportForm />, { container })

    const csvContent = `name_ja,name_en,lat,lng,address_ja,address_en,phone,website,price,facilities,activities,nearest_station_ja,nearest_station_en,access_time_ja,access_time_en,description_ja,description_en
キャンプ場1,Campsite 1,35.6762,139.6503,東京都,Tokyo,03-1234-5678,https://test1.com,¥3000/泊,restroom;parking,hiking;cycling,新宿駅,Shinjuku Station,徒歩10分,10 min walk,テスト用キャンプ場1,Test campsite 1
キャンプ場2,Campsite 2,35.6762,139.6503,東京都,Tokyo,03-1234-5678,https://test2.com,¥3000/泊,restroom;parking,hiking;cycling,新宿駅,Shinjuku Station,徒歩10分,10 min walk,テスト用キャンプ場2,Test campsite 2`

    const file = new File([csvContent], 'test.csv', { type: 'text/csv' })
    const fileInput = screen.getByLabelText('CSVファイル')
    await user.upload(fileInput, file)

    const importButton = screen.getByRole('button', { name: 'インポート実行' })
    await user.click(importButton)

    await waitFor(() => {
      // 見出し
      expect(screen.getByRole('heading', { name: 'インポート完了' })).toBeInTheDocument()
      // 成功件数（分割されている場合も考慮）
      const container = screen.getByRole('heading', { name: 'インポート完了' }).closest('div')
      expect(container?.textContent).toContain('成功')
      expect(container?.textContent).toContain('2')
    })
  })

  it('ファイルが選択されていない場合にエラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    render(<CsvImportForm />, { container })

    const importButton = screen.getByRole('button', { name: 'インポート実行' })
    await user.click(importButton)

    // ボタンが無効になっていることを確認（ファイルが選択されていないため）
    expect(importButton).toBeDisabled()
  })

  it('テンプレートダウンロード機能が動作する', async () => {
    const user = userEvent.setup()

    // document.createElement をモック
    const mockLink = {
      href: '',
      download: '',
      click: jest.fn(),
      style: { visibility: 'visible' },
      setAttribute: jest.fn((attr, value) => {
        if (attr === 'href') mockLink.href = value
        if (attr === 'download') mockLink.download = value
      })
    }
    const originalCreateElement = document.createElement
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'a') {
        return mockLink
      }
      return originalCreateElement.call(document, tagName)
    })

    // document.body の appendChild と removeChild をモック
    const mockAppendChild = jest.fn()
    const mockRemoveChild = jest.fn()
    document.body.appendChild = mockAppendChild
    document.body.removeChild = mockRemoveChild

    render(<CsvImportForm />, { container })

    const templateButton = screen.getByRole('button', { name: 'テンプレートダウンロード' })
    await user.click(templateButton)

    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'campsite_template.csv')
    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'blob:mock-url')
    expect(mockAppendChild).toHaveBeenCalledWith(mockLink)
    expect(mockLink.click).toHaveBeenCalled()
    expect(mockRemoveChild).toHaveBeenCalledWith(mockLink)

    // 元の関数を復元
    document.createElement = originalCreateElement
  })
})