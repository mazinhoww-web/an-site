import type { Immersion } from "./types";

export const aiBusinessBuilder: Immersion = {
  slug: "ai-business-builder",
  title: "Imersão AI Business Builder",
  subtitle:
    "Como criar negócios AI First com velocidade, clareza e execução assistida por IA.",
  highlightWord: "Business",
  logo: "",
  descriptor: "IA × NEGÓCIOS × CRIAÇÃO DE PRODUTOS",

  whyTitle: "Negócio novo não nasce em deck. Nasce em MVP.",
  whyBody:
    "Construir empresa hoje sem IA é abrir mão de velocidade e capital. Quem opera AI First **encurta o ciclo de discovery, valida tese em horas e protótipa antes de contratar time**.\n\nEsta imersão de 8 horas leva você do problema à tese, da tese ao MVP e do MVP ao primeiro caminho de monetização. Sem teoria, sem framework genérico, com saída executável.",
  whyAccents: [
    "encurta o ciclo de discovery, valida tese em horas e protótipa antes de contratar time",
    "saída executável",
  ],

  results: [
    {
      label: "TESE DE NEGÓCIO",
      value: "1",
      description:
        "tese estruturada com proposta de valor, segmento, modelo de monetização e diferencial competitivo.",
    },
    {
      label: "MVP NA MÃO",
      value: "1",
      description:
        "protótipo funcional construído com IA, pronto para validação com clientes reais.",
    },
    {
      label: "TEMPO ATÉ VALIDAÇÃO",
      value: "10x",
      description:
        "mais rápido do que o ciclo tradicional de discovery, business case e prototipação.",
    },
  ],

  instructors: [
    {
      name: "Aurimar Nogueira",
      role: "INSTRUTOR",
      photo: "/photos/aurimar-editorial.jpg",
      bio: "Coordenador Sr. de Negócios Financeiros na LATAM Pass. Liderou o registro da primeira CPR Verde do Brasil na CERC, atingindo 60% de market share contra a B3. Construiu produtos regulados em CRDC e Stone. Criador dos frameworks Método Jet, GSD2 e Innovation2Business aplicados em squads corporativas.",
      credentials: ["LATAM PASS", "CERC", "CRDC", "STONE", "INNOVATION2BUSINESS"],
    },
  ],

  program: {
    morning: {
      label: "MANHÃ",
      schedule: "08h30 às 12h30",
      subtitle: "Da Oportunidade à Tese de Negócio",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h30",
          title: "Mapeamento de oportunidade com IA",
          body: "Como usar IA para mapear mercados, identificar dores não atendidas e separar tendência de oportunidade concreta em menos de uma manhã.",
          bullets: [
            "Pesquisa de mercado assistida: do macro ao segmento",
            "Análise competitiva acelerada: o que os incumbentes ignoram",
            "Sinais fracos vs ruído: critérios objetivos de filtragem",
            "Mapa de oportunidade visualizado em uma página",
          ],
        },
        {
          number: "02",
          time: "09h30 às 10h30",
          title: "Tese de negócio em uma página",
          body: "Estrutura compacta de tese: proposta de valor, segmento, alternativa atual, ponto de inflexão e diferencial defensável.",
          quote:
            "Tese boa cabe em uma página. Tese ruim precisa de deck para se sustentar.",
          bullets: [
            "Os 5 elementos não negociáveis de uma tese",
            "Como validar premissas com IA antes de gastar capital",
            "Sinais de tese fraca: proposta genérica, mercado vago, diferencial frágil",
            "Iteração rápida: 3 versões da tese em 1 hora",
          ],
        },
        {
          number: "03",
          time: "10h45 às 11h30",
          title: "Modelo de negócio e unit economics",
          body: "Definir como o negócio gera, captura e sustenta valor. P&L mínimo, CAC, LTV e ponto de viabilidade.",
          bullets: [
            "Modelos de monetização: SaaS, marketplace, take rate, asset light",
            "Construção de P&L mínimo viável com IA assistente",
            "Cálculo de CAC, LTV e payback em modelo simples",
            "Sensibilidade: quais variáveis matam o negócio",
          ],
          exercise:
            "Monte o P&L de 12 meses da sua tese com simulação assistida por IA.",
        },
        {
          number: "04",
          time: "11h30 às 12h30",
          title: "Validação de tese com clientes reais",
          body: "Como validar a tese com entrevistas estruturadas, sem viés de confirmação. Roteiro, perguntas e interpretação assistida.",
          bullets: [
            "Roteiro de entrevista de problema (não de solução)",
            "Como identificar viés de confirmação no próprio discurso",
            "Análise de transcrição com IA: padrões, dores e linguagem do cliente",
            "Decisão de pivot, persist ou perish após 5 conversas",
          ],
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "MVP, Monetização e Caminho de Crescimento",
      blocks: [
        {
          number: "05",
          time: "14h00 às 15h30",
          title: "Construindo o MVP com IA",
          body: "Da tese ao protótipo funcional. Como usar ferramentas de IA generativa para construir o MVP sem dependência de time técnico.",
          comparison: {
            before: {
              head: "FLUXO TRADICIONAL",
              body: "Contratar dev, esperar 8 semanas, gastar capital antes de validar. Risco alto, ciclo lento.",
            },
            now: {
              head: "FLUXO COM IA",
              body: "Construir protótipo em horas, validar em dias, contratar time só com sinal de tração.",
            },
          },
          bullets: [
            "Ferramentas: Lovable, Claude Code, Cursor, v0",
            "Arquitetura mínima viável: front, dados e fluxo principal",
            "Quando o protótipo é suficiente para validar",
            "Limites do no-code/low-code e quando contratar dev",
          ],
        },
        {
          number: "06",
          time: "15h30 às 16h30",
          title: "Caminho de monetização",
          body: "Como passar do MVP para o primeiro real recebido. Pricing, oferta, canal e ciclo de venda inicial.",
          bullets: [
            "Pricing: 3 modelos de cobrança e quando usar cada um",
            "Construção da primeira oferta comercial",
            "Canais de aquisição inicial: outbound, conteúdo, parceria, comunidade",
            "Ciclo de venda B2B vs B2C e adaptações iniciais",
          ],
        },
        {
          number: "07",
          time: "16h30 às 17h30",
          title: "Narrativa, pitch e captação inicial",
          body: "Como contar a história do negócio para clientes, parceiros e investidores. Narrativa que sobrevive a perguntas duras.",
          bullets: [
            "Estrutura de pitch de 5 minutos",
            "As 10 perguntas que matam pitches ruins",
            "Quando captar e quando não captar",
            "Alternativas a equity: bootstrap, receita, parceria estratégica",
          ],
          exercise:
            "Apresente seu pitch em 5 minutos para o grupo e receba feedback estruturado.",
        },
        {
          number: "08",
          time: "17h30 às 18h00",
          title: "Plano dos próximos 60 dias",
          body: "Encerramento com roteiro de execução: o que fazer nos próximos 2 meses para sair do papel e gerar primeiros sinais reais.",
          bullets: [
            "Marcos das próximas 8 semanas com data e responsável",
            "Critérios objetivos para go/no-go em cada marco",
            "Quem chamar para validar, quem chamar para vender",
            "Como evitar a armadilha de polir produto sem cliente",
          ],
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Tese de negócio** estruturada em uma página com proposta, segmento e diferencial",
    "**MVP funcional** construído com IA durante a imersão",
    "**P&L de 12 meses** com sensibilidade das principais variáveis",
    "**Roteiro de validação** com 5 entrevistas para as próximas duas semanas",
    "**Pitch de 5 minutos** validado em sessão de feedback do grupo",
    "**Plano de 60 dias** com marcos, datas e critérios de decisão",
    "**Certificado** de conclusão e acesso à comunidade",
  ],

  audience: [
    "Fundadores e cofundadores em fase de tese ou pré-MVP",
    "Executivos corporativos que querem construir negócio paralelo ou spin-off",
    "Intraempreendedores responsáveis por unidade nova dentro da empresa",
    "Investidores que precisam avaliar teses AI First com critério",
    "Profissionais sênior em transição para empreendedorismo",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, templates de tese, P&L e pitch, mais acesso a recursos complementares.",

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

  ctaTitle: "Construa seu próximo negócio com",
  ctaHighlight: "velocidade",
  ctaBody:
    "Diagnóstico do contexto, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão AI Business Builder",
  metaDescription:
    "Imersão de 8 horas para construir negócios AI First. Da tese ao MVP, da monetização ao plano de crescimento. Para fundadores, executivos e intraempreendedores.",
};
