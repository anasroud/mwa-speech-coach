export interface Recording {
  _id: string;
  promptText: string;
  createdAt: string;
  metrics: { score: number };
  title: string;
  audioUrl: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  pages: number;
  total: number;
}

export interface Stats {
  totalRecordings: number;
  averageScore: number;
  hoursPracticed: number;
  improvement: number;
}

export interface ReportResponse {
  _id: string;
  ownerId: string;
  audioUrl: string;
  transcript: string;
  title: string;
  metrics: {
    wpm: number;
    fillerRate: number;
    avgPauseMs: number;
    sentiment: string;
    score: number;
    wordErrorRate: number;
  };
  promptText: string;
  advice: Advice[];
  createdAt: string;
  updatedAt: string;
}

export interface Advice {
  text: string;
  type: string;
}
