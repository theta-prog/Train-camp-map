// layout.tsx のテスト
import RootLayout from '../layout'

describe('RootLayout', () => {
  it('lang属性がjaのhtmlでレンダリングされる', () => {
    const element = RootLayout({
      children: <div>テストコンテンツ</div>
    })

    expect(element.type).toBe('html')
    expect(element.props.lang).toBe('ja')
  })

  it('childrenが正しく描画される', () => {
    const element = RootLayout({
      children: <span>子要素テスト</span>
    })

    expect(element.props.children.type).toBe('body')
    expect(element.props.children.props.children.props.children).toBe('子要素テスト')
  })
})