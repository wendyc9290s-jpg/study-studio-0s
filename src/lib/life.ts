export type LifeArea = 'mind' | 'dream' | 'joy';
export type LifeType = 'want_to_learn' | 'creator_idea' | 'money_idea' | 'dream' | 'joy' | 'random_thought';
export type LifeEnergy = 'low' | 'medium';
export type LifeStatus = 'inbox' | 'later' | 'done';

export type LifeEntry = {
  id: string;
  rawText: string;
  title: string;
  area: LifeArea;
  type: LifeType;
  mood: string;
  energy: LifeEnergy;
  status: LifeStatus;
  gentleSuggestion: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  archived: boolean;
};

const lowSuggestions = ['先不用做，先存起来就好', '只写一个小标题也算开始', '以后有精力再处理'];

const includesAny = (text: string, keywords: string[]): boolean => keywords.some((keyword) => text.includes(keyword));

export function classifyLifeEntry(text: string): Omit<LifeEntry, 'id' | 'createdAt' | 'updatedAt' | 'favorite' | 'archived'> {
  const normalized = text.trim().toLowerCase();
  let area: LifeArea = 'mind';
  let type: LifeType = 'random_thought';
  let status: LifeStatus = 'inbox';
  let energy: LifeEnergy = 'medium';
  let gentleSuggestion = '';

  if (includesAny(normalized, ['想学', '学习', '课程', '录课', '语言', '拉丁语', '英语', 'cfa', 'acca', '课件'])) {
    area = 'mind';
    type = 'want_to_learn';
  } else if (includesAny(normalized, ['小红书', '起号', '内容', '视频', '笔记', '卖课', '录课', '账号', '创作'])) {
    area = 'mind';
    type = 'creator_idea';
  } else if (includesAny(normalized, ['赚钱', '变现', '卖', '创业', '商业', '产品', '客户', '项目'])) {
    area = 'mind';
    type = 'money_idea';
  } else if (includesAny(normalized, ['想去', '旅行', '日本', '韩国', '城市', '体验', '以后想', '梦想'])) {
    area = 'dream';
    type = 'dream';
  } else if (includesAny(normalized, ['开心', '喜欢', '舒服', '被理解', '好看', '完成', '做出来', '答出来', '爽'])) {
    area = 'joy';
    type = 'joy';
  }

  if (includesAny(normalized, ['累', '没精力', '懒', '不想动', '焦虑', '烦', '压力'])) {
    energy = 'low';
    status = 'later';
    gentleSuggestion = lowSuggestions[Math.floor(Math.random() * lowSuggestions.length)] ?? lowSuggestions[0];
  }

  return {
    rawText: text.trim(),
    title: text.trim().slice(0, 20),
    area,
    type,
    mood: energy === 'low' ? 'heavy' : 'steady',
    energy,
    status,
    gentleSuggestion,
  };
}
