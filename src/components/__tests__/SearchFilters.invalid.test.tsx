import { fireEvent, render, screen } from '@testing-library/react'
import SearchFilters from '../SearchFilters'

describe('SearchFilters 異常系', () => {
  const defaultFilters = {
    keyword: '',
    maxPrice: 0,
    facilities: [],
    activities: [],
  }

  it('onFilterChangeが未設定でもクラッシュしない', () => {
    render(<SearchFilters onFilterChange={undefined as any} initialFilters={defaultFilters} />)
    expect(screen.getByText('searchFilters.title')).toBeInTheDocument()
  })

  it('全てのフィルタをクリアボタンでリセットできる', () => {
    const mock = jest.fn()
    render(<SearchFilters onFilterChange={mock} initialFilters={defaultFilters} />)
    fireEvent.click(screen.getByText('searchFilters.clear'))
    expect(mock).toHaveBeenCalled()
  })
})
