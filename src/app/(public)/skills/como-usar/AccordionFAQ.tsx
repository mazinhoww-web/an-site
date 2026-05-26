'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQ_ITEMS = [
  {
    question: 'Funciona no claude.ai web?',
    answer:
      'Skills foram projetadas para Claude Code (terminal) e Claude Cowork (interface colaborativa). No claude.ai web padrão, você pode colar o conteúdo da skill como contexto inicial da conversa, mas a experiência é otimizada para Code e Cowork.',
  },
  {
    question: 'Posso usar múltiplas skills ao mesmo tempo?',
    answer:
      'Sim. Você pode carregar até 3 skills simultaneamente em uma sessão. O Claude vai combinar os frameworks e aplicar o mais relevante para cada tarefa. Para melhores resultados, use skills complementares (ex: GSD2 + Product Management).',
  },
  {
    question: 'Como recebo atualizações?',
    answer:
      'Quando uma skill é atualizada, você recebe um email (se optou pela newsletter). Basta baixar a nova versão e substituir o arquivo anterior. O número de versão aparece no card da skill.',
  },
  {
    question: 'Qual o formato do arquivo?',
    answer:
      'O arquivo .skill é um arquivo de texto estruturado com metadados, instruções e exemplos. Ele não contém código executável, apenas contexto e metodologia que o Claude interpreta. Tamanho típico: 50-200KB.',
  },
  {
    question: 'Funciona com outros modelos além do Claude?',
    answer:
      'Skills foram otimizadas para Claude (Anthropic). Podem funcionar parcialmente com outros modelos que suportam instruções de sistema longas, mas a qualidade de execução será menor. Recomendamos Claude Sonnet 4 ou superior.',
  },
  {
    question: 'Preciso pagar algo?',
    answer:
      'Todas as skills disponíveis são FREE. Você precisa apenas de uma conta Claude (gratuita ou paga) para usá-las. Skills PRO podem ser lançadas no futuro com conteúdo exclusivo.',
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
