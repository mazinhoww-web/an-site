// src/content/imersoes/index.ts
// Registry de imersões. Importar daqui em qualquer page ou componente.

import type { Immersion, ImmersionSlug } from "./types";
import { lovable } from "./lovable";
import { claude } from "./claude";

export const immersions: Record<ImmersionSlug, Immersion> = {
  lovable,
  claude,
};

export function getImmersion(slug: ImmersionSlug): Immersion {
  return immersions[slug];
}

export function getAllImmersions(): Immersion[] {
  return [lovable, claude];
}

export type { Immersion, ImmersionSlug } from "./types";
