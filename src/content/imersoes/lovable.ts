import type { Immersion } from "./types";

export const lovable: Immersion = {
  slug: "lovable",
  title: "Imersão Corporativa Lovable",
  subtitle: "Seu time construindo software funcional em horas, não em meses.",
  highlightWord: "Lovable",
  logo: "/logos/lovable-light.svg",
  descriptor: "VIBE CODING × CORPORATE × IA",

  whyTitle: "O gargalo mudou de lugar.",
  whyBody:
    "A maioria das empresas ainda opera com ciclos de desenvolvimento de semanas ou meses para entregar qualquer solução digital. Enquanto isso, as organizações que adotaram desenvolvimento assistido por IA já operam em outro ritmo: **prototipar virou a forma mais rápida de pensar**.\n\nO novo gargalo não é técnico. É de clareza. Quem sabe o que quer construir, constrói rápido. Esta imersão de 8 horas prepara seus times para operar nesse novo paradigma usando Lovable como plataforma central de execução.",
  whyAccents: ["prototipar virou a forma mais rápida de pensar", "clareza"],

  results: [
    {
      label: "HEALTHTECHS",
      value: "60%+",
      description: "de redução no ciclo entre ideia e protótipo funcional em empresas que adotaram Vibe Coding.",
    },
    {
      label: "OPERAÇÕES INTERNAS",
      value: "R$200k+",
      description: "em economia anual ao substituir ferramentas terceiras por SaaS internos construídos na plataforma.",
    },
    {
      label: "REAL ESTATE GLOBAL",
      value: "US$1M+",
      description: "poupados por ano com aplicações internas que antes dependiam de fornecedores externos.",
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
      subtitle: "Fundamentos e Estratégia com Aurimar Nogueira",
      blocks: [
        {
          number: "01",
          time: "08h30 às 09h15",
          title: "O Novo Ciclo de Produção Digital",
          body: "Como organizações de referência global encurtaram radicalmente o caminho entre problema e solução digital.",
          comparison: {
            before: {
              head: "CICLO ANTERIOR",
              body: "Briefing, documento de requisitos, design, fila de desenvolvimento, meses até algo utilizável. Poucos testes, muita espera, quase nenhuma iteração.",
            },
            now: {
              head: "CICLO ATUAL",
              body: "Briefing, protótipo funcional, validação técnica, produção. Horas para construir, dezenas de experimentos, foco em decisão estratégica.",
            },
          },
          bullets: [
            "Ciclos de prototipação até 10x mais curtos com qualidade superior",
            "Ferramentas internas que eliminam gargalos operacionais do time",
            "Produtos digitais como nova fonte de receita",
            "Substituição de assinaturas caras por soluções sob medida",
            "Apresentações e interfaces que seguem o design system corporativo",
          ],
        },
        {
          number: "02",
          time: "09h15 às 09h45",
          title: "Domínio Completo da Plataforma Lovable",
          body: "Navegação detalhada por cada recurso: interface de construção, organização de projetos, base de conhecimento contextual, edição visual direta, modo de planejamento estratégico, gestão de domínios, integrações com repositórios e bancos de dados, conectores externos e mais.",
        },
        {
          number: "03",
          time: "09h45 às 10h30",
          title: "Planejamento Antes da Execução",
          body: "Quem constrói melhor com IA dedica a maior parte do tempo definindo o que construir, não construindo. Neste bloco:",
          quote:
            "O problema de 2026 não é mais saber programar. É saber comunicar com clareza o que precisa existir.",
          bullets: [
            "Documento de requisitos otimizado para desenvolvimento com IA",
            "Mapeamento visual de telas e fluxos",
            "Definição de objetivos mensuráveis e jornadas do usuário",
            "Identificação das funcionalidades essenciais",
            "Decisões de infraestrutura e integrações",
            "Padrões de design corporativo aplicados desde o início",
          ],
          exercise: "Planejamento completo de uma aplicação interna real da sua empresa.",
        },
        {
          number: "04",
          time: "10h45 às 11h30",
          title: "Construção Prática Guiada",
          body: "Hora de colocar a mão na massa. Você vai construir a aplicação planejada no bloco anterior, partindo do zero até um protótipo navegável.",
          bullets: [
            "Configuração de autenticação e controle de acesso",
            "Banco de dados integrado à plataforma",
            "Construção de interface profissional e responsiva",
            "Implementação de lógica de negócio e regras do domínio",
            "Ciclos rápidos de teste e ajuste com feedback da IA",
            "Refinamento visual em tempo real",
          ],
        },
        {
          number: "05",
          time: "11h30 às 12h00",
          title: "Técnicas de Produtividade Avançada",
          body: "Padrões e atalhos que separam o iniciante do profissional.",
          bullets: [
            "Como instruir a IA de forma precisa e obter resultados consistentes",
            "Prevenção de falhas recorrentes e redução de retrabalho",
            "Organização de projetos para escalar sem perder controle",
            "Erros frequentes e como contorná-los",
            "Fluxo de trabalho colaborativo entre membros do time",
            "Repertório de prompts, ferramentas auxiliares e gestão eficiente de recursos",
          ],
        },
        {
          number: "06",
          time: "12h00 às 12h30",
          title: "Síntese e Preparação para a Tarde",
          body: "Revisão das competências da manhã, entendimento honesto sobre limitações da plataforma e direcionamento para o módulo avançado da tarde.",
        },
      ],
    },
    afternoon: {
      label: "TARDE",
      schedule: "14h00 às 18h00",
      subtitle: "Projeto Avançado e Segurança com Aurimar Nogueira",
      blocks: [
        {
          number: "07",
          time: "14h00 às 14h30",
          title: "Arquitetura de Aplicações para o Mundo Real",
          body: "Entenda a separação entre camada visual, camada de dados e publicação de aplicações. Como Lovable orquestra essas partes para que você foque na lógica do negócio, não na infraestrutura.",
        },
        {
          number: "08",
          time: "14h30 às 16h15",
          title: "Projeto Complexo: CRM Corporativo do Zero",
          body: "Construção completa de um projeto real com múltiplas telas e regras de negócio.",
          bullets: [
            "Tradução de necessidade corporativa em especificação técnica",
            "Priorização de funcionalidades por impacto",
            "Construção de backend com persistência e validações",
            "Integração de módulos: cadastro, pipeline, relatórios",
            "Gestão de dados, fluxos automatizados e regras de acesso",
          ],
          quote: "O objetivo é sair com um CRM funcional adaptável à realidade da sua empresa.",
        },
        {
          number: "09",
          time: "16h15 às 17h00",
          title: "Segurança em Aplicações Construídas com IA",
          body: "Velocidade de construção não pode comprometer proteção. Fundamentos que todo time precisa dominar:",
          bullets: [
            "Por que segurança é obrigatória mesmo em plataformas no-code",
            "Principais vulnerabilidades e como se proteger",
            "Análise estática vs dinâmica de segurança",
            "Riscos específicos de aplicações corporativas geradas por IA",
            "Controle de autenticação e autorização robusto",
            "Segregação de acesso por perfil e nível hierárquico",
            "Conformidade com LGPD e proteção de dados sensíveis",
            "Checklist de segurança para ambientes de produção",
          ],
        },
        {
          number: "10",
          time: "17h00 às 18h00",
          title: "Plano de Adoção e Encerramento",
          body: "Sessão final de estratégia e planejamento de próximos passos.",
          bullets: [
            "Roteiro de implantação de Lovable na organização",
            "Montagem de equipes internas e modelo de governança",
            "Seleção dos primeiros casos de uso por prioridade",
            "Perguntas abertas e discussão com o instrutor",
            "Networking entre participantes",
          ],
        },
      ],
    },
    intervalText: "10h30 às 10h45 · Intervalo",
  },

  deliverables: [
    "**Competência prática** para criar aplicações corporativas em horas, não semanas",
    "**Domínio de planejamento** e execução assistida por IA",
    "**Fluência completa** na plataforma Lovable",
    "**Fundamentos de segurança** e governança aplicados",
    "**Um CRM funcional** construído durante a imersão",
    "**Certificado** de conclusão",
    "**Acesso à comunidade** de profissionais que usam Lovable em contexto corporativo",
    "**Roteiro personalizado** de adoção para a sua empresa",
  ],

  audience: [
    "Gestores de tecnologia que buscam multiplicar a capacidade de entrega dos times",
    "Product Managers que precisam testar hipóteses com velocidade",
    "Designers que querem materializar conceitos em protótipos navegáveis",
    "Desenvolvedores que querem eliminar tarefas repetitivas e entregar mais rápido",
    "Executivos que precisam entender o impacto real do Vibe Coding no negócio",
    "Intraempreendedores que querem criar soluções internas sem depender de fila de TI",
  ],

  duration: "8 horas (08h30 às 12h30 e 14h00 às 18h00)",
  includes:
    "Material de apoio, certificado de conclusão, roteiro de adoção personalizado e acesso a recursos complementares.",

  prices: [
    { label: "REMOTO", price: "R$20.000,00", note: "VIA VIDEOCONFERÊNCIA · ATÉ 25 PARTICIPANTES" },
    { label: "PRESENCIAL · SÃO PAULO CAPITAL", price: "R$25.000,00", note: "INCLUI ESTRUTURA E EQUIPAMENTOS" },
    { label: "PRESENCIAL · INTERIOR DE SP", price: "R$30.000,00", note: "INCLUI DESLOCAMENTO INTERNO" },
    { label: "PRESENCIAL · FORA DO ESTADO DE SP", price: "R$40.000,00", note: "VALORES NÃO INCLUEM DESLOCAMENTO E EVENTUAL ESTADIA" },
  ],
  priceDisclaimer: "VALORES VÁLIDOS PARA TURMAS DE ATÉ 25 PARTICIPANTES · CONSULTAR PARA GRUPOS MAIORES",

  ctaTitle: "Prepare seu time para construir com",
  ctaHighlight: "Lovable",
  ctaBody:
    "Primeiro entendemos o contexto da sua empresa, perfil dos participantes e formato ideal. Retorno em até 48 horas úteis.",

  metaTitle: "Imersão Corporativa Lovable",
  metaDescription:
    "Imersão corporativa de 8 horas para times que precisam dominar Lovable, Vibe Coding e desenvolvimento assistido por IA. Gestores de tech, PMs, designers e executivos.",
};
