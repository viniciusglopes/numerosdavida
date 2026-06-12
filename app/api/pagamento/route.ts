import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Pagamento não configurado' }, { status: 500 })
    }

    const res = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `ndv_${Date.now()}`,
      },
      body: JSON.stringify(body),
    })

    const payment = await res.json()

    if (supabase && payment.id) {
      const email = body.payer?.email || payment.payer?.email || null
      try {
        await supabase.from('ndv_vendas').insert({
          nome: payment.description || '',
          email,
          produto: (payment.transaction_amount || 0) > 8 ? 'mapa' : 'book',
          valor: payment.transaction_amount || 0,
          payment_id: String(payment.id),
          payment_status: payment.status || 'unknown',
          payment_detail: payment.status_detail || null,
        })
      } catch {}
    }

    return NextResponse.json({
      status: payment.status,
      id: payment.id,
      detail: payment.status_detail,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
