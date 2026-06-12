import { NextRequest, NextResponse } from 'next/server'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || ''

export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get('id')

  if (!paymentId || !MP_ACCESS_TOKEN) {
    return NextResponse.json({ status: 'unknown' })
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
    })
    const payment = await res.json()
    return NextResponse.json({ status: payment.status || 'unknown' })
  } catch {
    return NextResponse.json({ status: 'unknown' })
  }
}
