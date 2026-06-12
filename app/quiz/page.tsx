'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Stars from '@/components/Stars'

interface QuizData {
  nome: string
  dia: string
  mes: string
  ano: string
  genero: string
  foco: string
  relacionamento: string
  genero_parceiro: string
}

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]

const FOCOS = [
  { id: 'amor', icon: '💕', label: 'Amor e Relacionamentos' },
  { id: 'dinheiro', icon: '💰', label: 'Dinheiro e Prosperidade' },
  { id: 'carreira', icon: '🚀', label: 'Carreira e Propósito' },
  { id: 'saude', icon: '🧘', label: 'Saúde e Bem-estar' },
  { id: 'autoconhecimento', icon: '🔮', label: 'Autoconhecimento' },
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<QuizData>({
    nome: '', dia: '', mes: '', ano: '',
    genero: '', foco: '', relacionamento: '', genero_parceiro: '',
  })

  const totalSteps = 6
  const progress = ((step + 1) / totalSteps) * 100

  const update = (field: keyof QuizData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const next = () => setStep(s => s + 1)
  const prev = () => setStep(s => Math.max(0, s - 1))

  const handleSubmit = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      nome: data.nome,
      dia: data.dia,
      mes: data.mes,
      ano: data.ano,
      genero: data.genero,
      foco: data.foco,
      rel: data.relacionamento,
      gp: data.genero_parceiro,
    })
    router.push(`/resultado?${params.toString()}`)
  }

  const canNext = () => {
    switch (step) {
      case 0: return data.nome.trim().length >= 2
      case 1: return data.dia && data.mes && data.ano && parseInt(data.dia) >= 1 && parseInt(data.dia) <= 31 && parseInt(data.ano) >= 1940 && parseInt(data.ano) <= 2010
      case 2: return !!data.genero
      case 3: return !!data.foco
      case 4: return !!data.relacionamento
      case 5: return !!data.genero_parceiro
      default: return false
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <Stars />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-purple-400 mb-2">
            <span>Passo {step + 1} de {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
            <div className="progress-bar h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="card-mystic rounded-2xl p-8">
          {/* Step 0: Nome */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">📝</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Qual é o seu nome completo?
                </h2>
                <p className="text-purple-300/60 text-sm mt-2">
                  Na numerologia, cada letra do seu nome carrega uma vibração única
                </p>
              </div>
              <input
                type="text"
                value={data.nome}
                onChange={e => update('nome', e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-white placeholder-purple-400/40 focus:outline-none focus:border-gold/50 text-center text-lg"
                autoFocus
              />
            </div>
          )}

          {/* Step 1: Data de Nascimento */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">📅</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Data de Nascimento
                </h2>
                <p className="text-purple-300/60 text-sm mt-2">
                  Os números da sua data revelam seu Número do Destino
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-purple-400 mb-1 block text-center">Dia</label>
                  <input
                    type="number"
                    value={data.dia}
                    onChange={e => update('dia', e.target.value)}
                    placeholder="DD"
                    min="1" max="31"
                    className="w-full px-3 py-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-white text-center text-lg focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block text-center">Mês</label>
                  <select
                    value={data.mes}
                    onChange={e => update('mes', e.target.value)}
                    className="w-full px-2 py-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-white text-center text-sm focus:outline-none focus:border-gold/50"
                  >
                    <option value="">Mês</option>
                    {MESES.map((m, i) => (
                      <option key={m} value={String(i + 1)}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block text-center">Ano</label>
                  <input
                    type="number"
                    value={data.ano}
                    onChange={e => update('ano', e.target.value)}
                    placeholder="AAAA"
                    min="1940" max="2010"
                    className="w-full px-3 py-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-white text-center text-lg focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Gênero */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">👤</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Qual o seu gênero?
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'feminino', icon: '👩', label: 'Feminino' },
                  { id: 'masculino', icon: '👨', label: 'Masculino' },
                ].map(g => (
                  <button key={g.id} onClick={() => { update('genero', g.id); next() }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      data.genero === g.id
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-3xl block mb-1">{g.icon}</span>
                    <span className="text-sm">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Foco */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🎯</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  O que você mais deseja descobrir?
                </h2>
              </div>
              <div className="space-y-2">
                {FOCOS.map(f => (
                  <button key={f.id} onClick={() => { update('foco', f.id); next() }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      data.foco === f.id
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-2xl">{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Status relacionamento */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">💑</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Qual seu status de relacionamento?
                </h2>
              </div>
              <div className="space-y-2">
                {[
                  { id: 'solteiro', icon: '💫', label: 'Solteiro(a)' },
                  { id: 'namorando', icon: '💕', label: 'Namorando' },
                  { id: 'casado', icon: '💍', label: 'Casado(a)' },
                  { id: 'complicado', icon: '💔', label: 'É complicado' },
                ].map(r => (
                  <button key={r.id} onClick={() => { update('relacionamento', r.id); next() }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      data.relacionamento === r.id
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-2xl">{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Gênero parceiro (alma gêmea) */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🔮</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Quem é sua alma gêmea?
                </h2>
                <p className="text-purple-300/60 text-sm mt-2">
                  Vamos revelar o rosto da pessoa ideal para você
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'feminino', icon: '👩', label: 'Mulher' },
                  { id: 'masculino', icon: '👨', label: 'Homem' },
                ].map(g => (
                  <button key={g.id} onClick={() => { update('genero_parceiro', g.id); }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      data.genero_parceiro === g.id
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-3xl block mb-1">{g.icon}</span>
                    <span className="text-sm">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button onClick={prev} className="text-purple-400 hover:text-purple-300 text-sm">
                ← Voltar
              </button>
            ) : <div />}

            {step < totalSteps - 1 && step !== 2 && step !== 3 && step !== 4 ? (
              <button onClick={next} disabled={!canNext()}
                className="btn-gold px-6 py-2 rounded-full text-sm disabled:opacity-30 disabled:cursor-not-allowed">
                Continuar →
              </button>
            ) : step === totalSteps - 1 ? (
              <button onClick={handleSubmit} disabled={!canNext() || loading}
                className="btn-gold px-8 py-3 rounded-full text-sm disabled:opacity-30 disabled:cursor-not-allowed animate-pulse-gold">
                {loading ? '✨ Calculando...' : '🔮 Revelar meu Mapa'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
