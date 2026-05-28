import type { Immersion } from "./types";

export const iaNaPratica: Immersion = {
  slug: "ia-na-pratica",
  title: "Imersão IA na Prática",
  subtitle:
    "Seu time usando IA para produzir mais, decidir melhor e executar mais rápido.",
  highlightWord: "Prática",
  logo: "",
  descriptor: "IA × PRODUTIVIDADE × EXECUÇÃO",

  whyTitle: "IA já foi testada. Falta virar rotina.",
  whyBody:
    "A maior parte dos times testou ChatGPT, Claude ou Copilot, mas voltou ao mesmo ritmo. O problema não está na ferramenta. Está na **falta de método para incorporar IA no fluxo diário** sem perder qualidade, sem retrabalho e sem virar dependência cega.\n\nEsta imersão de 8 horas converte experimentação em prática consolidada. Cada participante sai com um conjunto de prompts profissionais, templates por área e um plano de adoção real para os próximos 30 dias.",
  whyAccents: [
    "falta de método para incorporar IA no fluxo diário",
    "rotina real",
  ],

  results: [
    {
      label: "VELOCIDADE EM ENTREGAS",
      value: "3x",
      description:
        "mais rápido em produção de relatórios, propostas e conteúdo operacional, mantendo qualidade percebida.",
    },
    {
      label: "REDUÇÃO DE RETRABALHO",
      value: "70%",
      description:
        "menos retrabalho em revisão de texto, análise de dados e triagem de informações.",
    },
    {
      label: "ADOÇÃO POR ÁREA",
      value: "6+",
      description:
        "áreas com rotina de IA implantada após a imersão: marketing, RH, jurídico, financeiro, comercial e operações.",
    },
  ],

  instructors: [
    {
      name: "Aurimar Nogueira",
      role: "INSTRUTOR",
      photo: "/photos/aurimar-editorial.jpg",
      bio: "Coordenador Sr. de Negócios Financeiros na LATAM Pass com passagens por CERC, CRDC e Stone. Aplica IA em rotinas executivas, construção de produto e operação de squads há mais de dois anos. Criador dos frameworks Método Jet, GSD2 e Innovation2Business.",
      credentials: ["LATAM PASS", "CERC", "STONE", "MÉTODO JET", "GSD2"],
    },
  ],

  program: {
    morning: {
      label: "MANHÃ",
      schedule: "08h30 às 12h30",
      subtitle: "Fundamentos para Produtividade Real com IA",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h30",
          title: "Por que IA não virou rotina no seu time ainda",
          body: "Diagnóstico honesto: o que separa quem usa IA esporadicamente de quem extrai produtividade contínua. Padrões de uso de times de alta performance e os erros que travam a adoção.",
          bullets: [
            "Os 4 estágios de maturidade de uso de IA nas empresas",
            "O que os early adopters fazem diferente no fluxo diário",
            "Erros que matam a adoção: dependência cega, prompts ruins, falta de validação",
            "Mentalidade correta: IA como parceiro de trabalho, não como atalho",
          ],
        },
        {
          number: "02",
          time: "09h30 às 10h30",
          title: "Os 4 modos de trabalho com IA",
          body: "Mapeamento dos quatro modos práticos de uso: assistente de produção, parceiro de análise, executor de tarefas repetitivas e revisor crítico. Quando usar cada um.",
          comparison: {
            before: {
              head: "FLUXO TRADICIONAL",
              body: "Profissional pesquisa, redige, revisa, formata, envia. Horas em atividade operacional, pouca energia para julgamento.",
            },
            now: {
              head: "FLUXO COM IA",
              body: "Profissional instrui, valida, refina, entrega. Foco total em decisão, contexto e qualidade final.",
            },
          },
          bullets: [
            "Modo 1: Produção (texto, código, design assistido)",
            "Modo 2: Análise (síntese de documentos, leitura de dados)",
            "Modo 3: Execução (automações simples, fluxos repetitivos)",
            "Modo 4: Revisão (auditoria crítica de entregas)",
          ],
        },
        {
          number: "03",
          time: "10h45 às 11h30",
          title: "Construindo prompts profissionais",
          body: "O componente mais subestimado da operação com IA. Como instruir modelos com clareza, contexto e restrições para minimizar imprecisão e maximizar consistência.",
          quote:
            "Saber instruir IA é a competência profissional mais subestimada da década.",
          bullets: [
            "Estrutura de prompt de alta performance: Contexto, Tarefa, Formato, Restrições",
            "System prompts que transformam o modelo em especialista do seu domínio",
            "Técnicas avançadas: raciocínio em cadeia, atribuição de papel, exemplos de referência",
            "Como evitar respostas imprecisas e medir consistência",
          ],
          exercise:
            "Construa e teste um prompt aplicado a uma tarefa real do seu dia.",
        },
        {
          number: "04",
          time: "11h30 às 12h30",
          title: "Templates por área que funcionam hoje",
          body: "Biblioteca prática de prompts por função, validada em operação real. Marketing, RH, Jurídico, Financeiro, Comercial e Tech.",
          bullets: [
            "Marketing: briefing, copy, segmentação, análise de campanha",
            "RH: descrição de vagas, triagem de currículos, feedback estruturado",
            "Jurídico: revisão de contratos, sumarização de processos, due diligence",
            "Financeiro: leitura de balanço, modelagem rápida, business case",
            "Comercial: roteiro de discovery, preparação de reunião, follow-up",
            "Tech: revisão de PR, geração de documentação, análise de log",
          ],
          exercise:
            "Selecione 3 templates da sua área e adapte ao contexto da sua empresa.",
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "Automação, Governança e Plano de Adoção",
      blocks: [
        {
          number: "05",
          time: "14h00 às 15h00",
          title: "Skills e bibliotecas reutilizáveis",
          body: "Como transformar conhecimento corporativo em ativo reutilizável. Skills, projetos persistentes e bibliotecas de prompts que escalam para o time todo.",
          bullets: [
            "O que são Skills e como operam na prática corporativa",
            "Estrutura de uma Skill por função: contexto, tom de voz, restrições",
            "Versionamento e manutenção: quem cria, quem valida, quem atualiza",
            "Como organizar projetos por área, cliente e objetivo",
          ],
          exercise: "Monte uma Skill funcional para uma rotina crítica do seu time.",
        },
        {
          number: "06",
          time: "15h00 às 16h00",
          title: "Conectando IA aos sistemas que o time já usa",
          body: "Integração prática com Gmail, Google Drive, Notion, Slack, CRMs e ERPs. Como deixar o modelo operar nos sistemas reais, não em janela isolada.",
          bullets: [
            "Conexões nativas disponíveis hoje em Claude, ChatGPT e Gemini",
            "Model Context Protocol (MCP) e o que permite acessar ao vivo",
            "Exemplos de automação por departamento que funcionam agora",
            "Identificando os 3 fluxos da sua empresa com maior retorno",
          ],
        },
        {
          number: "07",
          time: "16h15 às 17h15",
          title: "Política de uso e governança",
          body: "Adoção corporativa responsável: privacidade, retenção de dados, segurança e LGPD. Construção da política interna de uso de IA.",
          bullets: [
            "O que cada fornecedor retém e o que não retém",
            "Diferenças de privacidade por plano: Pro, Team, Enterprise",
            "Adequação à LGPD e retenção zero para ambientes sensíveis",
            "Controle de acesso por equipe, área e nível de sensibilidade",
            "Riscos frequentes: dependência, validação negligenciada, prompt injection",
          ],
        },
        {
          number: "08",
          time: "17h15 às 18h00",
          title: "Plano de 30 dias de adoção",
          body: "Encerramento aplicado. Cada participante sai com matriz de priorização e roteiro concreto para as próximas 4 semanas.",
          bullets: [
            "Matriz impacto vs esforço para escolher os 3 primeiros casos de uso",
            "Definição do multiplicador interno: quem lidera a adoção",
            "Métricas para medir produtividade ganha mês a mês",
            "Cronograma de implantação por área",
          ],
          exercise:
            "Escreva seu plano de 30 dias e compartilhe com o grupo para feedback.",
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Biblioteca de prompts profissionais** validada na imersão e pronta para uso",
    "**Templates por área** adaptados ao contexto da sua empresa",
    "**Pelo menos uma Skill corporativa** funcional para uma rotina crítica",
    "**Política de uso de IA** com base em modelo testado em outras empresas",
    "**Plano de 30 dias de adoção** personalizado por participante",
    "**Certificado** de conclusão",
    "**Acesso à comunidade** de profissionais que aplicam IA em contexto corporativo",
  ],

  audience: [
    "Gerentes operacionais que precisam destravar produtividade do time",
    "Heads de área que querem reduzir retrabalho em atividades recorrentes",
    "Líderes de transformação digital responsáveis por adoção de IA",
    "Profissionais sênior que querem subir o teto da própria entrega",
    "Times de operação com alto volume de atividades repetitivas de valor",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, biblioteca de prompts, templates por área e plano de adoção personalizado.",

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

  ctaTitle: "Transforme IA em rotina real do seu",
  ctaHighlight: "time",
  ctaBody:
    "Diagnóstico do contexto, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão IA na Prática",
  metaDescription:
    "Imersão corporativa de 8 horas para transformar IA em rotina real de trabalho. Produtividade, automação e plano de adoção para times executivos e operacionais.",
};
