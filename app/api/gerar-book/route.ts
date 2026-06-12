import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { calcularMapa, SIGNIFICADOS } from '@/lib/numerologia'

const MESES_NOME = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const PREVISOES_MENSAIS: Record<number, string> = {
  1: 'Mês de novos começos e iniciativas. Tome a frente dos seus projetos.',
  2: 'Mês de parcerias e paciência. Coopere e espere o momento certo.',
  3: 'Mês de criatividade e comunicação. Expresse-se e socialize.',
  4: 'Mês de trabalho e organização. Construa bases sólidas.',
  5: 'Mês de mudanças e liberdade. Esteja aberto a novas experiências.',
  6: 'Mês de família e responsabilidades. Cuide de quem você ama.',
  7: 'Mês de introspecção e estudo. Mergulhe no autoconhecimento.',
  8: 'Mês de poder e conquistas materiais. Foque em resultados.',
  9: 'Mês de conclusões e desapego. Encerre ciclos com gratidão.',
}

const NUMEROS_SORTE: Record<number, number[]> = {
  1: [1, 10, 19, 28, 37],
  2: [2, 11, 20, 29, 38],
  3: [3, 12, 21, 30, 39],
  4: [4, 13, 22, 31, 40],
  5: [5, 14, 23, 32, 41],
  6: [6, 15, 24, 33, 42],
  7: [7, 16, 25, 34, 43],
  8: [8, 17, 26, 35, 44],
  9: [9, 18, 27, 36, 45],
  11: [11, 22, 33, 44, 55],
  22: [22, 33, 44, 55, 66],
  33: [33, 44, 55, 66, 77],
}

const CORES_SORTE: Record<number, string[]> = {
  1: ['Vermelho', 'Laranja', 'Dourado'],
  2: ['Branco', 'Prata', 'Creme'],
  3: ['Amarelo', 'Laranja', 'Lilás'],
  4: ['Verde', 'Marrom', 'Azul-escuro'],
  5: ['Turquesa', 'Aquamarine', 'Prata'],
  6: ['Azul', 'Rosa', 'Verde-claro'],
  7: ['Violeta', 'Púrpura', 'Cinza'],
  8: ['Preto', 'Dourado', 'Bordô'],
  9: ['Vermelho-escuro', 'Ouro', 'Bronze'],
  11: ['Prata', 'Violeta', 'Branco-lunar'],
  22: ['Dourado', 'Verde-esmeralda', 'Azul-real'],
  33: ['Rosa-ouro', 'Violeta', 'Dourado'],
}

const DICAS: Record<number, string[]> = {
  1: ['Lidere sem medo, mas aprenda a ouvir', 'Medite 10 min por dia para equilibrar a energia', 'Invista em projetos individuais', 'Pratique atividades físicas intensas'],
  2: ['Desenvolva sua intuição com práticas contemplativas', 'Busque parcerias que complementem seus talentos', 'Evite absorver emoções alheias', 'Pratique artes como música ou dança'],
  3: ['Canalize sua criatividade em projetos concretos', 'Evite dispersão — foque em 1-2 objetivos', 'Use a escrita como forma de expressão', 'Socialize mais, sua energia contagia'],
  4: ['Crie rotinas que tragam segurança', 'Não tenha medo de sair da zona de conforto', 'Planeje financeiramente a longo prazo', 'Reserve tempo para lazer e diversão'],
  5: ['Viaje sempre que puder, mesmo que perto', 'Aprenda algo novo a cada mês', 'Cuidado com excessos e impulsividade', 'Mantenha um diário de gratidão'],
  6: ['Cuide de si antes de cuidar dos outros', 'Decore seu espaço com coisas que ama', 'Estabeleça limites saudáveis', 'Pratique artes manuais ou culinária'],
  7: ['Reserve momentos de solidão produtiva', 'Estude filosofia, espiritualidade ou ciência', 'Confie mais na sua intuição', 'Conecte-se com a natureza regularmente'],
  8: ['Defina metas financeiras claras', 'Use seu poder para ajudar outros', 'Delegue tarefas e confie na equipe', 'Pratique generosidade consciente'],
  9: ['Voluntarie-se em causas que acredita', 'Aprenda a se desapegar do que não serve mais', 'Viaje para expandir sua visão de mundo', 'Pratique a compaixão começando por si'],
  11: ['Honre sua sensibilidade como um dom', 'Desenvolva práticas espirituais diárias', 'Busque um mentor ou guia espiritual', 'Use sua intuição para guiar decisões'],
  22: ['Pense grande — você pode materializar', 'Construa projetos que beneficiem muitos', 'Não se intimide com a grandeza da missão', 'Cerque-se de pessoas visionárias'],
  33: ['Pratique o amor incondicional sem se anular', 'Sua presença já cura — esteja presente', 'Busque equilíbrio entre dar e receber', 'Desenvolva sua arte de cura interior'],
}

function reduzirSimples(n: number): number {
  while (n > 9) {
    n = String(n).split('').reduce((s, d) => s + parseInt(d), 0)
  }
  return n
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, dia, mes, ano } = body

    const mapa = calcularMapa(nome, parseInt(dia), parseInt(mes), parseInt(ano))
    const primeiroNome = (nome || '').split(' ')[0]

    const doc = new PDFDocument({ size: 'A4', margin: 60 })
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))

    const pageWidth = doc.page.width - 120

    const addTitle = (text: string, size = 22) => {
      doc.fontSize(size).font('Helvetica-Bold').fillColor('#d4a843').text(text, { align: 'center' })
      doc.moveDown(0.5)
    }

    const addSubtitle = (text: string) => {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#8b5cf6').text(text)
      doc.moveDown(0.3)
    }

    const addBody = (text: string) => {
      doc.fontSize(11).font('Helvetica').fillColor('#333333').text(text, { align: 'justify', lineGap: 4 })
      doc.moveDown(0.5)
    }

    const addSeparator = () => {
      doc.moveDown(0.3)
      const y = doc.y
      doc.strokeColor('#d4a843').lineWidth(0.5)
        .moveTo(60, y).lineTo(60 + pageWidth, y).stroke()
      doc.moveDown(0.5)
    }

    const checkNewPage = (space = 100) => {
      if (doc.y > doc.page.height - space - 60) doc.addPage()
    }

    // --- CAPA ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0a0118')
    doc.fontSize(36).font('Helvetica-Bold').fillColor('#d4a843')
      .text('NÚMEROS DA VIDA', 60, 200, { align: 'center', width: pageWidth })
    doc.moveDown(1)
    doc.fontSize(18).fillColor('#c084fc')
      .text('Book Numerológico Completo', { align: 'center', width: pageWidth })
    doc.moveDown(2)
    doc.fontSize(16).fillColor('#ffffff')
      .text(`Preparado exclusivamente para`, { align: 'center', width: pageWidth })
    doc.moveDown(0.3)
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#d4a843')
      .text(nome || 'Você', { align: 'center', width: pageWidth })
    doc.moveDown(2)
    doc.fontSize(11).font('Helvetica').fillColor('#c084fc')
      .text(`Nascimento: ${dia}/${mes}/${ano}`, { align: 'center', width: pageWidth })
    doc.moveDown(4)
    doc.fontSize(9).fillColor('#666')
      .text('Números da Vida © 2026 — Apenas para fins de entretenimento', { align: 'center', width: pageWidth })

    // --- PÁGINA 2: SEU MAPA ---
    doc.addPage()
    addTitle('Seu Mapa Numerológico')
    addSeparator()

    const numeros = [
      { label: 'Número do Destino', valor: mapa.destino, desc: 'Sua missão de vida e caminho evolutivo' },
      { label: 'Número da Alma', valor: mapa.alma, desc: 'Seus desejos mais profundos e motivações internas' },
      { label: 'Número da Personalidade', valor: mapa.personalidade, desc: 'Como o mundo te enxerga' },
      { label: 'Número da Expressão', valor: mapa.expressao, desc: 'Seus talentos e habilidades naturais' },
      { label: 'Ano Pessoal 2026', valor: mapa.anoPessoal, desc: 'A energia que governa seu ano atual' },
    ]

    for (const n of numeros) {
      const sig = SIGNIFICADOS[n.valor]
      addSubtitle(`${n.label}: ${n.valor} — ${sig?.titulo || 'Especial'}`)
      addBody(n.desc)
      doc.moveDown(0.3)
    }

    // --- PÁGINA 3: ANÁLISE DESTINO ---
    doc.addPage()
    addTitle(`Destino ${mapa.destino}: ${SIGNIFICADOS[mapa.destino]?.titulo || 'Especial'}`)
    addSeparator()
    addBody(SIGNIFICADOS[mapa.destino]?.detalhado || '')
    doc.moveDown(1)

    addSubtitle('O que isso significa na prática')
    addBody(`Com o Destino ${mapa.destino}, você possui uma vibração que naturalmente atrai situações que desafiam e desenvolvem as qualidades de ${SIGNIFICADOS[mapa.destino]?.titulo || 'sua essência'}. Ao longo da vida, você perceberá padrões recorrentes que apontam para essa missão. Aceitar e abraçar essa energia é o caminho para a realização plena.`)

    // --- PÁGINA 4: ANÁLISE ALMA ---
    checkNewPage(200)
    doc.addPage()
    addTitle(`Alma ${mapa.alma}: ${SIGNIFICADOS[mapa.alma]?.titulo || 'Especial'}`)
    addSeparator()
    addBody(SIGNIFICADOS[mapa.alma]?.detalhado || '')
    doc.moveDown(1)
    addSubtitle('Seus desejos ocultos')
    addBody(`O Número da Alma ${mapa.alma} revela que, internamente, você busca experiências que ressoam com a energia de ${SIGNIFICADOS[mapa.alma]?.titulo || 'sua essência'}. Enquanto o mundo pode não ver essa busca, ela é o motor silencioso de muitas das suas decisões. Honrar esses desejos profundos traz paz interior e autenticidade.`)

    // --- PÁGINA 5: PERSONALIDADE + EXPRESSÃO ---
    doc.addPage()
    addTitle('Personalidade e Expressão')
    addSeparator()

    addSubtitle(`Personalidade ${mapa.personalidade}: ${SIGNIFICADOS[mapa.personalidade]?.titulo || 'Especial'}`)
    addBody(`A forma como os outros te percebem está diretamente ligada à energia do número ${mapa.personalidade}. ${SIGNIFICADOS[mapa.personalidade]?.resumo || ''} Esta é a máscara que você mostra ao mundo — não por falsidade, mas como uma proteção natural da sua essência mais íntima.`)
    doc.moveDown(0.5)

    addSubtitle(`Expressão ${mapa.expressao}: ${SIGNIFICADOS[mapa.expressao]?.titulo || 'Especial'}`)
    addBody(`Seus talentos naturais vibram na frequência do número ${mapa.expressao}. ${SIGNIFICADOS[mapa.expressao]?.resumo || ''} Quando você alinha sua carreira e atividades com essa energia, o sucesso flui naturalmente. É onde você é mais autêntico e eficiente.`)

    // --- PÁGINA 6: ANO PESSOAL + PREVISÕES MENSAIS ---
    doc.addPage()
    addTitle(`Ano Pessoal 2026: ${mapa.anoPessoal}`)
    addSeparator()
    addBody(`Seu Ano Pessoal é ${mapa.anoPessoal} — ${SIGNIFICADOS[mapa.anoPessoal]?.titulo || 'Especial'}. ${SIGNIFICADOS[mapa.anoPessoal]?.resumo || ''} Este é o tema energético que permeia todo o seu 2026. Cada decisão, oportunidade e desafio deste ano está colorido por essa vibração.`)
    doc.moveDown(0.5)

    addSubtitle('Previsões Mensais 2026')
    doc.moveDown(0.3)

    for (let m = 0; m < 12; m++) {
      checkNewPage(60)
      const mesPessoal = reduzirSimples(mapa.anoPessoal + m + 1)
      const previsao = PREVISOES_MENSAIS[mesPessoal] || 'Mês de transformação e crescimento pessoal.'
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#8b5cf6')
        .text(`${MESES_NOME[m]}:`, { continued: true })
      doc.font('Helvetica').fillColor('#333333')
        .text(` ${previsao}`)
      doc.moveDown(0.3)
    }

    // --- PÁGINA 7: COMPATIBILIDADE ---
    doc.addPage()
    addTitle('Compatibilidade Numerológica')
    addSeparator()

    addBody(`Com base no seu Número do Destino (${mapa.destino}), analisamos a compatibilidade com cada vibração:`)
    doc.moveDown(0.5)

    for (let i = 1; i <= 9; i++) {
      checkNewPage(50)
      const compat = 100 - Math.abs(mapa.destino - i) * 8 + (mapa.destino === i ? 10 : (mapa.destino + i === 10 ? 7 : 0))
      const pct = Math.min(99, Math.max(55, compat))
      const nivel = pct >= 90 ? 'Excelente' : pct >= 80 ? 'Muito boa' : pct >= 70 ? 'Boa' : 'Moderada'
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#8b5cf6')
        .text(`Destino ${i} (${SIGNIFICADOS[i]?.titulo}): `, { continued: true })
      doc.font('Helvetica').fillColor('#333333')
        .text(`${pct}% — ${nivel}`)
      doc.moveDown(0.2)
    }

    // --- PÁGINA 8: NÚMEROS E CORES DA SORTE ---
    doc.addPage()
    addTitle('Números e Cores da Sorte')
    addSeparator()

    addSubtitle('Seus Números da Sorte')
    const numSorte = NUMEROS_SORTE[mapa.destino] || NUMEROS_SORTE[1]
    addBody(`Com base no seu Destino ${mapa.destino}, seus números de maior vibração positiva são: ${numSorte.join(', ')}. Use-os em decisões importantes, escolha de datas e momentos estratégicos.`)
    doc.moveDown(0.5)

    addSubtitle('Suas Cores da Sorte')
    const coresSorte = CORES_SORTE[mapa.destino] || CORES_SORTE[1]
    addBody(`As cores que amplificam sua energia são: ${coresSorte.join(', ')}. Vista essas cores em dias importantes, decore seu ambiente de trabalho ou use como acessórios para potencializar sua vibração.`)
    doc.moveDown(1)

    addSubtitle('Dia da Semana mais Favorável')
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const diaFavoravel = diasSemana[reduzirSimples(mapa.destino) % 7]
    addBody(`Seu dia de maior potência energética é ${diaFavoravel}. Sempre que possível, agende compromissos importantes, reuniões decisivas e novos começos nesse dia.`)

    // --- PÁGINA 9: DICAS PRÁTICAS ---
    doc.addPage()
    addTitle('Dicas Práticas para Sua Vida')
    addSeparator()

    const dicas = DICAS[mapa.destino] || DICAS[1]
    for (const dica of dicas) {
      checkNewPage(50)
      doc.fontSize(11).font('Helvetica').fillColor('#333333')
        .text(`• ${dica}`, { lineGap: 4 })
      doc.moveDown(0.4)
    }

    doc.moveDown(1)
    addSubtitle('Afirmação Pessoal')
    const afirmacoes: Record<number, string> = {
      1: 'Eu sou líder do meu destino e crio meu caminho com coragem.',
      2: 'Eu sou ponte de harmonia e minha sensibilidade é meu poder.',
      3: 'Eu me expresso com autenticidade e minha criatividade transforma.',
      4: 'Eu construo bases sólidas e minha dedicação gera abundância.',
      5: 'Eu abraço a mudança e cada experiência me torna mais sábio.',
      6: 'Eu amo incondicionalmente e minha proteção fortalece quem amo.',
      7: 'Eu confio na minha intuição e a sabedoria flui através de mim.',
      8: 'Eu sou merecedor de abundância e meu poder beneficia a todos.',
      9: 'Eu sirvo com compaixão e minha generosidade retorna multiplicada.',
      11: 'Eu honro minha missão espiritual e minha luz ilumina caminhos.',
      22: 'Eu materializo visões grandiosas e meu legado transforma o mundo.',
      33: 'Eu sou canal de amor divino e minha presença cura e eleva.',
    }
    addBody(`"${afirmacoes[mapa.destino] || afirmacoes[1]}"`)
    addBody('Repita essa afirmação todas as manhãs por 21 dias e observe a transformação.')

    // --- CONTRACAPA ---
    doc.addPage()
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0a0118')
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#d4a843')
      .text('Obrigado por confiar nos', 60, 250, { align: 'center', width: pageWidth })
    doc.moveDown(0.5)
    doc.fontSize(30).text('Números da Vida', { align: 'center', width: pageWidth })
    doc.moveDown(2)
    doc.fontSize(12).font('Helvetica').fillColor('#c084fc')
      .text(`Este book foi preparado com carinho para ${primeiroNome}.`, { align: 'center', width: pageWidth })
    doc.moveDown(0.5)
    doc.fontSize(10).fillColor('#666')
      .text('numerosdavida.com.br', { align: 'center', width: pageWidth })
    doc.moveDown(1)
    doc.fontSize(8).fillColor('#444')
      .text('Conteúdo exclusivamente para fins de entretenimento e reflexão pessoal.', { align: 'center', width: pageWidth })
    doc.moveDown(0.3)
    doc.text('Não substitui aconselhamento profissional de qualquer natureza.', { align: 'center', width: pageWidth })

    doc.end()

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
    })

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="book-numerologico-${primeiroNome.toLowerCase()}.pdf"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
