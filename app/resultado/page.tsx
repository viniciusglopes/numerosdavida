'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useMemo, useEffect, useCallback } from 'react'
import Stars from '@/components/Stars'
import { calcularMapa, SIGNIFICADOS } from '@/lib/numerologia'

declare global {
  interface Window {
    MercadoPago: any
  }
}

function ResultadoContent() {
  const searchParams = useSearchParams()
  const [desbloqueado, setDesbloqueado] = useState(false)
  const [mostrarPagamento, setMostrarPagamento] = useState(false)
  const [carregandoPagamento, setCarregandoPagamento] = useState(false)

  const nome = searchParams.get('nome') || ''
  const dia = parseInt(searchParams.get('dia') || '1')
  const mes = parseInt(searchParams.get('mes') || '1')
  const ano = parseInt(searchParams.get('ano') || '1990')
  const foco = searchParams.get('foco') || 'amor'
  const genero_parceiro = searchParams.get('gp') || 'feminino'
  const paid = searchParams.get('paid')

  const mapa = useMemo(() => calcularMapa(nome, dia, mes, ano), [nome, dia, mes, ano])
  const significado = SIGNIFICADOS[mapa.destino] || SIGNIFICADOS[1]

  useEffect(() => {
    if (paid === '1') setDesbloqueado(true)
  }, [paid])

  const initBricks = useCallback(async (preferenceId: string) => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ''
    if (!publicKey) return

    const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })
    const bricksBuilder = mp.bricks()

    await bricksBuilder.create('payment', 'mp-bricks-container', {
      initialization: {
        amount: 9.90,
        preferenceId,
      },
      customization: {
        visual: {
          style: {
            theme: 'dark',
          },
        },
        paymentMethods: {
          maxInstallments: 1,
        },
      },
      callbacks: {
        onReady: () => {
          setCarregandoPagamento(false)
        },
        onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
          const res = await fetch('/api/pagamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
          const data = await res.json()
          if (data.status === 'approved') {
            setDesbloqueado(true)
            setMostrarPagamento(false)
          } else if (data.status === 'pending') {
            alert('Pagamento pendente! Assim que confirmado, seu mapa será desbloqueado.')
          } else {
            alert('Pagamento não aprovado. Tente novamente.')
          }
        },
        onError: (error: any) => {
          console.error('Bricks error:', error)
        },
      },
    })
  }, [])

  const handleDesbloquear = async () => {
    setCarregandoPagamento(true)
    setMostrarPagamento(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, destino: mapa.destino }),
      })
      const data = await res.json()

      if (data.preference_id) {
        if (!document.getElementById('mp-sdk')) {
          const script = document.createElement('script')
          script.id = 'mp-sdk'
          script.src = 'https://sdk.mercadopago.com/js/v2'
          script.onload = () => initBricks(data.preference_id)
          document.head.appendChild(script)
        } else {
          initBricks(data.preference_id)
        }
      } else {
        alert('Erro ao iniciar pagamento. Tente novamente.')
        setMostrarPagamento(false)
        setCarregandoPagamento(false)
      }
    } catch {
      alert('Erro de conexão. Tente novamente.')
      setMostrarPagamento(false)
      setCarregandoPagamento(false)
    }
  }

  const primeiroNome = nome.split(' ')[0]

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-8">
      <Stars />

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-5xl block mb-3 animate-float">🔮</span>
          <h1 className="text-3xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
            {primeiroNome}, seu mapa está pronto
          </h1>
          <p className="text-purple-300/60 text-sm mt-2">
            Os números revelaram verdades profundas sobre você
          </p>
        </div>

        {/* GRATIS: Número do Destino (teaser) */}
        <div className="card-mystic rounded-2xl p-6 text-center">
          <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">Seu Número do Destino</p>
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-3">
            <span className="text-3xl font-bold text-purple-dark">{mapa.destino}</span>
          </div>
          <h3 className="text-xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
            {significado.titulo}
          </h3>
          <p className="text-purple-200 text-sm">{significado.resumo}</p>
        </div>

        {/* Mapa completo (borrado se não pagou) */}
        <div className="card-mystic rounded-2xl p-6 relative overflow-hidden">
          <div className={`space-y-4 ${!desbloqueado ? 'blur-md select-none' : ''}`}>
            <h3 className="text-lg font-bold text-gold text-center" style={{ fontFamily: 'var(--font-playfair)' }}>
              Mapa Numerológico Completo
            </h3>

            {[
              { label: 'Número da Alma', valor: mapa.alma, icon: '💜', desc: SIGNIFICADOS[mapa.alma]?.titulo },
              { label: 'Personalidade', valor: mapa.personalidade, icon: '👤', desc: SIGNIFICADOS[mapa.personalidade]?.titulo },
              { label: 'Expressão', valor: mapa.expressao, icon: '✨', desc: SIGNIFICADOS[mapa.expressao]?.titulo },
              { label: 'Ano Pessoal 2026', valor: mapa.anoPessoal, icon: '📅', desc: SIGNIFICADOS[mapa.anoPessoal]?.titulo },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4 p-3 bg-purple-900/30 rounded-xl">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-purple-400">{item.label}</p>
                  <p className="text-sm font-semibold text-gold">{item.desc || 'Revelação especial'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold font-bold">{item.valor}</span>
                </div>
              </div>
            ))}

            <div className="p-4 bg-purple-900/30 rounded-xl">
              <p className="text-xs text-purple-400 mb-2">Análise Detalhada do Destino</p>
              <p className="text-sm text-purple-200">{significado.detalhado}</p>
            </div>

            <div className="p-4 bg-purple-900/30 rounded-xl text-center">
              <p className="text-xs text-purple-400 mb-2">Compatibilidade da Alma Gêmea</p>
              <div className="text-3xl font-bold text-gold">94%</div>
              <p className="text-sm text-purple-300 mt-1">Conexão numerológica excepcional</p>
            </div>

            <div className="p-4 bg-purple-900/30 rounded-xl text-center">
              <p className="text-xs text-purple-400 mb-3">Rosto da Sua Alma Gêmea</p>
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-800 to-purple-600 flex items-center justify-center">
                <span className="text-5xl">👤</span>
              </div>
              <p className="text-sm text-purple-300 mt-2">Gerado por inteligência artificial</p>
            </div>
          </div>

          {/* Paywall */}
          {!desbloqueado && !mostrarPagamento && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-purple-dark via-purple-dark/90 to-transparent rounded-2xl p-6">
              <span className="text-4xl mb-3">🔒</span>
              <h3 className="text-xl font-bold text-gold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                Desbloqueie seu Mapa Completo
              </h3>
              <ul className="text-sm text-purple-200 space-y-1.5 mb-4 text-left">
                <li>✅ Número da Alma e Personalidade</li>
                <li>✅ Previsão do Ano Pessoal 2026</li>
                <li>✅ Análise detalhada do seu perfil</li>
                <li>✅ Compatibilidade numerológica</li>
                <li>✅ Rosto da sua Alma Gêmea (IA)</li>
              </ul>

              <div className="text-center mb-4">
                <p className="text-xs text-purple-400 line-through">De R$ 29,90</p>
                <p className="text-3xl font-bold text-gold">R$ 9,90</p>
                <p className="text-xs text-purple-300">Pagamento único · Acesso imediato</p>
              </div>

              <button onClick={handleDesbloquear} disabled={carregandoPagamento}
                className="btn-gold w-full py-4 rounded-full text-lg animate-pulse-gold disabled:opacity-50">
                {carregandoPagamento ? '⏳ Carregando pagamento...' : '🔓 Desbloquear por R$ 9,90'}
              </button>

              <div className="flex items-center gap-4 mt-4 text-xs text-purple-400">
                <span>🔒 Pix</span>
                <span>💳 Cartão</span>
                <span>⚡ Instantâneo</span>
              </div>
            </div>
          )}
        </div>

        {/* Bricks payment container */}
        {mostrarPagamento && !desbloqueado && (
          <div className="card-mystic rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                Pagamento Seguro
              </h3>
              <button onClick={() => { setMostrarPagamento(false); setCarregandoPagamento(false) }}
                className="text-purple-400 hover:text-purple-300 text-sm">
                ✕ Fechar
              </button>
            </div>
            {carregandoPagamento && (
              <div className="text-center py-8">
                <span className="text-2xl animate-pulse">⏳</span>
                <p className="text-purple-300 text-sm mt-2">Carregando formulário de pagamento...</p>
              </div>
            )}
            <div id="mp-bricks-container" />
          </div>
        )}

        {/* Sucesso */}
        {desbloqueado && (
          <div className="card-mystic rounded-2xl p-6 text-center border-2 border-gold/30">
            <span className="text-4xl block mb-2">🎉</span>
            <h3 className="text-lg font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Mapa Desbloqueado!
            </h3>
            <p className="text-sm text-purple-300">
              Seu mapa numerológico completo está disponível acima. Aproveite todas as revelações!
            </p>
          </div>
        )}

        {/* Depoimentos */}
        <div className="space-y-3">
          <p className="text-center text-xs text-purple-400 uppercase tracking-wider">O que dizem nossos clientes</p>
          {[
            { nome: 'Ana C.', texto: 'Incrível como os números acertaram minha personalidade! O rosto gerado parece muito com meu namorado 😱', stars: 5 },
            { nome: 'Carlos M.', texto: 'Fiz por curiosidade e fiquei impressionado. O número do destino explicou muita coisa da minha vida.', stars: 5 },
            { nome: 'Juliana S.', texto: 'Melhor R$ 9,90 que já gastei! A análise do ano pessoal me ajudou a tomar uma decisão importante.', stars: 5 },
          ].map(d => (
            <div key={d.nome} className="card-mystic rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gold text-xs">{'⭐'.repeat(d.stars)}</span>
                <span className="text-xs text-purple-400 font-semibold">{d.nome}</span>
              </div>
              <p className="text-xs text-purple-200/80">{d.texto}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center gradient-mystic">
        <span className="text-purple-400 animate-pulse">✨ Calculando seus números...</span>
      </div>
    }>
      <ResultadoContent />
    </Suspense>
  )
}
