export interface AnalysisResult {
  score_geral: number;
  scores: {
    ats: number;
    aderencia_vaga: number;
    qualidade_experiencias: number;
    clareza: number;
  };
  resumo: string;
  skills_encontradas: string[];
  skills_faltantes: string[];
  secoes_presentes: string[];
  secoes_faltantes: string[];
  recomendacoes: Array<{
    titulo: string;
    descricao: string;
    sugestao: string;
  }>;
}

export type AnalysisState = 'idle' | 'loading' | 'success' | 'error';
