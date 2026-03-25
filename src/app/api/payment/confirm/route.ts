import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Faça login para confirmar o pagamento.' },
        { status: 401 }
      )
    }

    // Mark user as premium
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', user.id)

    if (error) {
      console.error('[payment/confirm] error:', error)
      return NextResponse.json(
        { error: 'Erro ao ativar premium.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno.' },
      { status: 500 }
    )
  }
}
