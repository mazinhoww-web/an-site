'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQ_ITEMS = [
  {
    question: 'Funciona no claude.ai web?',
    answer:
      'Skills foram projetadas para Claude Code (terminal) e Claude Cowork (interface colaborativa). No claude.ai web padrao, voce pode colar o conteudo da skill como contexto inicial da conversa, mas a experiencia eh otimizada para Code e Cowork.',
  },
  {
    question: 'Posso usar multiplas skills ao mesmo tempo?',
    answer:
      'Sim. Voce pode carregar ate 3 skills simultaneamente em uma sessao. O Claude vai combinar os frameworks e aplicar o mais relevante para cada tarefa. Para melhores resultados, use skills complementares (ex: GSD2 + Product Management).',
  },
  {
    question: 'Como recebo atualizacoes?',
    answer:
      'Quando uma skill eh atualizada, voce recebe um email (se optou pela newsletter). Basta baixar a nova versao e substituir o arquivo anterior. O numero de versao aparece no card da skill.',
  },
  {
    question: 'Qual o formato do arquivo?',
    answer:
      'O arquivo .skill eh um arquivo de texto estruturado com metadados, instrucoes e exemplos. Ele nao contem codigo executavel, apenas contexto e metodologia que o Claude interpreta. Tamanho tipico: 50-200KB.',
  },
  {
    question: 'Funciona com outros modelos alem do Claude?',
    answer:
      'Skills foram otimizadas para Claude (Anthropic). Podem funcionar parcialmente com outros modelos que suportam instrucoes de sistema longas, mas a qualidade de execucao sera menor. Recomendamos Claude Sonnet 4 ou superior.',
  },
  {
    question: 'Preciso pagar algo?',
    answer:
      'Todas as skills disponiveis sao FREE. Voce precisa apenas de uma conta Claude (gratuita ou paga) para usa-las. Skills PRO podem ser lancadas no futuro com conteudo exclusivo.',
  },
] as const;

export function AccordionFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-prose space-y-0">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="border-b border-hairline">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left"
            aria-expanded={openIndex === i}
          >
            <span className="font-heading text-h3 pr-4">{item.question}</span>
            <ChevronDown
              size={20}
              strokeWidth={1.5}
              className={cn(
                'flex-shrink-0 text-smoke transition-transform duration-200',
                openIndex === i && 'rotate-180',
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              openIndex === i ? 'max-h-96 pb-5' : 'max-h-0',
            )}
          >
            <p className="text-body text-graphite">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
