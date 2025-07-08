import { render, screen } from '@testing-library/react'
import CsvImportPage from '../page'

// Mock components to simplify testing
jest.mock('@/components/admin/AdminLayout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="admin-layout">{children}</div>,
  }
})

jest.mock('@/components/admin/CsvImportForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="csv-import-form">CSV Import Form</div>,
  }
})

describe('CsvImportPage', () => {
  it('renders the CsvImportForm within the AdminLayout', () => {
    render(<CsvImportPage />)

    // Check if AdminLayout is rendered
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()

    // Check if CsvImportForm is rendered
    expect(screen.getByTestId('csv-import-form')).toBeInTheDocument()
    expect(screen.getByText('CSV Import Form')).toBeInTheDocument()
  })
})
