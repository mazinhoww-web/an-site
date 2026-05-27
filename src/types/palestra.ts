export type PalestraFoto = {
  src: string;
  alt: string;
  caption?: string;
};

export type PalestraModulo = {
  numero: number;
  titulo: string;
  descricao: string;
};

export type Palestra = {
  slug: string;
  titulo: string;
  pilar: string;
  lead: string;
  quote: string;
  duracao: string;
  formato: string;
  publico: string[];
  modulos: PalestraModulo[];
  fotos: PalestraFoto[];
  placeholder_ai?: boolean;
};
