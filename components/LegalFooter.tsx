import Link from 'next/link'

export default function LegalFooter() {
  return (
    <footer className="relative z-10 text-center py-6 px-4 mt-auto">
      <p className="text-xs text-purple-400/60 leading-relaxed max-w-md mx-auto">
        Ao continuar, concordas com os nossos{' '}
        <Link href="/termos" className="text-purple-300/80 underline hover:text-gold transition-colors">
          Termos e Condições
        </Link>{' '}
        e{' '}
        <Link href="/privacidade" className="text-purple-300/80 underline hover:text-gold transition-colors">
          Aviso de Privacidade
        </Link>
        . Tens alguma dúvida? Contacta a nossa{' '}
        <Link href="/suporte" className="text-purple-300/80 underline hover:text-gold transition-colors">
          equipa de apoio aqui
        </Link>
        .
      </p>
      <p className="text-xs text-purple-400/40 mt-2">
        Apenas para fins de entretenimento
      </p>
    </footer>
  )
}
