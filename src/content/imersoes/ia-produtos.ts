import type { Immersion } from "./types";

export const iaProdutos: Immersion = {
  slug: "ia-produtos",
  title: "Imersão IA para Produtos",
  subtitle:
    "Use IA para descobrir, prototipar, testar e evoluir produtos com mais velocidade.",
  highlightWord: "Produtos",
  logo: "",
  descriptor: "IA × PRODUTO × DISCOVERY E DELIVERY",

  whyTitle: "Discovery lento mata roadmap.",
  whyBody:
    "O ciclo tradicional de produto consome semanas em pesquisa, dias em prototipação e horas em validação. **IA aplicada ao trabalho de produto reduz cada uma dessas etapas para frações do tempo original**, mantendo qualidade da decisão e da entrega.\n\nEsta imersão de 8 horas é para PMs, líderes de produto e squads que querem dominar IA aplicada ao trabalho real: descoberta, prototipação, testes, evolução e métricas.",
  whyAccents: [
    "IA aplicada ao trabalho de produto reduz cada uma dessas etapas para frações do tempo original",
    "descoberta, prototipação, testes, evolução",
  ],

  results: [
    {
      label: "CICLO DE DISCOVERY",
      value: "4x",
      description:
        "mais rápido em pesquisa, síntese de entrevistas e mapeamento de jornada.",
    },
    {
      label: "PROTÓTIPOS FUNCIONAIS",
      value: "5+",
      description:
        "protótipos clicáveis construídos em horas, prontos para teste com usuário.",
    },
    {
      label: "DELIVERY ACELERADO",
      value: "2x",
      description:
        "mais entregas por sprint em squad assistida por IA, sem perda de qualidade.",
    },
  ],

  instructors: [
    {
      name: "Aurimar Nogueira",
      role: "INSTRUTOR",
      photo: "/photos/aurimar-editorial.jpg",
      bio: "Coordenador Sr. de Negócios Financeiros na LATAM Pass. Officer de Produtos na CERC, onde liderou CCB, CPR, CPR Verde, CDCA e Registro Digital. Product Owner na CRDC. Cria produto há mais de 10 anos com foco em mercados regulados e aplica IA em discovery, delivery e operação de squad.",
      credentials: ["LATAM PASS", "CERC", "CRDC", "PRODUTOS REGULADOS", "MÉTODO JET"],
    },
  ],

  program: {
    morning: {
      label: "MANHÃ",
      schedule: "08h30 às 12h30",
      subtitle: "Discovery e Pesquisa de Produto com IA",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h30",
          title: "Discovery em fração do tempo",
          body: "Como conduzir discovery com IA mantendo qualidade da decisão. Pesquisa de mercado, análise competitiva e mapeamento de oportunidade em horas.",
          bullets: [
            "Pesquisa de mercado com triangulação de fontes",
            "Análise competitiva acelerada: features, posicionamento, gaps",
            "Mapa de oportunidade visualizado em uma página",
            "Como validar premissas antes de levar para squad",
          ],
        },
        {
          number: "02",
          time: "09h30 às 10h30",
          title: "Entrevistas, transcrição e síntese assistida",
          body: "Do roteiro à insight. Como conduzir entrevistas com IA assistente e extrair padrões reais sem viés de confirmação.",
          comparison: {
            before: {
              head: "FLUXO TRADICIONAL",
              body: "Conduzir 8 entrevistas, transcrever 8 vezes, sintetizar manualmente. Uma semana de trabalho.",
            },
            now: {
              head: "FLUXO COM IA",
              body: "Conduzir, transcrever automático, sintetizar com padrões e citações. Um dia de trabalho.",
            },
          },
          bullets: [
            "Roteiro de entrevista de problema (não de solução)",
            "Transcrição automática com identificação de speakers",
            "Análise temática: padrões, dores e linguagem do usuário",
            "Como minimizar viés de confirmação no próprio discurso",
          ],
          exercise:
            "Analise 3 transcrições reais com IA e compare com sua síntese manual.",
        },
        {
          number: "03",
          time: "10h45 às 11h30",
          title: "Prototipação rápida com IA",
          body: "Da ideia ao protótipo clicável em uma manhã. Ferramentas, padrões e limites do que protótipo de IA resolve.",
          bullets: [
            "Ferramentas: Lovable, v0, Figma AI, Claude Artifacts",
            "Quando usar wireframe, quando ir direto ao protótipo clicável",
            "Padrões de interface que escalam para handoff com dev",
            "Limites: o que protótipo de IA não substitui",
          ],
          exercise:
            "Construa um protótipo funcional de uma feature do seu roadmap.",
        },
        {
          number: "04",
          time: "11h30 às 12h30",
          title: "Validação com usuário em ciclo curto",
          body: "Testes de usabilidade, A/B test conceitual e validação de proposta de valor antes do delivery completo.",
          bullets: [
            "Roteiro de teste de usabilidade com 5 usuários",
            "Análise de gravação assistida por IA",
            "Decisão objetiva: persiste, pivota ou descarta",
            "Critérios go/no-go para entrar em sprint de delivery",
          ],
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "Delivery, Métricas e Operação de Squad",
      blocks: [
        {
          number: "05",
          time: "14h00 às 15h00",
          title: "PRD e especificação técnica assistida",
          body: "Como escrever PRD que sobrevive ao sprint. Especificação técnica, critérios de aceite e casos de borda gerados em parceria com IA.",
          bullets: [
            "Estrutura de PRD mínima viável",
            "Critérios de aceite verificáveis",
            "Casos de borda que IA encontra antes do dev",
            "Como manter PRD vivo sem ele virar bíblia desatualizada",
          ],
          exercise:
            "Escreva o PRD de uma feature real do seu roadmap em 30 minutos.",
        },
        {
          number: "06",
          time: "15h00 às 16h00",
          title: "Delivery acelerado: PM, design e dev com IA",
          body: "Como squad inteira opera com IA. Padrões para PM, designer e dev trabalharem em paralelo sem perder coesão.",
          bullets: [
            "Rituais de squad assistidos por IA",
            "Revisão de PR e QA com IA",
            "Documentação viva: README, runbook, ADR",
            "Como evitar dependência cega e manter senioridade no time",
          ],
        },
        {
          number: "07",
          time: "16h15 às 17h15",
          title: "Métricas de produto e análise de comportamento",
          body: "Como analisar dados de produto com IA. Funil, retenção, ativação e métricas norte com leitura assistida.",
          quote:
            "Quem só olha gráfico vê tendência. Quem instrui IA vê causa.",
          bullets: [
            "Métricas norte e métricas de input por área",
            "Análise de coorte assistida",
            "Padrões de churn e gatilhos de retenção",
            "Como traduzir dado em decisão de roadmap",
          ],
        },
        {
          number: "08",
          time: "17h15 às 18h00",
          title: "Plano de evolução do produto",
          body: "Encerramento aplicado. Roadmap das próximas 12 semanas e estrutura de discovery contínuo.",
          bullets: [
            "Critérios para entrar e sair do roadmap",
            "Cadência de discovery contínuo na squad",
            "Métricas de impacto: o que medir, com que frequência",
            "Próximos passos por participante",
          ],
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Roteiro de discovery** assistido para uso recorrente",
    "**Pelo menos um protótipo clicável** construído na imersão",
    "**Template de PRD** mínimo viável validado em squad real",
    "**Biblioteca de prompts** para PM: discovery, PRD, análise, revisão",
    "**Plano de evolução** das próximas 12 semanas",
    "**Certificado** de conclusão",
    "**Acesso à comunidade** de PMs que aplicam IA em produto",
  ],

  audience: [
    "Product Managers em fase de scale ou stagnation",
    "Heads e líderes de produto que querem aplicar IA na squad",
    "Designers e engenheiros que operam próximos ao discovery",
    "Founders técnicos responsáveis pelo roadmap",
    "Líderes de inovação responsáveis por produtos digitais novos",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, templates de PRD, biblioteca de prompts e plano de evolução.",

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

  ctaTitle: "Acelere o ciclo do seu",
  ctaHighlight: "produto",
  ctaBody:
    "Diagnóstico do contexto da squad, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão IA para Produtos",
  metaDescription:
    "Imersão de 8 horas para PMs, líderes de produto e squads. Discovery, prototipação, validação e delivery acelerados com IA aplicada à rotina real.",
};
