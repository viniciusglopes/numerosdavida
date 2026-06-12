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
  periodo_nascimento: string
  numero_favorito: string
  elemento: string
  foco: string
  desafio: string
  sentimento_futuro: string
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

const PERIODOS = [
  { id: 'madrugada', icon: '🌙', label: 'Madrugada (00h–06h)' },
  { id: 'manha', icon: '🌅', label: 'Manhã (06h–12h)' },
  { id: 'tarde', icon: '☀️', label: 'Tarde (12h–18h)' },
  { id: 'noite', icon: '🌆', label: 'Noite (18h–00h)' },
  { id: 'nao_sei', icon: '❓', label: 'Não sei' },
]

const ELEMENTOS = [
  { id: 'fogo', icon: '🔥', label: 'Fogo', desc: 'Paixão e energia' },
  { id: 'agua', icon: '🌊', label: 'Água', desc: 'Emoção e intuição' },
  { id: 'terra', icon: '🌿', label: 'Terra', desc: 'Estabilidade e força' },
  { id: 'ar', icon: '💨', label: 'Ar', desc: 'Liberdade e intelecto' },
]

const DESAFIOS = [
  { id: 'financeiro', icon: '💸', label: 'Financeiro' },
  { id: 'emocional', icon: '💔', label: 'Emocional' },
  { id: 'profissional', icon: '💼', label: 'Profissional' },
  { id: 'saude', icon: '🏥', label: 'Saúde' },
  { id: 'espiritual', icon: '🙏', label: 'Espiritual' },
]

const SENTIMENTOS = [
  { id: 'otimista', icon: '😊', label: 'Otimista' },
  { id: 'ansioso', icon: '😰', label: 'Ansioso(a)' },
  { id: 'curioso', icon: '🤔', label: 'Curioso(a)' },
  { id: 'incerto', icon: '😶', label: 'Incerto(a)' },
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<QuizData>({
    nome: '', dia: '', mes: '', ano: '',
    genero: '', periodo_nascimento: '', numero_favorito: '',
    elemento: '', foco: '', desafio: '', sentimento_futuro: '',
    relacionamento: '', genero_parceiro: '',
  })

  const totalSteps = 11
  const progress = ((step + 1) / totalSteps) * 100

  const update = (field: keyof QuizData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const next = () => setStep(s => s + 1)
  const prev = () => setStep(s => Math.max(0, s - 1))

  const autoAdvance = (field: keyof QuizData, value: string) => {
    update(field, value)
    setTimeout(() => setStep(s => s + 1), 300)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      nome: data.nome,
      dia: data.dia,
      mes: data.mes,
      ano: data.ano,
      genero: data.genero,
      periodo: data.periodo_nascimento,
      numfav: data.numero_favorito,
      elem: data.elemento,
      foco: data.foco,
      desafio: data.desafio,
      sentimento: data.sentimento_futuro,
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
      case 3: return !!data.periodo_nascimento
      case 4: return !!data.numero_favorito
      case 5: return !!data.elemento
      case 6: return !!data.foco
      case 7: return !!data.desafio
      case 8: return !!data.sentimento_futuro
      case 9: return !!data.relacionamento
      case 10: return !!data.genero_parceiro
      default: return false
    }
  }

  const isAutoAdvanceStep = [2, 3, 5, 6, 7, 8, 9].includes(step)

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <Stars />

      <div className="relative z-10 w-full max-w-lg mx-auto">
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
                  <button key={g.id} onClick={() => autoAdvance('genero', g.id)}
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

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🕐</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Em que período você nasceu?
                </h2>
                <p className="text-purple-300/60 text-sm mt-2">
                  O momento do nascimento influencia sua energia vital
                </p>
              </div>
              <div className="space-y-2">
                {PERIODOS.map(p => (
                  <button key={p.id} onClick={() => autoAdvance('periodo_nascimento', p.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      data.periodo_nascimento === p.id
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-2xl">{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🔢</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Qual número te atrai mais?
                </h2>
                <p className="text-purple-300/60 text-sm mt-2">
                  Escolha por instinto, sem pensar demais
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <button key={n} onClick={() => { update('numero_favorito', String(n)); setTimeout(() => setStep(s => s + 1), 300) }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      data.numero_favorito === String(n)
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-2xl font-bold text-gold">{n}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🌍</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Qual elemento você sente mais conexão?
                </h2>
                <p className="text-purple-300/60 text-sm mt-2">
                  Seu elemento revela sua essência energética
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ELEMENTOS.map(e => (
                  <button key={e.id} onClick={() => autoAdvance('elemento', e.id)}
                    className={`p-5 rounded-xl border-2 transition-all text-center ${
                      data.elemento === e.id
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-3xl block mb-1">{e.icon}</span>
                    <span className="text-sm font-semibold block">{e.label}</span>
                    <span className="text-xs text-purple-400/60">{e.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🎯</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  O que você mais deseja descobrir?
                </h2>
              </div>
              <div className="space-y-2">
                {FOCOS.map(f => (
                  <button key={f.id} onClick={() => autoAdvance('foco', f.id)}
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

          {step === 7 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">⚡</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Qual seu maior desafio agora?
                </h2>
                <p className="text-purple-300/60 text-sm mt-2">
                  Os números podem revelar caminhos para superar obstáculos
                </p>
              </div>
              <div className="space-y-2">
                {DESAFIOS.map(d => (
                  <button key={d.id} onClick={() => autoAdvance('desafio', d.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      data.desafio === d.id
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-2xl">{d.icon}</span>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🔭</span>
                <h2 className="text-2xl font-bold gradient-gold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Como você se sente sobre o futuro?
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SENTIMENTOS.map(s => (
                  <button key={s.id} onClick={() => autoAdvance('sentimento_futuro', s.id)}
                    className={`p-5 rounded-xl border-2 transition-all text-center ${
                      data.sentimento_futuro === s.id
                        ? 'border-gold bg-gold/10'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}>
                    <span className="text-3xl block mb-1">{s.icon}</span>
                    <span className="text-sm">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 9 && (
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
                  <button key={r.id} onClick={() => autoAdvance('relacionamento', r.id)}
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

          {step === 10 && (
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
                  <button key={g.id} onClick={() => update('genero_parceiro', g.id)}
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

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button onClick={prev} className="text-purple-400 hover:text-purple-300 text-sm">
                ← Voltar
              </button>
            ) : <div />}

            {step < totalSteps - 1 && !isAutoAdvanceStep && step !== 4 ? (
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
