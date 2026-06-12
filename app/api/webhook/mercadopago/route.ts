import { NextRequest, NextResponse } from 'next/server'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id

      const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
      })
      const payment = await res.json()

      console.log('[MP Webhook]', {
        id: payment.id,
        status: payment.status,
        amount: payment.transaction_amount,
        ref: payment.external_reference,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[MP Webhook Error]', err.message)
    return NextResponse.json({ ok: true })
  }
}
