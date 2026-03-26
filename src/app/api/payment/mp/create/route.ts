import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser(bearerToken);

    if (!user) {
      return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 });
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Configuração do Mercado Pago ausente.' }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    const body = {
      transaction_amount: 9.90,
      description: 'LapidaAI Premium',
      payment_method_id: 'pix',
      payer: {
        email: user.email || 'cliente@lapida.ai',
      },
      external_reference: user.id
    };

    const response = await payment.create({ body });
    
    const qr_code = response.point_of_interaction?.transaction_data?.qr_code;
    const qr_code_base64 = response.point_of_interaction?.transaction_data?.qr_code_base64;
    const payment_id = response.id;

    if (!qr_code || !payment_id) {
      return NextResponse.json({ error: 'Erro ao gerar PIX.' }, { status: 500 });
    }

    return NextResponse.json({
      qr_code,
      qr_code_base64,
      payment_id
    });
  } catch (error: unknown) {
    console.error('[MP CREATE] Erro ao criar pix:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      error: 'Erro interno na integração.', 
      details: errorMessage
    }, { status: 500 });
  }
}
