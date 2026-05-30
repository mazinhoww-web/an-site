'use client';

import { Bell, BookOpen, Calendar, Inbox, Users } from 'lucide-react';
import { EmptyState, type EmptyStateProps } from './EmptyState';

type Overrides = Partial<EmptyStateProps>;

export function EmptyStateNoMentors(p: Overrides) {
  return (
    <EmptyState
      icon={<Users size={22} />}
      title="Nenhum mentor encontrado"
      description="Nao ha mentores disponiveis no momento. Ajuste os filtros ou volte mais tarde."
      {...p}
    />
  );
}

export function EmptyStateNoPendingRequests(p: Overrides) {
  return (
    <EmptyState
      icon={<Inbox size={22} />}
      title="Nenhuma solicitacao pendente"
      description="Quando alguem solicitar mentoria, a solicitacao aparece aqui."
      {...p}
    />
  );
}

export function EmptyStateNoSessions(p: Overrides) {
  return (
    <EmptyState
      icon={<Calendar size={22} />}
      title="Nenhuma sessao agendada"
      description="Voce ainda nao tem sessoes marcadas. Agende a primeira com seu mentor."
      {...p}
    />
  );
}

export function EmptyStateNoMaterials(p: Overrides) {
  return (
    <EmptyState
      icon={<BookOpen size={22} />}
      title="Biblioteca vazia"
      description="Nenhum material publicado ainda. Envie o primeiro para compartilhar conhecimento."
      {...p}
    />
  );
}

export function EmptyStateNoNotifications(p: Overrides) {
  return (
    <EmptyState
      icon={<Bell size={22} />}
      title="Sem notificacoes"
      description="Voce esta em dia. Novas notificacoes aparecem aqui."
      {...p}
    />
  );
}

export function EmptyStateNoConnections(p: Overrides) {
  return (
    <EmptyState
      icon={<Users size={22} />}
      title="Nenhuma conexao ativa"
      description="Voce ainda nao tem conexoes nesta aba. Conecte-se a um mentor para comecar."
      {...p}
    />
  );
}
