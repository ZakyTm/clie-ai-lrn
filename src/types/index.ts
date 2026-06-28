export interface Term {
  id: string;
  title: string;
  summary: string;
  body: string;
  avoid?: string;
  usage?: string;
  related: string[];
  section: string;
  readTimeMinutes: number;
  sourceRepo: "manual" | "reference";
  sources?: string[];
  lastUpdated: string;
}

export interface Lesson {
  id: string;
  title: string;
  phaseId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  summary: string;
  body: string;
  resources: string[]; // resource IDs
  readTimeMinutes: number;
}

export interface Phase {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Resource {
  id: string;
  type: "github" | "article" | "video" | "paper" | "tool" | "doc";
  title: string;
  url: string;
  description?: string;
  sourceRepo: string;
  stars?: number;
  tags: string[];
  addedAt: string;
}

export interface BuildMeta {
  lastSynced: string;
  termCount: number;
  phaseCount: number;
  lessonCount: number;
  resourceCount: number;
}

