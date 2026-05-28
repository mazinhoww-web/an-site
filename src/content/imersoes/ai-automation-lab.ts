import type { Immersion } from "./types";

export const aiAutomationLab: Immersion = {
  slug: "ai-automation-lab",
  title: "Imersão AI Automation Lab",
  subtitle:
    "Como automatizar processos e criar eficiência operacional com IA.",
  highlightWord: "Automation",
  logo: "",
  descriptor: "IA × AUTOMAÇÃO × OPERAÇÃO",

  whyTitle: "Automação não é mais projeto de TI. É operação.",
  whyBody:
    "Tarefas repetitivas continuam consumindo a maior parte do tempo dos times executivos: relatórios, triagem de e-mail, follow-up, classificação de pedidos, atendimento de primeira camada. **IA aplicada à automação resolve hoje o que ERP, BPM e RPA prometeram por décadas**, com custo de implantação muito menor e governança superior.\n\nEsta imersão de 8 horas leva você do mapeamento de processo à construção de automações reais que entram em produção na semana seguinte.",
  whyAccents: [
    "IA aplicada à automação resolve hoje o que ERP, BPM e RPA prometeram por décadas",
    "entram em produção na semana seguinte",
  ],

  results: [
    {
      label: "AUTOMAÇÕES IMPLANTADAS",
      value: "5+",
      description:
        "automações reais construídas na imersão, prontas para produção em uma semana.",
    },
    {
      label: "TEMPO OPERACIONAL",
      value: "60%",
      description:
        "redução de tempo em atividades repetitivas mapeadas no diagnóstico inicial.",
    },
    {
      label: "ROI EM 90 DIAS",
      value: "10x",
      description:
        "retorno típico do investimento em automação validada no primeiro trimestre.",
    },
  ],

  instructors: [
    {
      name: "Aurimar Nogueira",
      role: "INSTRUTOR",
      photo: "/photos/aurimar-editorial.jpg",
      bio: "Coordenador Sr. de Negócios Financeiros na LATAM Pass. Estruturou operações complexas em mercados regulados na CERC e CRDC, com foco em automação de fluxos críticos. Aplica IA em automação de produto, atendimento, financeiro e operação. Criador do framework GSD2 para execução de squad.",
      credentials: ["LATAM PASS", "CERC", "CRDC", "GSD2", "AUTOMAÇÃO EM ESCALA"],
    },
  ],

  program: {
    morning: {
      label: "MANHÃ",
      schedule: "08h30 às 12h30",
      subtitle: "Mapeamento de Processos e Arquitetura de Automação",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h30",
          title: "O que IA automatiza hoje (e o que não)",
          body: "Diagnóstico realista: quais classes de processo IA já resolve em produção, quais são mistas (humano + IA) e quais ainda não compensam automatizar.",
          bullets: [
            "Classificação de processos: simples, complexos, críticos",
            "Quando automatizar com IA, quando com regra, quando com humano",
            "Erros frequentes: automatizar caos, ignorar caso de borda",
            "Mentalidade: humano no loop sempre que decisão crítica",
          ],
        },
        {
          number: "02",
          time: "09h30 às 10h30",
          title: "Mapeamento de processos candidatos",
          body: "Como diagnosticar processos da empresa que são candidatos a automação. Matriz impacto vs esforço aplicada ao seu contexto real.",
          quote:
            "Automação boa começa em processo já bom. Automação em caos só amplifica caos.",
          bullets: [
            "Inventário de processos por área",
            "Cálculo de tempo gasto e impacto de redução",
            "Critérios de seleção: frequência, volume, valor, risco",
            "Lista priorizada dos 3 processos com maior ROI",
          ],
          exercise:
            "Faça o inventário de processos da sua área e priorize os 3 com maior ROI.",
        },
        {
          number: "03",
          time: "10h45 às 11h30",
          title: "Arquitetura de automação com IA",
          body: "Padrões de arquitetura: assistente, agente, fluxo orquestrado, batch. Quando usar cada um e como combinar.",
          bullets: [
            "Padrão 1: Assistente (responde, sugere, esboça)",
            "Padrão 2: Agente (executa em sistemas externos)",
            "Padrão 3: Fluxo orquestrado (n8n, Zapier, Make + IA)",
            "Padrão 4: Batch (processamento em massa, jobs agendados)",
            "Como decidir o padrão certo para cada processo",
          ],
        },
        {
          number: "04",
          time: "11h30 às 12h30",
          title: "Ferramentas e ecossistema",
          body: "Mapa atualizado de ferramentas de automação com IA: Claude Cowork, ChatGPT Tasks, n8n, Make, Zapier, Pipedream e conectores MCP.",
          bullets: [
            "Comparativo entre as principais plataformas",
            "Conectores nativos vs MCP vs API direta",
            "Custo de operação: tokens, runs, assentos",
            "Governança: log, auditoria, controle de versão",
          ],
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "Construção de Automações Reais",
      blocks: [
        {
          number: "05",
          time: "14h00 às 15h30",
          title: "Lab 1: triagem e classificação automática",
          body: "Construção prática de automação de triagem: e-mails, pedidos, tickets ou candidatos. Cada participante implementa um caso real.",
          bullets: [
            "Definição da regra de triagem",
            "Construção do fluxo com IA + integração",
            "Teste com dados reais da operação",
            "Refino e tratamento de exceção",
          ],
          exercise:
            "Implemente uma triagem automática para um caso real do seu time.",
        },
        {
          number: "06",
          time: "15h30 às 16h30",
          title: "Lab 2: relatório e síntese recorrente",
          body: "Automação de relatórios executivos, weekly reports, briefings de cliente e síntese de reunião gerados automaticamente.",
          bullets: [
            "Coleta de dados de múltiplas fontes",
            "Geração assistida com tom e formato consistentes",
            "Distribuição automática para stakeholders",
            "Versionamento e histórico de relatórios",
          ],
          exercise:
            "Construa o relatório semanal da sua área em automação completa.",
        },
        {
          number: "07",
          time: "16h45 às 17h30",
          title: "Lab 3: agente que executa ponta a ponta",
          body: "Construção de agente que opera em sistemas externos: lê e-mail, identifica intenção, executa ação, registra log. Sem humano no meio.",
          bullets: [
            "Definição clara de escopo e limite do agente",
            "Conexão com sistemas externos via MCP ou API",
            "Tratamento de exceção e fallback humano",
            "Métricas de sucesso e log obrigatório",
          ],
        },
        {
          number: "08",
          time: "17h30 às 18h00",
          title: "Governança e plano de produção",
          body: "Como colocar automações em produção com segurança. Governança, monitoramento, atualização e plano de evolução.",
          bullets: [
            "Política de uso, retenção e privacidade",
            "Monitoramento de qualidade e drift",
            "Versionamento e rollback",
            "Cronograma de produção das automações construídas",
          ],
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Pelo menos 3 automações funcionais** construídas e testadas na imersão",
    "**Mapa de processos** prioritários com matriz impacto vs esforço",
    "**Arquitetura de automação** documentada por padrão (assistente, agente, fluxo, batch)",
    "**Política de governança** para automações em produção",
    "**Plano de produção** das próximas 4 semanas com responsáveis",
    "**Certificado** de conclusão",
    "**Acesso à comunidade** de profissionais que operam automação com IA",
  ],

  audience: [
    "Heads de operações e líderes de processo",
    "Gestores de áreas com alto volume operacional",
    "Líderes de transformação digital e automação",
    "Engenheiros de software e analistas técnicos próximos da operação",
    "Founders de empresas em fase de escalar operação",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, arquitetura de referência, política de governança e biblioteca de fluxos.",

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

  ctaTitle: "Coloque automação no coração da",
  ctaHighlight: "operação",
  ctaBody:
    "Diagnóstico dos processos candidatos, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão AI Automation Lab",
  metaDescription:
    "Imersão de 8 horas para automatizar processos e criar eficiência operacional com IA. Saída com pelo menos 3 automações funcionais prontas para produção.",
};
