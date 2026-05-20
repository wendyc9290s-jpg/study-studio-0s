// ── Core shared types ──────────────────────────────────────────────────────

export type CourseStatus  = 'not-started' | 'previewing' | 'studying' | 'done';
export type ExamRelevance = 'low' | 'medium' | 'high';
export type ResourceType  = 'youtube' | 'bilibili' | 'pdf' | 'web' | 'note';

export interface KeyTopic {
  id: string;
  text: string;
  done: boolean;
  notes?: string;
  topicConfidence?: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  addedAt: string;
}

export interface Course {
  id: string;
  name: string;
  year: 'Year 2' | 'Year 3';
  blurb: string;
  examRelevance: ExamRelevance;
  status: CourseStatus;
  confidence: 0 | 1 | 2 | 3 | 4 | 5;
  keyTopics: KeyTopic[];
  resources: Resource[];
  notes: string;
}

export interface Programme {
  name: string;
  partner: string;
  structure: string;
  creditsPerYear: number;
}

export interface AppState {
  programme: Programme;
  courses: Course[];
}

// ── CFA ───────────────────────────────────────────────────────────────────

export type CfaLevel = 'I' | 'II' | 'III';

export interface CfaItem {
  id: string;
  text: string;
  done: boolean;
}

export interface CfaTopic {
  id: string;
  level: CfaLevel;
  name: string;
  examWeightMin: number;
  examWeightMax: number;
  status: CourseStatus;
  confidence: 0 | 1 | 2 | 3 | 4 | 5;
  uobOverlap: string[];
  items: CfaItem[];
  notes: string;
}

export interface CfaState {
  topics: CfaTopic[];
}

// ── ACCA ──────────────────────────────────────────────────────────────────

export type AccaGroup    = 'Foundations' | 'Knowledge' | 'Expertise' | 'Strategic Professional' | 'Strategic Professional Options';
export type AccaPriority = 'high' | 'medium' | 'low';

export interface AccaPaper {
  id: string;
  code: string;
  name: string;
  group: AccaGroup;
  status: CourseStatus;
  priority: AccaPriority;
  uobOverlap: string[];
  examDate: string;
  notes: string;
}

export interface AccaState {
  papers: AccaPaper[];
}

// ── 4-Month Plan ──────────────────────────────────────────────────────────

export interface PlanTask {
  id: string;
  text: string;
  done: boolean;
}

export interface PlanWeek {
  id: string;
  weekNumber: number;
  phase: 1 | 2 | 3 | 4;
  title: string;
  goals: string[];
  tasks: PlanTask[];
}

export interface PlanState {
  weeks: PlanWeek[];
}

// ── Resource Library ──────────────────────────────────────────────────────

export type LibraryResourceType = 'youtube' | 'bilibili' | 'pdf' | 'web' | 'note' | 'excel';

export interface LibraryResource {
  id: string;
  title: string;
  url: string;
  type: LibraryResourceType;
  tags: string[];
  modules: string[];
  done: boolean;
  notes: string;
}

export interface LibraryState {
  resources: LibraryResource[];
}
