import Link from 'next/link'
import Stars from '@/components/Stars'

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <Stars />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="animate-float mb-8">
          <span className="text-6xl">✨</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <span className="gradient-gold">Números da Vida</span>
        </h1>

        <p className="text-lg md:text-xl text-purple-200 mb-3">
          Descubra o que os números revelam sobre seu destino
        </p>

        <p className="text-sm text-purple-300/70 mb-10">
          Mais de <span className="text-gold-light font-semibold">47.000</span> mapas numerológicos revelados
        </p>

        <Link href="/quiz"
          className="btn-gold inline-block px-10 py-4 rounded-full text-lg animate-pulse-gold">
          Descobrir meu Mapa Numerológico
        </Link>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          {[
            { icon: '🔮', label: 'Número do Destino', desc: 'Sua missão de vida' },
            { icon: '💜', label: 'Número da Alma', desc: 'Seus desejos profundos' },
            { icon: '👤', label: 'Personalidade', desc: 'Como o mundo te vê' },
          ].map(item => (
            <div key={item.label} className="card-mystic rounded-xl p-4">
              <span className="text-3xl">{item.icon}</span>
              <p className="text-gold font-semibold text-sm mt-2">{item.label}</p>
              <p className="text-purple-300/60 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
