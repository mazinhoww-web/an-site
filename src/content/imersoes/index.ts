// src/content/imersoes/index.ts
// Registry de imersoes. Importar daqui em qualquer page ou componente.

import type { Immersion, ImmersionSlug } from "./types";
import { lovable } from "./lovable";
import { claude } from "./claude";
import { iaNaPratica } from "./ia-na-pratica";
import { aiBusinessBuilder } from "./ai-business-builder";
import { iaAdvogados } from "./ia-advogados";
import { iaProdutos } from "./ia-produtos";
import { aiAutomationLab } from "./ai-automation-lab";
import { iaExecutivos } from "./ia-executivos";
import { founderIa } from "./founder-ia";

export const immersions: Record<ImmersionSlug, Immersion> = {
  lovable,
  claude,
  "ia-na-pratica": iaNaPratica,
  "ai-business-builder": aiBusinessBuilder,
  "ia-advogados": iaAdvogados,
  "ia-produtos": iaProdutos,
  "ai-automation-lab": aiAutomationLab,
  "ia-executivos": iaExecutivos,
  "founder-ia": founderIa,
};

export function getImmersion(slug: ImmersionSlug): Immersion {
  return immersions[slug];
}

// Ordem: principais (lovable, claude) no topo, depois as demais
export function getAllImmersions(): Immersion[] {
  return [
    lovable,
    claude,
    iaNaPratica,
    aiBusinessBuilder,
    iaAdvogados,
    iaProdutos,
    aiAutomationLab,
    iaExecutivos,
    founderIa,
  ];
}

export type { Immersion, ImmersionSlug } from "./types";
