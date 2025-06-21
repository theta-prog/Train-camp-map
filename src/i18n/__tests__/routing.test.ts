import { routing } from '../routing'

describe('routing configuration', () => {
  test('正しいロケール設定', () => {
    expect(routing.locales).toEqual(['ja', 'en'])
    expect(routing.defaultLocale).toBe('ja')
  })

  test('サポートされるロケールの確認', () => {
    expect(routing.locales).toContain('ja')
    expect(routing.locales).toContain('en')
    expect(routing.locales).toHaveLength(2)
  })

  test('デフォルトロケールが適切に設定されている', () => {
    expect(routing.defaultLocale).toBe('ja')
    expect(routing.locales.includes(routing.defaultLocale)).toBe(true)
  })
})
