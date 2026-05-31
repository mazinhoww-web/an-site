// Forma do mentor retornada por GET /api/mentormatch/mentors.
export interface MatchMentor {
  id: string;
  name: string | null;
  headline: string | null;
  department: string | null;
  bio: string | null;
  image: string | null;
  skills: string[];
  activeConnections: number;
  maxMentees: number;
}

export interface SkillOption {
  id: string;
  name: string;
}

/** Cor da barra de capacidade e estado de lotacao (DESIGN 6.2 / 6.7). */
export function capacityOf(mentor: MatchMentor) {
  const max = Math.max(1, mentor.maxMentees);
  const used = mentor.activeConnections;
  const ratio = used / max;
  const full = used >= max;
  const color = full ? 'var(--danger)' : ratio >= 0.75 ? 'var(--warning)' : 'var(--brand)';
  return { max, used, ratio, full, color };
}
