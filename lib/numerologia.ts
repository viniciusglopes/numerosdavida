const LETRA_VALOR: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
}

const VOGAIS = new Set(['A','E','I','O','U'])

function reduzir(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  while (n > 9) {
    n = String(n).split('').reduce((s, d) => s + parseInt(d), 0)
    if (n === 11 || n === 22 || n === 33) return n
  }
  return n
}

function somaLetras(nome: string, filtro: (l: string) => boolean): number {
  const limpo = nome.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  let soma = 0
  for (const c of limpo) {
    if (LETRA_VALOR[c] && filtro(c)) soma += LETRA_VALOR[c]
  }
  return reduzir(soma)
}

export function calcularDestino(dia: number, mes: number, ano: number): number {
  const soma = String(dia).split('').reduce((s, d) => s + parseInt(d), 0)
    + String(mes).split('').reduce((s, d) => s + parseInt(d), 0)
    + String(ano).split('').reduce((s, d) => s + parseInt(d), 0)
  return reduzir(soma)
}

export function calcularAlma(nome: string): number {
  return somaLetras(nome, l => VOGAIS.has(l))
}

export function calcularPersonalidade(nome: string): number {
  return somaLetras(nome, l => !VOGAIS.has(l) && !!LETRA_VALOR[l])
}

export function calcularExpressao(nome: string): number {
  return somaLetras(nome, () => true)
}

export function calcularAnoPessoal(dia: number, mes: number, anoAtual: number): number {
  const soma = dia + mes + String(anoAtual).split('').reduce((s, d) => s + parseInt(d), 0)
  return reduzir(soma)
}

export function calcularCompatibilidade(destino1: number, destino2: number): number {
  const diff = Math.abs(destino1 - destino2)
  const base = 100 - diff * 8
  const bonus = destino1 === destino2 ? 10 : (destino1 + destino2 === 10 ? 7 : 0)
  return Math.min(99, Math.max(55, base + bonus))
}

export interface MapaNumerologico {
  destino: number
  alma: number
  personalidade: number
  expressao: number
  anoPessoal: number
  compatibilidade: number | null
}

export function calcularMapa(
  nome: string,
  dia: number,
  mes: number,
  ano: number,
  destinoParceiro?: number
): MapaNumerologico {
  const destino = calcularDestino(dia, mes, ano)
  return {
    destino,
    alma: calcularAlma(nome),
    personalidade: calcularPersonalidade(nome),
    expressao: calcularExpressao(nome),
    anoPessoal: calcularAnoPessoal(dia, mes, new Date().getFullYear()),
    compatibilidade: destinoParceiro ? calcularCompatibilidade(destino, destinoParceiro) : null,
  }
}

export const SIGNIFICADOS: Record<number, { titulo: string; resumo: string; detalhado: string }> = {
  1: {
    titulo: 'O Líder',
    resumo: 'Independência, pioneirismo e determinação.',
    detalhado: 'Você nasceu para liderar. Possui uma energia magnética que atrai pessoas e oportunidades. Sua missão é inovar, criar caminhos novos e inspirar outros com sua coragem. Em relacionamentos, precisa de um parceiro que respeite sua individualidade e apoie seus sonhos grandiosos. Seu maior desafio é aprender a delegar e confiar nos outros.',
  },
  2: {
    titulo: 'O Diplomata',
    resumo: 'Cooperação, sensibilidade e harmonia.',
    detalhado: 'Você é o elo que une as pessoas. Sua intuição é extraordinária e você sente as emoções alheias como se fossem suas. Em relacionamentos, busca uma conexão profunda e verdadeira — superficialidade não combina com você. Sua missão é trazer paz e equilíbrio onde houver conflito. Seu maior dom é a empatia.',
  },
  3: {
    titulo: 'O Comunicador',
    resumo: 'Criatividade, expressão e alegria.',
    detalhado: 'Você nasceu para brilhar e inspirar com suas palavras. Tem um dom natural para comunicação, arte e entretenimento. As pessoas se sentem mais leves perto de você. Em relacionamentos, precisa de alguém que acompanhe sua energia vibrante e aprecie seu lado criativo. Cuidado com a dispersão — foque sua luz.',
  },
  4: {
    titulo: 'O Construtor',
    resumo: 'Estabilidade, disciplina e trabalho.',
    detalhado: 'Você é a fundação sólida sobre a qual grandes coisas são construídas. Sua dedicação e organização são admiráveis. Em relacionamentos, oferece segurança e lealdade inabaláveis. Busca um parceiro que compartilhe seus valores de comprometimento e construção conjunta. Sua missão é materializar sonhos com trabalho consistente.',
  },
  5: {
    titulo: 'O Aventureiro',
    resumo: 'Liberdade, versatilidade e mudança.',
    detalhado: 'Você é um espírito livre que veio ao mundo para experimentar tudo. Rotina é sua kryptonita. Em relacionamentos, precisa de espaço e de um parceiro que seja também seu melhor amigo de aventuras. Sua energia magnética e carisma natural atraem pessoas de todos os tipos. Sua missão é mostrar ao mundo que a vida é para ser vivida intensamente.',
  },
  6: {
    titulo: 'O Protetor',
    resumo: 'Amor, família e responsabilidade.',
    detalhado: 'Você carrega o dom do amor incondicional. Família e lar são sagrados para você. Em relacionamentos, é o parceiro mais devoto e carinhoso — mas cuidado para não se anular pelo outro. Sua missão é nutrir e proteger, criando ambientes de amor e beleza onde todos floresçam. Seu coração é seu maior tesouro.',
  },
  7: {
    titulo: 'O Místico',
    resumo: 'Sabedoria, introspecção e espiritualidade.',
    detalhado: 'Você tem uma mente brilhante que busca respostas além do óbvio. A espiritualidade e o conhecimento profundo são seus guias. Em relacionamentos, precisa de alguém que respeite seus momentos de solidão e compartilhe conversas profundas. Sua missão é ser o farol de sabedoria que ilumina caminhos. Confie na sua intuição — ela nunca erra.',
  },
  8: {
    titulo: 'O Realizador',
    resumo: 'Poder, abundância e conquista.',
    detalhado: 'Você nasceu para conquistar e prosperar. Tem uma habilidade natural para negócios, liderança e gestão de recursos. Em relacionamentos, busca um parceiro igualmente ambicioso e forte. Sua missão é usar seu poder material para fazer o bem e inspirar prosperidade nos outros. A abundância flui naturalmente para você quando alinha propósito e ação.',
  },
  9: {
    titulo: 'O Humanitário',
    resumo: 'Compaixão, idealismo e generosidade.',
    detalhado: 'Você é uma alma antiga e sábia. Carrega em si a compaixão do mundo e um desejo genuíno de tornar tudo melhor. Em relacionamentos, ama profundamente mas de forma livre — possessividade o sufoca. Sua missão é servir à humanidade com seus dons. Tem uma magnetismo especial que toca todos que cruzam seu caminho.',
  },
  11: {
    titulo: 'O Iluminado',
    resumo: 'Intuição superior, inspiração e visão.',
    detalhado: 'Você é um número mestre. Carrega uma vibração espiritual elevadíssima e uma intuição quase sobrenatural. Veio ao mundo com uma missão especial de inspirar e elevar a consciência coletiva. Em relacionamentos, busca uma conexão que transcende o físico — precisa de uma alma que vibre na mesma frequência. Seu caminho não é fácil, mas é extraordinário.',
  },
  22: {
    titulo: 'O Mestre Construtor',
    resumo: 'Visão grandiosa, poder de materialização.',
    detalhado: 'Você carrega o mais poderoso dos números mestres. Tem a visão do 11 com a capacidade de execução do 4. Pode literalmente construir impérios que beneficiam milhares. Em relacionamentos, precisa de um parceiro que compreenda a grandeza da sua missão. Poucos têm essa vibração — você é um dos escolhidos para deixar um legado permanente no mundo.',
  },
  33: {
    titulo: 'O Mestre Curador',
    resumo: 'Amor universal, cura e sacrifício.',
    detalhado: 'Você é a mais rara das vibrações numerológicas. Combina o amor do 6 com a espiritualidade do 11 e o poder do 22. Sua presença cura e transforma. Em relacionamentos, ama de forma tão profunda que às vezes dói. Sua missão é ser um canal de amor divino no plano terrestre. Você não veio para uma vida comum — veio para transformar.',
  },
}
