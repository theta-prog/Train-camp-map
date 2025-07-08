describe('supabase', () => {
  let createClient: jest.Mock;

  beforeAll(() => {
    // Supabaseクライアントをモック
    jest.mock('@supabase/supabase-js', () => ({
      createClient: jest.fn()
    }))
    
    createClient = jest.fn()
    
    // モックをセットアップ
    jest.doMock('@supabase/supabase-js', () => ({
      createClient
    }))
  })

  beforeEach(() => {
    jest.clearAllMocks()
    createClient.mockClear()
    // 環境変数をクリア
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  it('正しい環境変数でSupabaseクライアントを作成する', () => {
    const mockUrl = 'https://test.supabase.co'
    const mockKey = 'test-anon-key'
    
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockKey

    // モジュールを再インポート
    jest.resetModules()
    
    // モックを再設定
    jest.doMock('@supabase/supabase-js', () => ({
      createClient
    }))
    
    require('../supabase')

    expect(createClient).toHaveBeenCalledWith(mockUrl, mockKey)
  })

  it('環境変数が設定されていない場合もクライアントを作成する', () => {
    // 環境変数を未設定にする
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // モジュールを再インポート
    jest.resetModules()
    
    // モックを再設定
    jest.doMock('@supabase/supabase-js', () => ({
      createClient
    }))
    
    require('../supabase')

    // デフォルト値で呼び出されることを確認
    expect(createClient).toHaveBeenCalledWith('http://localhost:3000', 'dummy-key')
  })

  it('supabaseクライアントがエクスポートされる', () => {
    const mockClient = { test: 'client' }
    createClient.mockReturnValue(mockClient)

    jest.resetModules()
    
    // モックを再設定
    jest.doMock('@supabase/supabase-js', () => ({
      createClient
    }))
    
    const { supabase } = require('../supabase')

    expect(supabase).toBe(mockClient)
  })
})