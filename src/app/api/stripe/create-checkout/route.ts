import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(req: Request) {
  try {
    let origin = '/resultado';
    try {
      const body = await req.json();
      if (body.origin) origin = body.origin;
    } catch {
      // Ignora erro se não tiver body json
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}${origin}?premium=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}${origin}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar sessão de checkout.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
