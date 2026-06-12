'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function TestePagamento() {
  const [status, setStatus] = useState('Carregando SDK...')
  const [erro, setErro] = useState('')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.onload = async () => {
      setStatus('SDK carregado. Inicializando Brick...')
      try {
        const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ''
        setStatus(`Public Key: ${publicKey ? publicKey.substring(0, 20) + '...' : 'VAZIA'}`)

        if (!publicKey) {
          setErro('NEXT_PUBLIC_MP_PUBLIC_KEY não configurada')
          return
        }

        const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })
        const bricksBuilder = mp.bricks()

        setStatus('MP inicializado. Criando Payment Brick...')

        await bricksBuilder.create('payment', 'test-brick-container', {
          initialization: {
            amount: 9.90,
          },
          callbacks: {
            onReady: () => {
              setStatus('Brick pronto!')
            },
            onSubmit: async (param: any) => {
              setStatus('Submit: ' + JSON.stringify(param).substring(0, 200))
              return Promise.resolve()
            },
            onError: (error: any) => {
              setErro('onError: ' + JSON.stringify(error))
            },
          },
        })
      } catch (err: any) {
        setErro('Catch: ' + (err?.message || JSON.stringify(err)))
      }
    }
    script.onerror = () => setErro('Falha ao carregar SDK do MP')
    document.head.appendChild(script)
  }, [])

  return (
    <div style={{ padding: 40, color: 'white', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ color: '#d4a843', marginBottom: 20 }}>Teste Pagamento MP Bricks</h1>
      <p style={{ color: '#a78bfa', marginBottom: 10 }}>Status: {status}</p>
      {erro && <p style={{ color: '#ef4444', marginBottom: 20, wordBreak: 'break-all' }}>ERRO: {erro}</p>}
      <div id="test-brick-container" style={{ marginTop: 20 }} />
    </div>
  )
}
