import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json({ status: 'pending' });
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ status: 'pending' });

    const client = new MercadoPagoConfig({ accessToken: token });
    const paymentAPI = new Payment(client);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Consultando pagamento direto no Mercado Pago
    const response = await paymentAPI.get({ id: Number(paymentId) });

    if (response.status === 'approved' && user && String(response.external_reference) === user.id) {
      // Confirma o acesso Premium do usuário no banco!
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', user.id);

      if (error) {
        console.error('[MP STATUS] Erro Supabase:', error);
      } else {
        return NextResponse.json({ status: 'approved' });
      }
    }

    return NextResponse.json({ status: response.status || 'pending' });
  } catch (error) {
    console.error('[MP STATUS] Erro ao checar:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
