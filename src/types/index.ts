export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  conceptCount: number;
  order: number;
}

export interface Concept {
  id: string;
  title: string;
  domains: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  summary: string;
  body?: string;
  resources: Resource[];
  related: string[];
  tags: string[];
  sourceRepo: string;
  lastUpdated: string;
  readTimeMinutes: number;
  featured: boolean;
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
  conceptCount: number;
  resourceCount: number;
  domainCount: number;
  syncedRepos: string[];
}
