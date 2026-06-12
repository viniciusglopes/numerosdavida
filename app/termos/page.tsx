import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos e Condições | Números da Vida',
}

export default function TermosPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-gold text-sm mb-6 inline-block">← Voltar</Link>

        <h1 className="text-3xl font-bold gradient-gold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
          Termos e Condições
        </h1>

        <div className="space-y-6 text-sm text-purple-200/80 leading-relaxed">
          <p className="text-purple-400 text-xs">Última atualização: Junho 2026</p>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar o site Números da Vida ("Serviço"), você concorda com estes Termos e Condições. Se não concordar com qualquer parte destes termos, não utilize o Serviço. O Serviço é operado por Números da Vida.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">2. Descrição do Serviço</h2>
            <p>O Números da Vida oferece análises numerológicas personalizadas, incluindo cálculos de Número do Destino, Alma, Personalidade, Expressão, Ano Pessoal e compatibilidade. Os resultados são gerados com base em métodos tradicionais de numerologia pitagórica aplicados aos dados fornecidos pelo usuário.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">3. Fins de Entretenimento</h2>
            <p>Todo o conteúdo fornecido pelo Serviço é exclusivamente para fins de entretenimento e reflexão pessoal. As análises numerológicas não constituem e não devem ser interpretadas como aconselhamento profissional médico, financeiro, psicológico, jurídico ou de qualquer outra natureza. Você não deve tomar decisões importantes de vida com base exclusivamente nas informações fornecidas pelo Serviço.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">4. Elegibilidade</h2>
            <p>Você deve ter pelo menos 18 anos de idade para utilizar o Serviço. Ao utilizar o Serviço, você declara e garante que possui a idade mínima exigida.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">5. Pagamento e Preços</h2>
            <p>O Serviço oferece conteúdo gratuito (teaser) e conteúdo pago (mapa completo). O pagamento é único, sem assinatura ou cobrança recorrente. Os preços são exibidos em Reais (R$) e podem ser alterados sem aviso prévio. O pagamento é processado por meio do Mercado Pago, e ao realizar o pagamento você também concorda com os termos de uso do Mercado Pago.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">6. Política de Reembolso</h2>
            <p>Devido à natureza digital e de entrega instantânea do conteúdo, reembolsos não são oferecidos como padrão. Em caso de problemas técnicos que impeçam o acesso ao conteúdo pago, entre em contato com nosso suporte em até 7 dias após a compra para análise do caso.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">7. Propriedade Intelectual</h2>
            <p>Todo o conteúdo do Serviço, incluindo textos, algoritmos, design, imagens e metodologias de cálculo, é de propriedade exclusiva do Números da Vida. É proibida a reprodução, distribuição ou modificação sem autorização prévia por escrito.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">8. Limitação de Responsabilidade</h2>
            <p>O Números da Vida não se responsabiliza por quaisquer perdas, danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso do Serviço, incluindo decisões pessoais, financeiras ou de relacionamento tomadas com base nas análises fornecidas. O Serviço é fornecido "como está", sem garantias de qualquer natureza.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">9. Modificações</h2>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas por meio do Serviço. O uso continuado após modificações constitui aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">10. Contato</h2>
            <p>Para dúvidas sobre estes termos, entre em contato através da nossa <Link href="/suporte" className="text-gold underline hover:text-gold-light">página de suporte</Link>.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">11. Foro</h2>
            <p>Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de domicílio do consumidor para dirimir quaisquer controvérsias oriundas destes Termos, conforme previsto no Código de Defesa do Consumidor.</p>
          </section>
        </div>

        <div className="text-center mt-12">
          <p className="text-xs text-purple-400/40">Apenas para fins de entretenimento</p>
        </div>
      </div>
    </main>
  )
}
