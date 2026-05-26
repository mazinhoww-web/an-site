'use client';

import { useState } from 'react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { SkillCard } from '@/components/skills/SkillCard';
import { cn } from '@/lib/utils';

const SKILLS = [
  {
    slug: 'gtm-engineering',
    name: 'GTM Engineering',
    description: 'Arquitetura de sistemas de receita, ICP e Ideal Customer Signals, stack moderno (Clay, HubSpot, N8N) e implementacao de AI-Led Growth.',
    category: 'Go-to-Market',
    downloads: 342,
    featured: true,
  },
  {
    slug: 'gtm-automation-ai-agents',
    name: 'GTM Automation & AI Agents',
    description: 'SDR IA com workflow completo de nodes N8N, processamento automatico de transcricoes, agente de higiene de CRM e enriquecimento de lead inbound.',
    category: 'Go-to-Market',
    downloads: 289,
    featured: true,
  },
  {
    slug: 'metodo-jet-ski',
    name: 'Metodo Jet Ski',
    description: 'Framework de inovacao em 3 fases: Diagnostico da Oportunidade, Prototipacao Agil, Visao Transformadora. Aplicado em squads de inovacao corporativa.',
    category: 'Framework',
    downloads: 521,
    featured: true,
  },
  {
    slug: 'gsd2-methodology',
    name: 'GSD2 Methodology',
    description: 'Get Shit Done 2: Milestone > Slice > Task com spec-before-code. Anti-context-rot para projetos com IA.',
    category: 'Framework',
    downloads: 478,
    featured: true,
  },
  {
    slug: 'automation-data-platforms',
    name: 'Automation & Data Platforms',
    description: 'Automacoes N8N/Make, integracoes via API, Customer Data Platform (CDP), Revenue Data Platform (RDP) e arquitetura de Data Lake com Medallion.',
    category: 'Data',
    downloads: 198,
    featured: true,
  },
  {
    slug: 'revops-gtm-strategy',
    name: 'RevOps GTM Strategy',
    description: 'Revenue Operations end-to-end: jornada unificada do cliente, modelo de dados de receita, BANT/MEDDIC, pipeline management e forecasting.',
    category: 'Go-to-Market',
    downloads: 167,
  },
  {
    slug: 'customer-success-operations',
    name: 'Customer Success Operations',
    description: 'Frameworks de onboarding com milestones, health score composto, playbooks de retencao e expansao, QBR e gestao de carteira por segmento.',
    category: 'Operations',
    downloads: 134,
  },
  {
    slug: 'product-management-digital',
    name: 'Product Management Digital',
    description: 'OKRs e North Star Metric, Google HEART framework, Jobs-to-be-Done, Continuous Discovery Habits, Product-Led Growth, priorizacao RICE/ICE.',
    category: 'Product',
    downloads: 112,
  },
  {
    slug: 'agile-project-management',
    name: 'Agile Project Management',
    description: 'SCRUM completo, Dual Track Agile (Discovery + Delivery paralelos) e documentacao executiva acionavel.',
    category: 'Agile',
    downloads: 98,
  },
  {
    slug: 'data-engineering-senior',
    name: 'Data Engineering Senior',
    description: 'Arquitetura Medallion Bronze/Silver/Gold com PySpark, pipelines ETL/ELT, orquestracao com Airflow, modelagem dimensional com SCD e streaming.',
    category: 'Data',
    downloads: 87,
  },
  {
    slug: 'innovation2business',
    name: 'Innovation2Business Framework',
    description: 'Metodologia para transformar ideias em negocios viaveis dentro de squads corporativas, conectando Discovery, Business Case e Go-to-Market.',
    category: 'Framework',
    downloads: 156,
  },
  {
    slug: 'latam-deck-template',
    name: 'LATAM Deck Template',
    description: 'Identidade visual LATAM Pass e ELEVATE 2025 aplicada a PPTX/HTML/PDF para decks executivos, status reports e propostas.',
    category: 'LATAM Pass',
    downloads: 73,
  },
] as const;

const CATEGORIES = ['TODOS', 'Go-to-Market', 'Framework', 'Data', 'Operations', 'Product', 'Agile', 'LATAM Pass'] as const;

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState('TODOS');

  const filtered = activeCategory === 'TODOS'
    ? SKILLS
    : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label withTab className="mb-4 block">SKILLS</Label>
          <h1 className="font-heading text-display-m">Metodologias empacotadas para Claude</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">
            Frameworks de trabalho transformados em codigo executavel.
            Cada skill ensina o Claude a executar tarefas com o metodo especifico.
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] transition-colors duration-150',
                  activeCategory === cat
                    ? 'border border-lime bg-lime/10 text-lime'
                    : 'border border-hairline text-smoke hover:border-ink hover:text-ink',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-20 pt-8 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-body text-smoke">
              Nenhuma skill nessa categoria.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((skill) => (
                <SkillCard
                  key={skill.slug}
                  slug={skill.slug}
                  name={skill.name}
                  description={skill.description}
                  category={skill.category}
                  downloads={skill.downloads}
                  featured={'featured' in skill && skill.featured}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
