'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download, ArrowLeft } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { SkillCard } from '@/components/skills/SkillCard';
import { DownloadGate } from '@/components/skills/DownloadGate';

type Skill = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  downloads: number;
};

const SKILLS: Skill[] = [
  {
    slug: 'gtm-engineering',
    name: 'GTM Engineering',
    description: 'Arquitetura de sistemas de receita, ICP e Ideal Customer Signals.',
    longDescription: 'Esta skill ensina o Claude a operar como um GTM Engineer completo. Inclui arquitetura de sistemas de receita, definição de ICP (Ideal Customer Profile) e ICS (Ideal Customer Signals), stack moderno com Clay, HubSpot e N8N, e implementação de AI-Led Growth.\n\nO Claude aprende a construir pipelines de outbound automatizados, enriquecer leads com dados públicos, criar sequências de nurturing personalizadas e monitorar métricas GTM-5 (pipeline velocity, win rate, CAC, LTV, NRR).',
    category: 'Go-to-Market',
    tags: ['ICP', 'ICS', 'Stack GTM', 'AI Agents', 'Outbound'],
    downloads: 342,
  },
  {
    slug: 'gtm-automation-ai-agents',
    name: 'GTM Automation & AI Agents',
    description: 'SDR IA com workflow completo de nodes N8N.',
    longDescription: 'Skill focada em automação de GTM com agentes de IA. O Claude aprende a construir SDRs automatizados usando N8N, processar transcrições de reuniões (Fathom, Fireflies), criar agentes de higiene de CRM e alertas de churn automáticos.\n\nInclui workflows prontos para enriquecimento de lead inbound, scoring automático e handoff para vendedor humano.',
    category: 'Go-to-Market',
    tags: ['N8N', 'SDR IA', 'Transcrições', 'CRM Hygiene'],
    downloads: 289,
  },
  {
    slug: 'metodo-jet-ski',
    name: 'Método Jet Ski',
    description: 'Framework de inovação em 3 fases.',
    longDescription: 'O Método Jet Ski é um framework autoral de inovação em 3 fases: Diagnóstico da Oportunidade, Prototipação Ágil e Visão Transformadora. Desenvolvido para squads de inovação corporativa que precisam navegar ambientes regulados.\n\nQuando ativada, esta skill ensina o Claude a conduzir sessões de discovery, priorizar oportunidades com matriz de impacto/viabilidade, prototipar soluções em ciclos curtos e construir business cases para stakeholders.',
    category: 'Framework',
    tags: ['Inovação', 'Discovery', 'Squad', 'Protótipo'],
    downloads: 521,
  },
  {
    slug: 'gsd2-methodology',
    name: 'GSD2 Methodology',
    description: 'Get Shit Done 2: Milestone > Slice > Task.',
    longDescription: 'GSD2 (Get Shit Done Doubled) é a metodologia que estrutura este projeto. Organiza trabalho em Milestone > Slice > Task com spec-before-code, usando PROJECT.md, REQUIREMENTS.md e ROADMAP.md como single source of truth.\n\nEsta skill ensina o Claude a operar como project manager técnico, quebrando escopo grande em tarefas verificáveis, mantendo documentação sincronizada e evitando context-rot em projetos longos com IA.',
    category: 'Framework',
    tags: ['GSD', 'Spec-driven', 'Claude Code', 'Workflow'],
    downloads: 478,
  },
  {
    slug: 'automation-data-platforms',
    name: 'Automation & Data Platforms',
    description: 'Automações N8N/Make, integrações via API, CDP/RDP.',
    longDescription: 'Skill para construção de plataformas de dados e automação. O Claude aprende a projetar arquiteturas de Customer Data Platform (CDP), Revenue Data Platform (RDP) e Data Lakes com padrão Medallion (Bronze/Silver/Gold).\n\nInclui integração via API REST/GraphQL, webhooks, ETL/ELT com ferramentas low-code (N8N, Make) e orquestração de pipelines.',
    category: 'Data',
    tags: ['N8N', 'CDP', 'RDP', 'ETL/ELT', 'Webhooks'],
    downloads: 198,
  },
  {
    slug: 'revops-gtm-strategy',
    name: 'RevOps GTM Strategy',
    description: 'Revenue Operations end-to-end.',
    longDescription: 'Revenue Operations completo: jornada unificada do cliente, modelo de dados de receita, qualificação BANT/MEDDIC, pipeline management, forecasting e métricas GTM-5.\n\nO Claude aprende a desenhar processos de venda consultiva, configurar dashboards de pipeline e criar modelos de forecasting baseados em dados históricos.',
    category: 'Go-to-Market',
    tags: ['NRR/GRR', 'CAC/LTV', 'Pipeline', 'Forecast'],
    downloads: 167,
  },
  {
    slug: 'customer-success-operations',
    name: 'Customer Success Operations',
    description: 'Frameworks de onboarding, health score, retenção.',
    longDescription: 'Skill de Customer Success com frameworks de onboarding por milestones, health score composto, playbooks de retenção e expansão, QBR (Quarterly Business Review) e gestão de carteira por segmento.\n\nO Claude aprende a identificar sinais de churn, construir journeys de ativação e propor ações de expansion revenue.',
    category: 'Operations',
    tags: ['Health Score', 'Onboarding', 'QBR', 'Churn Prevention'],
    downloads: 134,
  },
  {
    slug: 'product-management-digital',
    name: 'Product Management Digital',
    description: 'OKRs, JTBD, Discovery, PLG, RICE.',
    longDescription: 'Gestão de produto digital com OKRs e North Star Metric, Google HEART framework, Jobs-to-be-Done, Continuous Discovery Habits e Product-Led Growth (PLG).\n\nO Claude aprende a priorizar backlog com RICE/ICE, conduzir interviews de discovery e estruturar roadmaps orientados a outcome.',
    category: 'Product',
    tags: ['OKRs', 'JTBD', 'Discovery', 'PLG', 'RICE Score'],
    downloads: 112,
  },
  {
    slug: 'agile-project-management',
    name: 'Agile Project Management',
    description: 'SCRUM, Dual Track Agile, documentação executiva.',
    longDescription: 'SCRUM completo com Dual Track Agile (Discovery + Delivery em paralelo) e documentação executiva acionável.\n\nO Claude aprende a facilitar cerimônias, manter backlog refinado, gerar status reports e coordenar squads multi-disciplinares.',
    category: 'Agile',
    tags: ['SCRUM', 'Sprints', 'Roadmap', 'Dual Track'],
    downloads: 98,
  },
  {
    slug: 'data-engineering-senior',
    name: 'Data Engineering Senior',
    description: 'Arquitetura Medallion, PySpark, Airflow, dbt.',
    longDescription: 'Engenharia de dados senior com arquitetura Medallion Bronze/Silver/Gold usando PySpark, pipelines ETL/ELT, orquestração com Airflow, modelagem dimensional com SCD e streaming Kafka.\n\nO Claude aprende a projetar data warehouses, escrever transformações dbt e configurar pipelines de ingestão em tempo real.',
    category: 'Data',
    tags: ['Medallion', 'PySpark', 'Airflow', 'dbt', 'Kafka'],
    downloads: 87,
  },
  {
    slug: 'innovation2business',
    name: 'Innovation2Business Framework',
    description: 'Do ideation ao revenue da inovação.',
    longDescription: 'Metodologia para transformar ideias em negócios viáveis dentro de squads corporativas. Conecta Discovery, Business Case e Go-to-Market em um fluxo único.\n\nO Claude aprende a avaliar viabilidade técnica e financeira de iniciativas de inovação, construir MVPs e medir traction com métricas pirata (AARRR).',
    category: 'Framework',
    tags: ['Inovação', 'Business Case', 'Squad', 'eLoyalty'],
    downloads: 156,
  },
  {
    slug: 'latam-deck-template',
    name: 'LATAM Deck Template',
    description: 'Templates LATAM Pass para decks executivos.',
    longDescription: 'Identidade visual LATAM Pass e ELEVATE 2025 aplicada a PPTX/HTML/PDF para decks executivos, status reports e propostas comerciais.\n\nO Claude aprende a estruturar apresentações com narrativa executiva, usando dados e métricas do programa de fidelidade.',
    category: 'LATAM Pass',
    tags: ['PPTX', 'LATAM Pass', 'Executive Review', 'Templates'],
    downloads: 73,
  },
];

export default function SkillDetailPage({ params }: { params: { slug: string } }) {
  const skill = SKILLS.find((s) => s.slug === params.slug);
  if (!skill) notFound();

  const [gateOpen, setGateOpen] = useState(false);
  const closeGate = useCallback(() => setGateOpen(false), []);

  const related = SKILLS.filter(
    (s) => s.slug !== skill.slug && s.category === skill.category,
  ).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            <Link href="/skills" className="transition-colors hover:text-ink">SKILLS</Link>
            {' / '}
            <span className="text-ink">{skill.name}</span>
          </p>
          <Label className="mb-3 block">{skill.category}</Label>
          <h1 className="max-w-3xl font-heading text-display-l">{skill.name}</h1>
          <p className="mt-4 text-body-l text-graphite">{skill.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="border border-hairline px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-6">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              {skill.downloads.toLocaleString('pt-BR')} downloads
            </span>
            <span className="border border-lime px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
              FREE
            </span>
          </div>

          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="mx-auto max-w-prose space-y-6 text-body text-graphite">
            {skill.longDescription.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-prose">
            <button
              type="button"
              onClick={() => setGateOpen(true)}
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
            >
              <Download size={16} strokeWidth={1.5} />
              BAIXAR SKILL
            </button>
            <p className="mt-3 text-body-s text-smoke">
              Arquivo .skill, compatível com Claude Code e Claude Cowork.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
          <div className="mx-auto max-w-container">
            <Eyebrow className="mb-6 block">SKILLS RELACIONADAS</Eyebrow>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <SkillCard
                  key={r.slug}
                  slug={r.slug}
                  name={r.name}
                  description={r.description}
                  category={r.category}
                  downloads={r.downloads}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-8" />
          <Link
            href="/skills"
            className="group inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Ver todas as skills
          </Link>
        </div>
      </section>

      {/* Download Gate Modal */}
      <DownloadGate
        skillSlug={skill.slug}
        skillName={skill.name}
        hasAsset={false}
        isOpen={gateOpen}
        onClose={closeGate}
      />
    </>
  );
}
