export type LifeArea = 'mind' | 'dream' | 'joy';
export type LifeType = 'want_to_learn' | 'creator_idea' | 'money_idea' | 'dream' | 'joy' | 'random_thought';
export type LifeEnergy = 'low' | 'medium';
export type LifeStatus = 'inbox' | 'later' | 'done';

export interface LifeEntry {
  id: string;
  rawText: string;
  title: string;
  area: LifeArea;
  type: LifeType;
  energy: LifeEnergy;
  status: LifeStatus;
  gentleSuggestion: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  archived: boolean;
}

export interface LifeState {
  entries: LifeEntry[];
}

const LOW_ENERGY_KEYWORDS = ['累', '好累', '没精力', '没动力', '不想动', '疲惫', '心累', '烦死了', '撑不住', 'tired', 'exhausted'];

const DREAM_KEYWORDS = [
  '梦想', '将来', '未来', '以后', '希望', '想成为', '目标', '有一天', '总有一天',
  '想去', '想学', '想做', '想尝试', '想拥有', '想要成为',
  'dream', 'someday', 'one day', 'goal', 'aspire', 'want to be', 'plan to',
];

const JOY_KEYWORDS = [
  '开心', '快乐', '好玩', '有趣', '喜欢', '爱', '超棒', '太好了', '高兴',
  '幸福', '满足', '享受', '哈哈', '哈哈哈', '哇', '好喜欢', '真的很喜欢',
  'love', 'fun', 'happy', 'joy', 'excited', 'amazing', 'awesome', 'delightful',
];

const LEARN_KEYWORDS = ['学', '学习', '想学', '了解', '研究', 'learn', 'study', 'understand', 'explore'];
const CREATOR_KEYWORDS = ['做', '创作', '写', '画', '设计', '拍', '录', 'create', 'make', 'write', 'design', 'build'];
const MONEY_KEYWORDS = ['钱', '赚', '收入', '副业', '投资', '创业', 'money', 'earn', 'income', 'invest', 'startup', 'side hustle'];

const GENTLE_SUGGESTIONS: Record<string, string> = {
  mind: 'This thought is safe here. Rest when you need to.',
  dream: 'Even small steps count. No pressure — just keep dreaming.',
  joy: 'Hold onto this feeling. You deserve joy.',
};

function hasKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

function inferArea(text: string): LifeArea {
  if (hasKeyword(text, DREAM_KEYWORDS)) return 'dream';
  if (hasKeyword(text, JOY_KEYWORDS)) return 'joy';
  return 'mind';
}

function inferType(text: string, area: LifeArea): LifeType {
  if (area === 'joy') return 'joy';
  if (area === 'dream') return 'dream';
  if (hasKeyword(text, LEARN_KEYWORDS)) return 'want_to_learn';
  if (hasKeyword(text, MONEY_KEYWORDS)) return 'money_idea';
  if (hasKeyword(text, CREATOR_KEYWORDS)) return 'creator_idea';
  return 'random_thought';
}

function deriveTitle(text: string): string {
  const cleaned = text.trim().replace(/\n/g, ' ');
  if (cleaned.length <= 48) return cleaned;
  const cut = cleaned.slice(0, 46).trimEnd();
  return cut + '…';
}

export function classifyLifeEntry(text: string): Omit<LifeEntry, 'id' | 'createdAt' | 'updatedAt' | 'favorite' | 'archived'> {
  const isLowEnergy = hasKeyword(text, LOW_ENERGY_KEYWORDS);
  const area = inferArea(text);
  const type = inferType(text, area);
  const energy: LifeEnergy = isLowEnergy ? 'low' : 'medium';
  const status: LifeStatus = isLowEnergy ? 'later' : 'inbox';
  const gentleSuggestion = isLowEnergy ? GENTLE_SUGGESTIONS[area] : '';

  return {
    rawText: text,
    title: deriveTitle(text),
    area,
    type,
    energy,
    status,
    gentleSuggestion,
  };
}

export function createEntry(text: string): LifeEntry {
  const classified = classifyLifeEntry(text);
  const now = new Date().toISOString();
  return {
    ...classified,
    id: `life-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
    favorite: false,
    archived: false,
  };
}
