import type { Immersion } from "./types";

export const founderIa: Immersion = {
  slug: "founder-ia",
  title: "Imersão Founder IA",
  subtitle:
    "A imersão para quem quer construir uma empresa AI First com mentalidade de fundador.",
  highlightWord: "Founder",
  logo: "",
  descriptor: "IA × STARTUP × CRESCIMENTO",

  whyTitle: "Empresa AI First não é empresa que usa IA. É empresa que pensa com IA.",
  whyBody:
    "Founders que constroem em 2026 partem de outro ponto. Não testam IA depois de validar. **Constroem com IA desde o primeiro dia, em toda decisão, produto, operação e narrativa**.\n\nEsta imersão de 8 horas é para fundadores em fase pré-MVP, em busca de PMF ou em transição para crescimento. Cada bloco é construído para sair com decisão, ativo ou plano executável.",
  whyAccents: [
    "Constroem com IA desde o primeiro dia, em toda decisão, produto, operação e narrativa",
    "decisão, ativo ou plano executável",
  ],

  results: [
    {
      label: "TESE + MVP",
      value: "1",
      description:
        "tese estruturada e MVP funcional ao fim da imersão, sem dependência de time técnico inicial.",
    },
    {
      label: "NARRATIVA E PITCH",
      value: "1",
      description:
        "narrativa fundadora consistente e pitch de 5 minutos validado em sessão de feedback.",
    },
    {
      label: "PLANO DE CRESCIMENTO",
      value: "90d",
      description:
        "plano executivo de 90 dias com marcos, datas, hipóteses e critérios go/no-go.",
    },
  ],

  instructors: [
    {
      name: "Aurimar Nogueira",
      role: "INSTRUTOR",
      photo: "/photos/aurimar-editorial.jpg",
      bio: "Coordenador Sr. de Negócios Financeiros na LATAM Pass. Lançou produtos do zero em ambientes regulados na CERC, atingindo 60% de market share contra a B3 e registrando a primeira CPR Verde do Brasil. Aplica frameworks autorais (Método Jet, GSD2, Innovation2Business) em squads corporativas e em construção de novos negócios.",
      credentials: ["LATAM PASS", "CERC", "CRDC", "STONE", "INNOVATION2BUSINESS"],
    },
  ],

  program: {
    morning: {
      label: "MANHÃ",
      schedule: "08h30 às 12h30",
      subtitle: "Tese, MVP e Narrativa Fundadora",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h30",
          title: "Mentalidade fundadora AI First",
          body: "O que muda quando se constrói empresa com IA desde o dia zero. Velocidade, capital, equipe e cultura sob lógica nova.",
          bullets: [
            "AI First vs AI Enabled: diferenças concretas em decisão diária",
            "Velocidade como vantagem competitiva sustentável",
            "Capital eficiente: por que founder AI First gasta menos para validar",
            "Cultura desde o dia zero: o que decidir cedo, o que postergar",
          ],
        },
        {
          number: "02",
          time: "09h30 às 10h30",
          title: "Tese de negócio em uma página",
          body: "Estrutura compacta e defensável de tese. Como validar premissas com IA antes de gastar capital ou contratar time.",
          quote:
            "Tese de founder não precisa de deck para sustentar. Precisa de mercado para validar.",
          bullets: [
            "Os 5 elementos não negociáveis da tese fundadora",
            "Diferencial defensável: o que ninguém mais consegue replicar fácil",
            "Validação rápida de premissa antes de gastar capital",
            "3 iterações da tese em uma sessão de 60 minutos",
          ],
          exercise: "Escreva sua tese em uma página e leve para feedback do grupo.",
        },
        {
          number: "03",
          time: "10h45 às 11h30",
          title: "Construindo MVP com IA",
          body: "Do conceito ao protótipo funcional em horas. Ferramentas, padrões e limites do MVP construído com IA.",
          comparison: {
            before: {
              head: "FOUNDER TRADICIONAL",
              body: "Contratar dev sênior, gastar 6 meses de runway, validar tarde. Risco existencial alto.",
            },
            now: {
              head: "FOUNDER AI FIRST",
              body: "Construir protótipo em dias, validar em semanas, contratar time depois de tração. Risco controlado.",
            },
          },
          bullets: [
            "Ferramentas: Lovable, Claude Code, Cursor, v0",
            "Arquitetura mínima viável que escala depois",
            "Quando o protótipo é suficiente para validar",
            "Como evitar perder semanas em polimento sem cliente",
          ],
          exercise: "Construa um MVP funcional do seu negócio durante o bloco.",
        },
        {
          number: "04",
          time: "11h30 às 12h30",
          title: "Narrativa fundadora",
          body: "Como contar a história do negócio com clareza, autoridade e relevância. Narrativa que sobrevive a investidor, cliente e talento sênior.",
          bullets: [
            "Estrutura narrativa: problema, insight, solução, vantagem, futuro",
            "Autoridade fundadora: por que você, por que agora",
            "Adequação por audiência: investidor, cliente, parceiro, talento",
            "Como evitar narrativa que muda toda semana",
          ],
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "Monetização, Crescimento e Plano de 90 Dias",
      blocks: [
        {
          number: "05",
          time: "14h00 às 15h00",
          title: "Caminho de monetização",
          body: "Como passar do MVP ao primeiro real recebido. Pricing, oferta comercial, canal e ciclo de venda inicial.",
          bullets: [
            "Modelos de pricing AI First: SaaS, uso, take rate, híbrido",
            "Primeira oferta comercial e teste de disposição a pagar",
            "Canais de aquisição inicial: outbound, parceria, comunidade",
            "Ciclo de venda B2B vs B2C com IA na operação comercial",
          ],
        },
        {
          number: "06",
          time: "15h00 às 16h00",
          title: "Pitch fundador de 5 minutos",
          body: "Construção, ensaio e feedback de pitch de 5 minutos. Estrutura, ritmo, antecipação de objeção e roteiro de demo.",
          bullets: [
            "Estrutura de pitch de 5 minutos comprovada",
            "As 10 perguntas duras que founders enfrentam",
            "Demo do MVP integrada ao pitch",
            "Como ler audiência e ajustar foco em tempo real",
          ],
          exercise:
            "Apresente seu pitch de 5 minutos para o grupo e receba feedback estruturado.",
        },
        {
          number: "07",
          time: "16h15 às 17h15",
          title: "Plano de crescimento e captação",
          body: "Quando captar, quando não captar e como construir crescimento de receita antes de equity. Caminhos de bootstrap, parceria e captação.",
          bullets: [
            "Sinais de quando captar e quando seguir bootstrap",
            "Alternativas a equity: receita, parceria, asset light",
            "Estrutura de crescimento dos primeiros 12 meses",
            "Métricas norte por estágio: pré-PMF, PMF, scale",
          ],
        },
        {
          number: "08",
          time: "17h15 às 18h00",
          title: "Plano de 90 dias do founder",
          body: "Encerramento aplicado. Cada participante sai com plano executivo dos próximos 3 meses.",
          bullets: [
            "Marcos das próximas 12 semanas com data",
            "Critérios objetivos para go/no-go em cada marco",
            "Quem chamar para validar, quem chamar para vender",
            "Como evitar a armadilha de polir sem cliente",
          ],
          exercise:
            "Defina seu plano de 90 dias e compartilhe para feedback do grupo.",
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Tese de negócio** estruturada em uma página",
    "**MVP funcional** construído com IA durante a imersão",
    "**Narrativa fundadora** consistente para investidor, cliente e talento",
    "**Pitch de 5 minutos** validado em sessão de feedback do grupo",
    "**Plano de 90 dias** com marcos, datas e critérios de decisão",
    "**Certificado** de conclusão",
    "**Acesso à comunidade** de founders AI First",
  ],

  audience: [
    "Founders e cofundadores em fase pré-MVP",
    "Founders em busca de PMF ou transição para growth",
    "Executivos em transição para empreender (carreira segunda metade)",
    "Times fundadores que precisam alinhar tese, MVP e narrativa",
    "Investidores anjo que precisam avaliar founders AI First com critério",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, templates de tese, MVP, pitch e plano de 90 dias.",

  prices: [
    {
      label: "REMOTO",
      price: "Sob consulta",
      note: "VIA VIDEOCONFERÊNCIA · ATÉ 25 PARTICIPANTES",
    },
    {
      label: "PRESENCIAL",
      price: "Sob consulta",
      note: "ESTRUTURA E DESLOCAMENTO SOB CONSULTA",
    },
  ],
  priceDisclaimer:
    "VALORES DEFINIDOS APÓS DIAGNÓSTICO DO CONTEXTO, PERFIL DOS PARTICIPANTES E FORMATO IDEAL",

  ctaTitle: "Construa sua empresa com mentalidade de",
  ctaHighlight: "founder",
  ctaBody:
    "Diagnóstico do estágio do negócio, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão Founder IA",
  metaDescription:
    "Imersão de 8 horas para founders AI First. Tese, MVP, narrativa e plano de crescimento construídos durante a imersão. Para fundadores em fase pré-MVP, PMF ou scale.",
};
