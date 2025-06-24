import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { inviteCode } = await request.json()

    if (!inviteCode) {
      return NextResponse.json(
        { error: '招待コードが必要です' },
        { status: 400 }
      )
    }

    // 招待コードをチェック
    const validInviteCodes = process.env.ADMIN_INVITE_CODES?.split(',').map(code => code.trim()) || []
    
    if (validInviteCodes.length === 0) {
      console.warn('ADMIN_INVITE_CODES が設定されていません。')
      return NextResponse.json(
        { error: '招待コードが設定されていません' },
        { status: 500 }
      )
    }

    const isValid = validInviteCodes.includes(inviteCode)

    return NextResponse.json({ valid: isValid })
  } catch (error) {
    console.error('Invite code check error:', error)
    return NextResponse.json(
      { error: '招待コードのチェックに失敗しました' },
      { status: 500 }
    )
  }
}
