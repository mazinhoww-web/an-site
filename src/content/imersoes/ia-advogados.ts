import type { Immersion } from "./types";

export const iaAdvogados: Immersion = {
  slug: "ia-advogados",
  title: "Imersão IA para Advogados",
  subtitle:
    "Como aplicar IA para ganhar velocidade, qualidade e escala na rotina jurídica.",
  highlightWord: "Advogados",
  logo: "",
  descriptor: "IA × JURÍDICO × PRODUTIVIDADE",

  whyTitle: "Escritório que não opera com IA opera com custo errado.",
  whyBody:
    "Pesquisa demorada, leitura linear de processos, revisão repetitiva de contratos e atendimento manual sustentam o modelo jurídico tradicional. **IA aplicada com método reduz cada uma dessas etapas em ordens de magnitude**, sem comprometer rigor técnico nem responsabilidade ética.\n\nEsta imersão de 8 horas é desenhada para advogados, sócios, gestores jurídicos e times in-house que precisam dominar IA sem abrir mão da seriedade da profissão.",
  whyAccents: [
    "IA aplicada com método reduz cada uma dessas etapas em ordens de magnitude",
    "sem comprometer rigor técnico nem responsabilidade ética",
  ],

  results: [
    {
      label: "PESQUISA JURÍDICA",
      value: "5x",
      description:
        "mais rápida em jurisprudência, doutrina e análise comparada de teses.",
    },
    {
      label: "REVISÃO DE CONTRATOS",
      value: "60%",
      description:
        "menos tempo em triagem inicial, identificação de cláusulas críticas e marcação de pontos de atenção.",
    },
    {
      label: "PEÇAS PROCESSUAIS",
      value: "3x",
      description:
        "mais peças produzidas no mesmo período, com revisão final humana mantida.",
    },
  ],

  instructors: [
    {
      name: "Aurimar Nogueira",
      role: "INSTRUTOR",
      photo: "/photos/aurimar-editorial.jpg",
      bio: "Coordenador Sr. de Negócios Financeiros na LATAM Pass. Construiu produtos em ambientes regulados pelo BCB na CERC e CRDC, com interface diária a contratos, pareceres jurídicos e estruturação documental. Especialista em IA aplicada a operação em setores regulados.",
      credentials: ["LATAM PASS", "CERC", "CRDC", "CONTRATOS BCB", "MÉTODO JET"],
    },
  ],

  program: {
    morning: {
      label: "MANHÃ",
      schedule: "08h30 às 12h30",
      subtitle: "Pesquisa, Análise e Produção Jurídica com IA",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h30",
          title: "O que IA resolve (e o que não resolve) no Direito",
          body: "Diagnóstico honesto: onde IA gera vantagem real para o operador do Direito e onde ela ainda é insuficiente ou perigosa. Casos de uso validados e armadilhas frequentes.",
          bullets: [
            "Os 5 modos de uso de IA na rotina jurídica",
            "Limites técnicos: alucinação de jurisprudência, datas e citações",
            "Responsabilidade ética e profissional do advogado que usa IA",
            "Marco regulatório: OAB, LGPD e segredo profissional",
          ],
        },
        {
          number: "02",
          time: "09h30 às 10h30",
          title: "Pesquisa jurídica acelerada",
          body: "Como conduzir pesquisa de jurisprudência, doutrina e análise comparada de teses com qualidade superior à pesquisa manual, em fração do tempo.",
          bullets: [
            "Pesquisa de tema com triangulação de fontes",
            "Identificação de divergências entre tribunais",
            "Síntese de doutrina com referências verificáveis",
            "Validação obrigatória: nunca confiar em citação sem checar fonte",
          ],
          exercise:
            "Conduza uma pesquisa completa sobre um tema da sua área e compare com pesquisa manual.",
        },
        {
          number: "03",
          time: "10h45 às 11h30",
          title: "Análise de contratos e documentos extensos",
          body: "Triagem inteligente de contratos, identificação de cláusulas críticas e marcação de pontos de atenção em documentos longos.",
          quote:
            "O advogado que usa IA não substitui leitura crítica. Substitui leitura passiva.",
          bullets: [
            "Upload e leitura assistida de contratos, pareceres e processos",
            "Templates de revisão por tipo de contrato (SaaS, M&A, trabalhista)",
            "Identificação automática de cláusulas leoninas ou ambíguas",
            "Comparação entre duas versões de um mesmo contrato",
          ],
          exercise:
            "Faça a triagem assistida de um contrato real do seu escritório.",
        },
        {
          number: "04",
          time: "11h30 às 12h30",
          title: "Produção de peças e pareceres",
          body: "Como produzir minutas de peças processuais, pareceres e e-mails técnicos com IA mantendo voz autoral e rigor técnico.",
          bullets: [
            "Skills jurídicas por tipo de peça: petição inicial, contestação, recurso",
            "Como manter voz autoral mesmo com produção assistida",
            "Revisão crítica obrigatória: o que checar antes de assinar",
            "Banco de modelos: estruturar a base interna do escritório",
          ],
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "Atendimento, Operação e Governança Jurídica",
      blocks: [
        {
          number: "05",
          time: "14h00 às 15h00",
          title: "Atendimento ao cliente assistido por IA",
          body: "Triagem inicial de demandas, respostas técnicas qualificadas e produção de minuta de parecer para o cliente.",
          bullets: [
            "Fluxo de atendimento: triagem, qualificação e resposta",
            "Templates de resposta por área (cível, trabalhista, tributário)",
            "Quando responder direto e quando escalar para sênior",
            "Limite ético: o que nunca delegar para IA",
          ],
        },
        {
          number: "06",
          time: "15h00 às 16h00",
          title: "Operação interna do escritório",
          body: "Como IA opera nos bastidores: gestão de prazos, organização de fluxo de processos, follow-up com clientes e produção de relatórios para o jurídico interno.",
          bullets: [
            "Gestão de prazo assistida e alertas inteligentes",
            "Relatórios mensais para clientes corporativos com IA",
            "Análise de carteira: produtividade, ganho/perda, ROI por caso",
            "Skills internas para a operação do escritório",
          ],
        },
        {
          number: "07",
          time: "16h15 às 17h15",
          title: "Segredo profissional, LGPD e governança",
          body: "Privacidade, retenção e segredo profissional ao usar IA em rotina jurídica. Como construir política interna e proteger informações do cliente.",
          bullets: [
            "O que cada fornecedor retém: Claude, ChatGPT, Gemini",
            "Planos com retenção zero e quando exigir",
            "Adequação à LGPD em escritórios e departamentos jurídicos",
            "Política interna mínima viável de uso de IA",
            "Treinamento da equipe e prevenção de vazamentos",
          ],
        },
        {
          number: "08",
          time: "17h15 às 18h00",
          title: "Plano de adoção no escritório",
          body: "Encerramento com plano executivo de adoção: priorização de casos de uso, definição de multiplicador interno e métricas de impacto.",
          bullets: [
            "Matriz impacto vs esforço para os primeiros 3 casos de uso",
            "Definição do multiplicador interno e treinamento da equipe",
            "Métricas: produtividade, qualidade percebida, satisfação do cliente",
            "Cronograma de adoção de 90 dias",
          ],
          exercise: "Defina seu plano e compartilhe com o grupo para feedback.",
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Biblioteca de prompts jurídicos** validada em rotina real",
    "**Templates de revisão de contratos** por tipo (SaaS, M&A, trabalhista)",
    "**Skills jurídicas** estruturadas para peças, pareceres e atendimento",
    "**Política interna de uso de IA** com cobertura de LGPD e segredo profissional",
    "**Plano de adoção de 90 dias** com matriz de priorização",
    "**Certificado** de conclusão",
    "**Acesso à comunidade** de operadores do Direito que aplicam IA",
  ],

  audience: [
    "Sócios e gestores de escritórios de advocacia",
    "Advogados in-house em departamentos jurídicos corporativos",
    "Heads de Compliance e responsáveis por contratos",
    "Advogados independentes que querem escalar sem contratar time",
    "Operadores do Direito em transição para áreas tech e regulatórias",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, biblioteca de prompts jurídicos, templates de revisão e plano de adoção.",

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

  ctaTitle: "Coloque IA no centro da rotina",
  ctaHighlight: "jurídica",
  ctaBody:
    "Diagnóstico do contexto do escritório, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão IA para Advogados",
  metaDescription:
    "Imersão de 8 horas para advogados, sócios e times jurídicos in-house. Pesquisa, análise, produção de peças e atendimento assistido por IA com rigor técnico e ético.",
};
