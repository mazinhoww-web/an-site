import type { Immersion } from "./types";

export const iaExecutivos: Immersion = {
  slug: "ia-executivos",
  title: "Imersão IA para Executivos",
  subtitle:
    "Como usar IA para pensar melhor, decidir mais rápido e liderar com vantagem.",
  highlightWord: "Executivos",
  logo: "",
  descriptor: "IA × LIDERANÇA × DECISÃO",

  whyTitle: "Executivo que não opera com IA decide com vantagem menor.",
  whyBody:
    "Reuniões longas, materiais incompletos, decisões com base em síntese de outros, comunicação que demora a sair. O dia do executivo é construído nessas fricções. **IA aplicada à rotina executiva ataca cada uma delas sem terceirizar julgamento**.\n\nEsta imersão de 8 horas é para C-level, sócios e líderes de unidade que querem elevar a capacidade de pensar com clareza, decidir com velocidade e liderar com vantagem informacional.",
  whyAccents: [
    "IA aplicada à rotina executiva ataca cada uma delas sem terceirizar julgamento",
    "clareza, velocidade e vantagem informacional",
  ],

  results: [
    {
      label: "DECISÕES MAIS RÁPIDAS",
      value: "3x",
      description:
        "ciclo de análise, síntese e decisão em problemas executivos típicos.",
    },
    {
      label: "PREPARAÇÃO DE REUNIÃO",
      value: "80%",
      description:
        "redução de tempo na preparação de comitês, board e reuniões de alta densidade.",
    },
    {
      label: "COMUNICAÇÃO EXECUTIVA",
      value: "2x",
      description:
        "mais e-mails, memos e comunicações de stakeholder produzidos com qualidade superior.",
    },
  ],

  instructors: [
    {
      name: "Aurimar Nogueira",
      role: "INSTRUTOR",
      photo: "/photos/aurimar-editorial.jpg",
      bio: "Coordenador Sr. de Negócios Financeiros na LATAM Pass com 10+ anos em mercados regulados, atendendo a board, comitês e diretorias. Construiu produtos em CERC, CRDC e Stone. Especialista em IA aplicada à rotina executiva: preparação de board, análise estratégica e comunicação com stakeholders.",
      credentials: ["LATAM PASS", "CERC", "CRDC", "STONE", "MÉTODO JET"],
    },
  ],

  program: {
    morning: {
      label: "MANHÃ",
      schedule: "08h30 às 12h30",
      subtitle: "Pensamento e Decisão Assistidos por IA",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h30",
          title: "IA como amplificador de julgamento",
          body: "O que muda quando IA entra no fluxo de decisão executiva. Como amplificar julgamento sem terceirizar responsabilidade.",
          bullets: [
            "Os 4 modos de uso executivo de IA: pensar, decidir, comunicar, liderar",
            "O que IA acelera, o que IA não substitui no executivo sênior",
            "Mentalidade: amplificador de julgamento, não substituto",
            "Risco da delegação cega e como evitar",
          ],
        },
        {
          number: "02",
          time: "09h30 às 10h30",
          title: "Análise estratégica com IA",
          body: "Como conduzir análise estratégica em horas: mercado, competição, cenários, riscos. Frameworks executivos com IA assistente.",
          comparison: {
            before: {
              head: "ANÁLISE TRADICIONAL",
              body: "Solicitar relatório, esperar 2 semanas, revisar deck pronto. Decisão chega tarde, com vento contrário.",
            },
            now: {
              head: "ANÁLISE COM IA",
              body: "Conduzir análise direto, com triangulação de fontes, em uma sessão de 90 minutos. Decisão na hora certa.",
            },
          },
          bullets: [
            "Análise SWOT, Porter e cenários em uma sessão",
            "Triangulação de fontes para validar premissas",
            "Identificação de viés no próprio raciocínio",
            "Síntese executiva em uma página",
          ],
          exercise: "Conduza análise estratégica de um tema real seu em 30 minutos.",
        },
        {
          number: "03",
          time: "10h45 às 11h30",
          title: "Preparação de board e comitê executivo",
          body: "Como preparar reuniões de alta densidade com qualidade superior em fração do tempo. Materiais, perguntas antecipadas e ensaio de objeções.",
          quote:
            "Executivo bem preparado responde rápido. Executivo muito bem preparado prevê a pergunta.",
          bullets: [
            "Estrutura de pré-leitura executiva: 1, 3, 10 páginas",
            "Antecipação de objeções com IA assistente",
            "Cenários de pergunta difícil e ensaio de resposta",
            "Síntese pós-reunião e follow-up automático",
          ],
          exercise: "Prepare uma reunião real sua com IA assistente.",
        },
        {
          number: "04",
          time: "11h30 às 12h30",
          title: "Leitura assistida e síntese rápida",
          body: "Como ler 3x mais material com qualidade de retenção superior. Documentos longos, contratos, regulamentação, pesquisa de mercado.",
          bullets: [
            "Sumarização com perguntas dirigidas",
            "Comparação entre documentos",
            "Identificação de risco e oportunidade em texto longo",
            "Como manter leitura crítica sem virar passivo",
          ],
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "Comunicação, Liderança e Plano Executivo",
      blocks: [
        {
          number: "05",
          time: "14h00 às 15h00",
          title: "Comunicação executiva com IA",
          body: "E-mail, memo, mensagem de board, comunicação de mudança, briefing de stakeholder. Produção de comunicação executiva consistente em volume e qualidade.",
          bullets: [
            "Voz executiva: como manter autenticidade com IA assistente",
            "Templates por tipo: anúncio, briefing, decisão, alinhamento",
            "Adequação por audiência: board, time, parceiro, regulador",
            "Revisão final: o que sempre validar antes de enviar",
          ],
          exercise:
            "Escreva 3 comunicações executivas reais com IA assistente.",
        },
        {
          number: "06",
          time: "15h00 às 16h00",
          title: "Liderança e gestão de time com IA",
          body: "Como usar IA na rotina de gestão: feedback, planejamento de carreira, preparação de 1:1, condução de difícil conversa.",
          bullets: [
            "Preparação de 1:1 com IA assistente",
            "Estruturação de feedback formal e informal",
            "Difícil conversa: roteiro e ensaio",
            "Skills de liderança como ativo do time, não só do líder",
          ],
        },
        {
          number: "07",
          time: "16h15 às 17h15",
          title: "IA como vantagem competitiva executiva",
          body: "Como construir vantagem informacional sustentável. O que diferencia executivos que usam IA como vantagem real.",
          bullets: [
            "Skills executivas personalizadas: contexto do negócio, do setor, da empresa",
            "Sinais de mercado e leitura de movimentação competitiva",
            "Construção de hipótese e teste rápido",
            "Como evitar virar dependente e perder afiação própria",
          ],
        },
        {
          number: "08",
          time: "17h15 às 18h00",
          title: "Plano executivo de adoção",
          body: "Encerramento com roteiro pessoal de adoção. Como integrar IA ao próprio fluxo executivo nas próximas semanas.",
          bullets: [
            "Skills pessoais executivas para construir nos próximos 30 dias",
            "Rotina diária: o que delegar para IA, o que reservar para julgamento",
            "Time direto: como espelhar adoção para auxiliares",
            "Métricas pessoais: o que medir para validar ganho",
          ],
          exercise:
            "Defina seu plano pessoal e compartilhe com o grupo para feedback.",
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Skills executivas pessoais** estruturadas para contexto, setor e empresa",
    "**Templates de comunicação** por tipo (board, time, parceiro, regulador)",
    "**Rotina de preparação** de reunião e síntese pós-evento",
    "**Plano pessoal de adoção** das próximas 30 dias",
    "**Modelo de governança** para IA executiva e privacidade de informação sensível",
    "**Certificado** de conclusão",
    "**Acesso à comunidade** de executivos que aplicam IA com método",
  ],

  audience: [
    "C-level e diretores executivos",
    "Sócios e fundadores em fase de scale",
    "Líderes de unidade de negócio com responsabilidade de P&L",
    "Executivos em transição para conselhos e board",
    "Heads de área não técnica que querem dominar IA aplicada",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, biblioteca de Skills executivas, templates de comunicação e plano pessoal de adoção.",

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

  ctaTitle: "Lidere com a vantagem que IA oferece ao",
  ctaHighlight: "executivo",
  ctaBody:
    "Diagnóstico do contexto executivo, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão IA para Executivos",
  metaDescription:
    "Imersão de 8 horas para C-level, sócios e líderes de unidade. IA aplicada a pensamento estratégico, decisão executiva, comunicação e gestão de time.",
};
