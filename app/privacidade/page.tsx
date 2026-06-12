import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso de Privacidade | Números da Vida',
}

export default function PrivacidadePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-gold text-sm mb-6 inline-block">← Voltar</Link>

        <h1 className="text-3xl font-bold gradient-gold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
          Aviso de Privacidade
        </h1>

        <div className="space-y-6 text-sm text-purple-200/80 leading-relaxed">
          <p className="text-purple-400 text-xs">Última atualização: Junho 2026</p>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">1. Introdução</h2>
            <p>Este Aviso de Privacidade descreve como o Números da Vida ("nós", "nosso") coleta, usa e protege suas informações pessoais quando você utiliza nosso site e serviços. Respeitamos sua privacidade e estamos comprometidos em proteger seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">2. Dados que Coletamos</h2>
            <p className="mb-2">Coletamos os seguintes dados fornecidos diretamente por você durante o quiz:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Nome completo</li>
              <li>Data de nascimento (dia, mês e ano)</li>
              <li>Gênero</li>
              <li>Área de interesse/foco</li>
              <li>Status de relacionamento</li>
              <li>Preferência de gênero da alma gêmea</li>
            </ul>
            <p className="mt-2">Ao realizar o pagamento, os dados financeiros (cartão de crédito, CPF, etc.) são processados diretamente pelo Mercado Pago. Nós não armazenamos dados de pagamento em nossos servidores.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">3. Como Usamos Seus Dados</h2>
            <p className="mb-2">Utilizamos seus dados exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Gerar sua análise numerológica personalizada</li>
              <li>Processar seu pagamento (via Mercado Pago)</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
            </ul>
            <p className="mt-2">Seus dados do quiz são processados no momento da consulta para gerar os cálculos numerológicos. Não utilizamos seus dados para finalidades diferentes das descritas sem seu consentimento.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">4. Compartilhamento de Dados</h2>
            <p className="mb-2">Seus dados podem ser compartilhados com:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Mercado Pago: para processamento de pagamentos</li>
              <li>Provedores de hospedagem: para manter o serviço em funcionamento</li>
            </ul>
            <p className="mt-2">Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">5. Cookies e Tecnologias de Rastreamento</h2>
            <p>Podemos utilizar cookies essenciais para o funcionamento do site. Não utilizamos cookies de rastreamento publicitário de terceiros.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">6. Segurança dos Dados</h2>
            <p>Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Todo o tráfego é criptografado via HTTPS/SSL.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">7. Seus Direitos (LGPD)</h2>
            <p className="mb-2">Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a eliminação dos seus dados</li>
              <li>Obter informações sobre o compartilhamento dos dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>
            <p className="mt-2">Para exercer qualquer um desses direitos, entre em contato através da nossa <Link href="/suporte" className="text-gold underline hover:text-gold-light">página de suporte</Link>.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">8. Menores de Idade</h2>
            <p>Nosso Serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se tomarmos conhecimento de que coletamos dados de um menor, tomaremos medidas para excluir essas informações.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">9. Alterações neste Aviso</h2>
            <p>Podemos atualizar este Aviso de Privacidade periodicamente. Recomendamos que revise esta página regularmente. Alterações entram em vigor imediatamente após a publicação.</p>
          </section>

          <section>
            <h2 className="text-lg text-gold font-semibold mb-2">10. Contato</h2>
            <p>Para dúvidas sobre este aviso de privacidade ou sobre o tratamento dos seus dados, entre em contato através da nossa <Link href="/suporte" className="text-gold underline hover:text-gold-light">página de suporte</Link>.</p>
          </section>
        </div>

        <div className="text-center mt-12">
          <p className="text-xs text-purple-400/40">Apenas para fins de entretenimento</p>
        </div>
      </div>
    </main>
  )
}
