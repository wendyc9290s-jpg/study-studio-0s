export type CourseStatus = 'not-started' | 'previewing' | 'studying' | 'done';
export type ExamRelevance = 'low' | 'medium' | 'high';
export type ResourceType = 'youtube' | 'bilibili' | 'pdf' | 'web' | 'note';

export interface KeyTopic {
  id: string;
  text: string;
  done: boolean;
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
