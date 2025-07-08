// layout.tsx のテスト
import { render } from '@testing-library/react'
import RootLayout from '../layout'

describe('RootLayout', () => {
  it('lang属性がjaのhtmlでレンダリングされる', () => {
    const { container } = render(
      <RootLayout>
        <div>テストコンテンツ</div>
      </RootLayout>
    )
    const html = container.querySelector('html')
    expect(html).toBeInTheDocument()
    expect(html?.getAttribute('lang')).toBe('ja')
  })

  it('childrenが正しく描画される', () => {
    const { getByText } = render(
      <RootLayout>
        <span>子要素テスト</span>
      </RootLayout>
    )
    expect(getByText('子要素テスト')).toBeInTheDocument()
  })
})