import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CampsiteTemplate from '../CampsiteTemplate'

const mockOnTemplateSelect = jest.fn()

describe('CampsiteTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component', () => {
    render(<CampsiteTemplate onTemplateSelect={mockOnTemplateSelect} />)
    expect(screen.getByText('テンプレートから選択')).toBeInTheDocument()
  })

  it('displays all template options', () => {
    render(<CampsiteTemplate onTemplateSelect={mockOnTemplateSelect} />)
    expect(screen.getByText('山間部キャンプ場')).toBeInTheDocument()
    expect(screen.getByText('湖畔キャンプ場')).toBeInTheDocument()
    expect(screen.getByText('森林キャンプ場')).toBeInTheDocument()
    expect(screen.getByText('海岸キャンプ場')).toBeInTheDocument()
  })

  it('テンプレートを選択すると onTemplateSelect が呼ばれる', async () => {
    const user = userEvent.setup()
    render(<CampsiteTemplate onTemplateSelect={mockOnTemplateSelect} />)

    const mountainButton = screen.getByText('山間部キャンプ場')
    await user.click(mountainButton)
    
    await waitFor(() => {
      expect(mockOnTemplateSelect).toHaveBeenCalledWith({
        facilities: ['restroom', 'parking', 'shower'],
        activities: ['hiking', 'photography', 'stargazing'],
        access_time_ja: '徒歩20分',
        access_time_en: '20 min walk',
        description_ja: '自然豊かな山間部に位置するキャンプ場です。',
        description_en: 'A campsite located in a nature-rich mountainous area.',
      })
    })
  })

  it('選択されたテンプレートが視覚的にハイライトされる', async () => {
    const user = userEvent.setup()
    render(<CampsiteTemplate onTemplateSelect={mockOnTemplateSelect} />)

    const lakesideButton = screen.getByText('湖畔キャンプ場').closest('button')
    expect(lakesideButton).toHaveClass('border-gray-200')
    
    await user.click(lakesideButton!)
    
    await waitFor(() => {
      expect(lakesideButton).toHaveClass('border-green-500', 'bg-green-50')
    })
  })

  it('選択後に確認メッセージが表示される', async () => {
    const user = userEvent.setup()
    render(<CampsiteTemplate onTemplateSelect={mockOnTemplateSelect} />)

    const forestButton = screen.getByText('森林キャンプ場')
    await user.click(forestButton)
    
    await waitFor(() => {
      expect(screen.getByText('✓ テンプレートが適用されました。必要に応じて内容を調整してください。')).toBeInTheDocument()
    })
  })

  it('各テンプレートの詳細情報が表示される', () => {
    render(<CampsiteTemplate onTemplateSelect={mockOnTemplateSelect} />)
    
    // 山間部キャンプ場の詳細
    expect(screen.getAllByText('設備: 3種類')).toHaveLength(2) // 山間部と森林キャンプ場
    expect(screen.getAllByText('アクティビティ: 3種類')).toHaveLength(4) // 全テンプレート
    expect(screen.getByText('自然豊かな山間部に位置するキャンプ場です。')).toBeInTheDocument()
    
    // 湖畔キャンプ場の詳細
    expect(screen.getAllByText('設備: 4種類')).toHaveLength(2) // 湖畔と海岸キャンプ場
    expect(screen.getByText('美しい湖のほとりに位置するキャンプ場です。')).toBeInTheDocument()
  })
})
