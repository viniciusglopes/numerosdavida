import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suporte | Números da Vida',
}

const FAQ = [
  {
    q: 'Como funciona a análise numerológica?',
    a: 'Utilizamos o método da numerologia pitagórica para calcular seus números pessoais a partir do seu nome completo e data de nascimento. Cada número revela aspectos diferentes da sua personalidade, destino e caminho de vida.',
  },
  {
    q: 'O pagamento é único ou recorrente?',
    a: 'O pagamento é único. Você paga R$ 9,90 uma vez e recebe acesso imediato ao seu mapa numerológico completo. Não há assinatura nem cobranças recorrentes.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos pagamento via Pix (instantâneo) e cartão de crédito, processados de forma segura pelo Mercado Pago.',
  },
  {
    q: 'Paguei mas o conteúdo não desbloqueou. O que faço?',
    a: 'Se o pagamento foi via Pix, aguarde alguns segundos para a confirmação. Caso o problema persista, entre em contato conosco informando seu nome e a data/hora do pagamento.',
  },
  {
    q: 'Posso solicitar reembolso?',
    a: 'Devido à natureza digital e entrega instantânea, reembolsos não são oferecidos como padrão. Em casos de problemas técnicos comprovados, analisamos a solicitação individualmente se feita em até 7 dias.',
  },
  {
    q: 'Meus dados estão seguros?',
    a: 'Sim. Seus dados do quiz são usados apenas para gerar a análise. Dados de pagamento são processados diretamente pelo Mercado Pago — não armazenamos informações financeiras. Mais detalhes no nosso Aviso de Privacidade.',
  },
  {
    q: 'A numerologia é real?',
    a: 'A numerologia é uma prática milenar usada para autoconhecimento e reflexão pessoal. Nosso serviço é oferecido exclusivamente para fins de entretenimento e não substitui aconselhamento profissional.',
  },
]

export default function SuportePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-gold text-sm mb-6 inline-block">← Voltar</Link>

        <h1 className="text-3xl font-bold gradient-gold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          Suporte
        </h1>
        <p className="text-purple-300/60 text-sm mb-10">
          Encontre respostas para as perguntas mais frequentes ou entre em contato conosco.
        </p>

        <div className="space-y-4 mb-12">
          <h2 className="text-lg text-gold font-semibold">Perguntas Frequentes</h2>
          {FAQ.map((item, i) => (
            <div key={i} className="card-mystic rounded-xl p-5">
              <h3 className="text-sm font-semibold text-purple-100 mb-2">{item.q}</h3>
              <p className="text-sm text-purple-200/70 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="card-mystic rounded-2xl p-8 text-center">
          <span className="text-4xl block mb-3">💬</span>
          <h2 className="text-xl font-bold text-gold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ainda precisa de ajuda?
          </h2>
          <p className="text-sm text-purple-200/70 mb-4">
            Entre em contato conosco e responderemos o mais rápido possível.
          </p>
          <a href="mailto:suporte@numerosdavida.com.br"
            className="btn-gold inline-block px-8 py-3 rounded-full text-sm">
            Enviar e-mail
          </a>
          <p className="text-xs text-purple-400/60 mt-4">suporte@numerosdavida.com.br</p>
        </div>

        <div className="mt-8 text-center text-xs text-purple-400/60 space-x-4">
          <Link href="/termos" className="hover:text-gold underline">Termos e Condições</Link>
          <Link href="/privacidade" className="hover:text-gold underline">Aviso de Privacidade</Link>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-purple-400/40">Apenas para fins de entretenimento</p>
        </div>
      </div>
    </main>
  )
}
