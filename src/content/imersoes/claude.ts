import type { Immersion } from "./types";

export const claude: Immersion = {
  slug: "claude",
  title: "Imersão Corporativa Claude",
  subtitle: "IA que amplifica a capacidade do seu time, não substitui.",
  highlightWord: "Claude",
  logo: "/logos/claude.png",
  descriptor: "IA × CORPORATE × PRODUTIVIDADE",

  whyTitle: "Mais do que uma ferramenta. Um acelerador.",
  whyBody:
    "Grande parte das empresas ainda gasta horas em tarefas manuais, procura informação espalhada entre sistemas e espera respostas de equipes saturadas. As organizações que saíram na frente entenderam algo diferente: **IA aplicada corretamente multiplica a inteligência do time inteiro**.\n\nHoje o gargalo não é falta de dados ou ferramentas. É a capacidade de transformar contexto em ação com velocidade e consistência. Esta imersão de 8 horas capacita seu time a usar Claude como parceiro de trabalho diário, como base de conhecimento corporativo via Skills e como executor de fluxos reais via Cowork.",
  whyAccents: ["multiplica a inteligência do time inteiro", "velocidade e consistência"],

  results: [
    {
      label: "FINTECHS GLOBAIS",
      value: "700+",
      description: "posições de atendimento otimizadas com automação de IA, sem perda de qualidade percebida.",
    },
    {
      label: "SQUADS DE ENGENHARIA",
      value: "40%",
      description: "de ganho de eficiência em revisão de código com suporte ativo de IA.",
    },
    {
      label: "CONSULTORIAS",
      value: "60%",
      description: "menos tempo na produção de relatórios executivos com auxílio de Claude.",
    },
  ],

  instructors: [
    {
      name: "Aurimar Nogueira",
      role: "INSTRUTOR",
      photo: "/photos/aurimar-editorial.jpg",
      bio: "Coordenador Sr. de Negócios Financeiros na LATAM Pass com passagens por CERC, CRDC e Stone. Liderou o registro da primeira CPR Verde do Brasil e atingiu 60% de market share em recebíveis contra a B3. Criador dos frameworks Método Jet, GSD2 e Innovation2Business. Combina execução em produtos regulados com inovação aplicada para capacitar times corporativos.",
      credentials: ["LATAM PASS", "CERC", "STONE", "MÉTODO JET", "GSD2"],
    },
  ],

  program: {
    morning: {
      label: "MANHÃ",
      schedule: "08h30 às 12h30",
      subtitle: "Fundamentos e Aplicação Estratégica com Aurimar Nogueira",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h15",
          title: "Claude como Parceiro de Trabalho Diário",
          body: "Como equipes de alto desempenho estão usando IA não apenas para automatizar, mas para elevar a qualidade de cada decisão e entrega.",
          comparison: {
            before: {
              head: "FLUXO TRADICIONAL",
              body: "Profissional pesquisa, redige, revisa, formata, envia. Horas gastas em atividades operacionais, pouca energia para o que realmente importa.",
            },
            now: {
              head: "FLUXO COM CLAUDE",
              body: "Profissional instrui, valida, refina, entrega. Resultado 3x mais rápido com foco total em julgamento e decisão estratégica.",
            },
          },
          bullets: [
            "Capacidades reais e limitações honestas do Claude",
            "O que diferencia Claude de outras ferramentas de IA disponíveis",
            "Aplicações imediatas por departamento: Marketing, Jurídico, RH, Financeiro, Tech, Operações",
            "Por que saber instruir IA é a competência profissional mais subestimada",
            "Mentalidade correta: trabalhar com IA como parceiro, não como atalho",
          ],
        },
        {
          number: "02",
          time: "09h15 às 09h45",
          title: "Navegação Completa pela Plataforma Claude",
          body: "Exploração detalhada de cada recurso disponível: interface principal, Projetos com contexto persistente, Instruções customizadas, Artefatos, envio de documentos (PDFs, planilhas, contratos), busca contextual e memória, conexões com Google Drive, Gmail e Calendar, e comparação entre os planos disponíveis.",
        },
        {
          number: "03",
          time: "09h45 às 10h30",
          title: "Instrução Profissional: A Base de Tudo",
          body: "Quem usa Claude com excelência investe a maior parte do esforço em contexto e instrução, e o mínimo em revisão. Neste bloco:",
          quote:
            "Saber programar deixou de ser diferencial. Saber comunicar o que precisa ser feito com clareza é o que define quem entrega mais.",
          bullets: [
            "Estrutura de um prompt de alta performance: Contexto, Tarefa, Formato, Restrições",
            "System Prompts que transformam Claude num especialista do seu domínio",
            "Técnicas avançadas: raciocínio em cadeia, atribuição de papel, exemplos de referência",
            "Como minimizar respostas imprecisas e aumentar a assertividade",
            "Modelos de prompt por tipo de atividade: análise, síntese, criação, revisão, extração, classificação",
          ],
          exercise: "Crie e teste um prompt profissional aplicado a um problema real da sua empresa.",
        },
        {
          number: "04",
          time: "10h45 às 11h30",
          title: "Skills: Conhecimento Corporativo como Ativo Reutilizável",
          body: "Skills são conjuntos de instruções avançadas que configuram Claude como um especialista dedicado a funções específicas da sua empresa, carregando contexto, tom de voz, processos e padrões internos.",
          bullets: [
            "O que são Skills e como operam na prática",
            "Criação de Skills por área: jurídico, RH, financeiro, atendimento, comercial",
            "Incorporação de base de conhecimento: políticas, modelos, fluxos, vocabulário do negócio",
            "Skills para rotinas recorrentes: relatórios, triagem de contratos, classificação de e-mails, integração de novos colaboradores",
            "Modelo de governança: quem cria, quem valida, quem mantém",
          ],
          exercise: "Monte uma Skill funcional para uma atividade crítica do seu time.",
        },
        {
          number: "05",
          time: "11h30 às 12h00",
          title: "Eficiência Operacional e Padrões Corporativos",
          body: "Acelere a curva de adoção e evite os erros que travam a maioria das empresas.",
          bullets: [
            "Organização de Projetos por área, cliente e objetivo",
            "Regras de segurança e confidencialidade: o que nunca compartilhar com IA",
            "Construção de política interna de uso responsável de IA",
            "Riscos frequentes: dependência excessiva, validação negligenciada, ataques via prompt",
            "Repertório de produtividade: biblioteca de prompts, templates, rotinas de uso diário",
          ],
        },
        {
          number: "06",
          time: "12h00 às 12h30",
          title: "Síntese e Preparação para o Módulo Avançado",
          body: "Consolidação do que foi aprendido na manhã, identificação dos casos de uso de maior retorno para sua empresa e direcionamento para o módulo de Cowork e automações da tarde.",
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "Automações Avançadas e Governança com Aurimar Nogueira",
      blocks: [
        {
          number: "07",
          time: "14h00 às 14h30",
          title: "Cowork: IA que Executa, Não Apenas Responde",
          body: "Claude Cowork opera como um agente conectado às ferramentas que sua empresa já usa, executando fluxos de trabalho completos de ponta a ponta.",
          bullets: [
            "Diferença entre Claude assistente (responde perguntas) e Claude agente (executa tarefas)",
            "Conexões disponíveis: Gmail, Google Calendar, Google Drive, Slack, Notion, CRMs e ERPs",
            "Como o Model Context Protocol (MCP) permite que Claude acesse sistemas externos ao vivo",
            "Exemplos reais de automação por departamento que funcionam hoje",
            "Limitações atuais e funcionalidades em desenvolvimento",
            "Como identificar quais fluxos da sua empresa são candidatos a automação via Cowork",
          ],
        },
        {
          number: "08",
          time: "14h30 às 16h00",
          title: "Claude Code, Ambientes de Desenvolvimento e Agentes",
          body: "Imersão nas ferramentas avançadas do ecossistema Claude para times técnicos e de operações.",
          bullets: [
            "Claude Code: uso direto no terminal para tarefas de engenharia e automação",
            "Integração com editores de código: configuração e fluxos práticos com VS Code, JetBrains e outros",
            "Estruturação de repositórios e bases de conhecimento para uso otimizado com Claude",
            "Skills de alta complexidade: múltiplas etapas, integrações, lógica condicional",
            "Agentes autônomos: configuração e orquestração de fluxos que operam sem supervisão contínua",
            "Conectores MCP: integrações ao vivo com sistemas externos",
            "Exemplos práticos: automações reais combinando Code, Skills e Agentes",
          ],
        },
        {
          number: "09",
          time: "16h00 às 17h00",
          title: "Segurança, Governança e Plano de Adoção",
          body: "Encerramento com responsabilidade corporativa e estratégia de implantação.",
          bullets: [
            "Como a Anthropic trata os dados da sua empresa: o que retém e o que não retém",
            "Diferenças de privacidade por plano: Pro, Team e Enterprise",
            "Residência de dados e adequação à LGPD",
            "Configuração de retenção zero para ambientes sensíveis",
            "Construção da política interna de uso de IA",
            "Controle de acesso a Skills e Projetos por equipe",
            "Estruturação de um programa formal de adoção de Claude na organização",
            "Matriz de priorização: impacto vs esforço para os primeiros casos de uso",
            "Perfil do multiplicador interno: quem deve liderar a adoção no time",
            "Perguntas abertas e networking entre participantes",
          ],
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Competência prática** para usar Claude como multiplicador de produtividade a partir do dia seguinte",
    "**Skills corporativas** estruturadas para as atividades de maior impacto do seu time",
    "**Pelo menos um fluxo de Cowork** configurado e pronto para operar",
    "**Política de uso de IA** e modelo de governança adaptável à sua organização",
    "**Certificado** de conclusão",
    "**Acesso à comunidade** de profissionais que aplicam Claude em contexto corporativo",
    "**Roteiro de adoção** personalizado para sua empresa",
  ],

  audience: [
    "Gestores de tecnologia que precisam estruturar a adoção de IA nos times",
    "Product Managers e Analistas que querem entregar mais com menos retrabalho",
    "Executivos e C-levels que precisam saber o que Claude resolve (e o que não resolve) para o negócio",
    "Times de RH, Jurídico, Marketing e Financeiro com alto volume de atividades repetitivas de alto valor",
    "Intraempreendedores que querem ser os primeiros a criar vantagem competitiva interna com IA",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, roteiro de adoção personalizado, Skills corporativas prontas e acesso a recursos complementares.",

  prices: [
    { label: "REMOTO", price: "R$20.000,00", note: "VIA VIDEOCONFERÊNCIA · ATÉ 25 PARTICIPANTES" },
    { label: "PRESENCIAL · SÃO PAULO CAPITAL", price: "R$25.000,00", note: "INCLUI ESTRUTURA E EQUIPAMENTOS" },
    { label: "PRESENCIAL · INTERIOR DE SP", price: "R$30.000,00", note: "INCLUI DESLOCAMENTO INTERNO" },
    { label: "PRESENCIAL · FORA DO ESTADO DE SP", price: "R$40.000,00", note: "VALORES NÃO INCLUEM DESLOCAMENTO E EVENTUAL ESTADIA" },
  ],
  priceDisclaimer: "VALORES VÁLIDOS PARA TURMAS DE ATÉ 25 PARTICIPANTES · CONSULTAR PARA GRUPOS MAIORES",

  ctaTitle: "Leve Claude para o centro da operação da sua",
  ctaHighlight: "empresa",
  ctaBody:
    "Primeiro entendemos o contexto da sua empresa, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão Corporativa Claude",
  metaDescription:
    "Imersão corporativa de 8 horas para usar Claude como acelerador de produtividade, construir Skills corporativas e operar automações com Cowork. Para gestores de tech, PMs, executivos e times de operação.",
};
