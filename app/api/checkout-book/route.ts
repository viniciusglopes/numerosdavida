import { NextRequest, NextResponse } from 'next/server'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome } = body

    if (!MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Pagamento não configurado' }, { status: 500 })
    }

    const externalRef = `ndv_book_${Date.now()}`

    const preference = {
      items: [{
        title: 'Book Numerológico Completo - Números da Vida',
        description: `Book PDF personalizado para ${(nome || '').split(' ')[0]}`,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 6.90,
      }],
      external_reference: externalRef,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://numerosdavida.com.br'}/api/webhook/mercadopago`,
    }

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    const data = await res.json()

    if (data.id) {
      return NextResponse.json({ preference_id: data.id })
    }

    return NextResponse.json({ error: data.message || 'Erro ao criar preferência' }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
