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
  const [bookComprado, setBookComprado] = useState(false)
  const [mostrarPagamentoBook, setMostrarPagamentoBook] = useState(false)
  const [carregandoPagamentoBook, setCarregandoPagamentoBook] = useState(false)
  const [gerandoBook, setGerandoBook] = useState(false)

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

  const loadMPSdk = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (document.getElementById('mp-sdk')) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.id = 'mp-sdk'
      script.src = 'https://sdk.mercadopago.com/js/v2'
      script.onload = () => resolve()
      document.head.appendChild(script)
    })
  }, [])

  const initBricks = useCallback(async (containerId: string, amount: number, onApproved: () => void) => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ''
    if (!publicKey) {
      console.error('MP Public Key not found')
      return
    }

    try {
      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })
      const bricksBuilder = mp.bricks()

      const existingContainer = document.getElementById(containerId)
      if (existingContainer) existingContainer.innerHTML = ''

      await bricksBuilder.create('payment', containerId, {
        initialization: {
          amount,
        },
        customization: {
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            bankTransfer: ['pix'],
            maxInstallments: 1,
          },
        },
        callbacks: {
          onReady: () => {
            setCarregandoPagamento(false)
            setCarregandoPagamentoBook(false)
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            const payload = {
              ...formData,
              description: `Números da Vida - ${amount > 8 ? 'Mapa' : 'Book'} - ${nome}`,
            }
            const res = await fetch('/api/pagamento', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (data.status === 'approved') {
              onApproved()
            } else if (data.status === 'pending' && data.id) {
              const poll = setInterval(async () => {
                try {
                  const check = await fetch(`/api/pagamento-status?id=${data.id}`)
                  const result = await check.json()
                  if (result.status === 'approved') {
                    clearInterval(poll)
                    onApproved()
                  }
                } catch {}
              }, 5000)
              setTimeout(() => clearInterval(poll), 600000)
            } else {
              alert('Pagamento não aprovado. Tente novamente.')
            }
          },
          onError: (error: any) => {
            console.error('Bricks error:', error)
            alert('Erro no formulário de pagamento: ' + (error?.message || JSON.stringify(error)))
          },
        },
      })
    } catch (err: any) {
      console.error('Bricks init error:', err)
      alert('Erro ao inicializar pagamento: ' + (err?.message || JSON.stringify(err)))
    }
  }, [])

  const handleDesbloquear = async () => {
    setCarregandoPagamento(true)
    setMostrarPagamento(true)

    try {
      await loadMPSdk()
      initBricks('mp-bricks-container', 9.90, () => {
        setDesbloqueado(true)
        setMostrarPagamento(false)
      })
    } catch {
      alert('Erro de conexão. Tente novamente.')
      setMostrarPagamento(false)
      setCarregandoPagamento(false)
    }
  }

  const handleComprarBook = async () => {
    setCarregandoPagamentoBook(true)
    setMostrarPagamentoBook(true)

    try {
      await loadMPSdk()
      initBricks('mp-bricks-book-container', 6.90, () => {
        setBookComprado(true)
        setMostrarPagamentoBook(false)
      })
    } catch {
      alert('Erro de conexão. Tente novamente.')
      setMostrarPagamentoBook(false)
      setCarregandoPagamentoBook(false)
    }
  }

  const handleBaixarBook = async () => {
    setGerandoBook(true)
    try {
      const res = await fetch('/api/gerar-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, dia, mes, ano }),
      })
      if (!res.ok) throw new Error('Erro ao gerar')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `book-numerologico-${nome.split(' ')[0].toLowerCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Erro ao gerar o Book. Tente novamente.')
    }
    setGerandoBook(false)
  }

  const primeiroNome = nome.split(' ')[0]

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-8">
      <Stars />

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-6">
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

        {/* Paywall CTA - aparece entre teaser e conteúdo borrado */}
        {!desbloqueado && !mostrarPagamento && (
          <div className="card-mystic rounded-2xl p-6 text-center border-2 border-gold/20">
            <span className="text-3xl mb-2 block">🔒</span>
            <h3 className="text-xl font-bold text-gold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              Desbloqueie seu Mapa Completo
            </h3>
            <ul className="text-sm text-purple-200 space-y-1.5 mb-4 text-left max-w-xs mx-auto">
              <li>✅ Número da Alma e Personalidade</li>
              <li>✅ Previsão do Ano Pessoal 2026</li>
              <li>✅ Análise detalhada do seu perfil</li>
              <li>✅ Compatibilidade numerológica</li>
              <li>✅ Rosto da sua Alma Gêmea (IA)</li>
            </ul>
            <div className="mb-4">
              <p className="text-xs text-purple-400 line-through">De R$ 29,90</p>
              <p className="text-3xl font-bold text-gold">R$ 9,90</p>
              <p className="text-xs text-purple-300">Pagamento único · Acesso imediato</p>
            </div>
            <button onClick={handleDesbloquear} disabled={carregandoPagamento}
              className="btn-gold w-full py-4 rounded-full text-lg animate-pulse-gold disabled:opacity-50">
              {carregandoPagamento ? '⏳ Carregando pagamento...' : '🔓 Desbloquear por R$ 9,90'}
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-purple-400">
              <span>🔒 Pix</span>
              <span>💳 Cartão</span>
              <span>⚡ Instantâneo</span>
            </div>
          </div>
        )}

        {/* Bricks payment container - Mapa (aparece aqui em cima) */}
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

        </div>

        {/* Sucesso + Upsell Book */}
        {desbloqueado && (
          <>
            <div className="card-mystic rounded-2xl p-6 text-center border-2 border-gold/30">
              <span className="text-4xl block mb-2">🎉</span>
              <h3 className="text-lg font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                Mapa Desbloqueado!
              </h3>
              <p className="text-sm text-purple-300">
                Seu mapa numerológico completo está disponível acima.
              </p>
            </div>

            {/* UPSELL: Book Numerológico */}
            {!bookComprado && !mostrarPagamentoBook && (
              <div className="card-mystic rounded-2xl p-6 relative overflow-hidden border-2 border-purple-500/30">
                <div className="absolute top-0 right-0 bg-gold text-purple-dark text-xs font-bold px-3 py-1 rounded-bl-xl">
                  OFERTA ESPECIAL
                </div>
                <div className="text-center mt-2">
                  <span className="text-4xl block mb-3">📖</span>
                  <h3 className="text-xl font-bold gradient-gold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Quer ir mais fundo?
                  </h3>
                  <p className="text-sm text-purple-200/80 mb-4">
                    Receba seu Book Numerológico Completo em PDF — personalizado com seu nome e todos os seus números
                  </p>
                </div>

                <ul className="text-sm text-purple-200 space-y-2 mb-5">
                  <li className="flex items-center gap-2">
                    <span className="text-gold">📊</span> Análise aprofundada de cada número
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">📅</span> Previsões mensais 2026
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">💕</span> Tabela de compatibilidade completa
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">🍀</span> Números, cores e dia da sorte
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">💡</span> Dicas práticas + afirmação pessoal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">📄</span> PDF para guardar para sempre
                  </li>
                </ul>

                <div className="text-center mb-4">
                  <p className="text-xs text-purple-400 line-through">De R$ 19,90</p>
                  <p className="text-3xl font-bold text-gold">R$ 6,90</p>
                  <p className="text-xs text-purple-300">Adicional único · Download imediato</p>
                </div>

                <button onClick={handleComprarBook} disabled={carregandoPagamentoBook}
                  className="btn-gold w-full py-4 rounded-full text-lg animate-pulse-gold disabled:opacity-50">
                  {carregandoPagamentoBook ? '⏳ Carregando...' : '📖 Quero meu Book por R$ 6,90'}
                </button>
              </div>
            )}

            {/* Bricks payment container - Book */}
            {mostrarPagamentoBook && !bookComprado && (
              <div className="card-mystic rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Pagamento do Book
                  </h3>
                  <button onClick={() => { setMostrarPagamentoBook(false); setCarregandoPagamentoBook(false) }}
                    className="text-purple-400 hover:text-purple-300 text-sm">
                    ✕ Fechar
                  </button>
                </div>
                {carregandoPagamentoBook && (
                  <div className="text-center py-8">
                    <span className="text-2xl animate-pulse">⏳</span>
                    <p className="text-purple-300 text-sm mt-2">Carregando formulário de pagamento...</p>
                  </div>
                )}
                <div id="mp-bricks-book-container" />
              </div>
            )}

            {/* Book comprado - Download */}
            {bookComprado && (
              <div className="card-mystic rounded-2xl p-6 text-center border-2 border-gold/30">
                <span className="text-4xl block mb-2">📖</span>
                <h3 className="text-lg font-bold text-gold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Book Numerológico Adquirido!
                </h3>
                <p className="text-sm text-purple-300 mb-4">
                  Seu Book personalizado está pronto para download.
                </p>
                <button onClick={handleBaixarBook} disabled={gerandoBook}
                  className="btn-gold px-8 py-3 rounded-full text-sm disabled:opacity-50">
                  {gerandoBook ? '⏳ Gerando PDF...' : '📥 Baixar meu Book (PDF)'}
                </button>
              </div>
            )}
          </>
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
