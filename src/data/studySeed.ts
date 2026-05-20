export type Topic = { id: string; text: string; done: boolean };
export type ResourceItem = { id: string; title: string; url: string; type: 'youtube' | 'bilibili' | 'pdf' | 'web' | 'note'; addedAt: string };
export type Course = {
  id: string;
  name: string;
  year: 'Year 2' | 'Year 3';
  blurb: string;
  examRelevance: 'low' | 'medium' | 'high';
  status: 'not-started' | 'previewing' | 'studying' | 'done';
  confidence: number;
  keyTopics: Topic[];
  resources: ResourceItem[];
  notes: string;
};

export type StudyState = {
  programme: {
    name: string;
    partner: string;
    structure: string;
    credits_per_year: number;
  };
  courses: Course[];
};

const topicify = (courseId: string, topics: string[]): Topic[] => topics.map((text, index) => ({ id: `${courseId}-t${index + 1}`, text, done: false }));

export const studySeed: StudyState = {
  programme: {
    name: 'BSc (Hons) Accounting and Finance',
    partner: 'SIM Global Education × University of Birmingham',
    structure: '2-year top-up; Year 2 = 25% of final, Year 3 = 75%',
    credits_per_year: 120,
  },
  courses: [
    { id: 'y2-financial-reporting', name: 'Financial Reporting', year: 'Year 2', blurb: 'How companies prepare and present financial statements under IFRS — the language of corporate accounting.', examRelevance: 'high', status: 'not-started', confidence: 0, keyTopics: topicify('y2-financial-reporting', ['IFRS framework', 'Income statement & balance sheet preparation', 'Statement of cash flows', 'Revenue recognition (IFRS 15)', 'Inventories, PPE, intangibles', 'Group accounts / consolidation basics']), resources: [], notes: '' },
    { id: 'y2-management-accounting', name: 'Management Accounting', year: 'Year 2', blurb: 'Accounting for internal decision-making: costing, budgeting, and performance measurement.', examRelevance: 'high', status: 'not-started', confidence: 0, keyTopics: topicify('y2-management-accounting', ['Cost classification & behaviour', 'Absorption vs marginal costing', 'CVP analysis', 'Budgeting & variance analysis', 'Standard costing', 'Short-term decision-making']), resources: [], notes: '' },
    { id: 'y2-corporate-finance', name: 'Corporate Finance', year: 'Year 2', blurb: 'How firms make investment, financing, and dividend decisions to maximise value.', examRelevance: 'high', status: 'not-started', confidence: 0, keyTopics: topicify('y2-corporate-finance', ['Time value of money', 'NPV, IRR, payback', 'Risk and return / CAPM', 'Cost of capital (WACC)', 'Capital structure', 'Dividend policy']), resources: [], notes: '' },
    { id: 'y2-audit', name: 'Audit', year: 'Year 2', blurb: 'How auditors gather evidence to express an opinion on whether financial statements are fairly presented.', examRelevance: 'medium', status: 'not-started', confidence: 0, keyTopics: topicify('y2-audit', ['Assurance & audit objectives', 'Audit risk model', 'Materiality', 'Internal control', 'Audit evidence & sampling', 'Audit opinion & reports', 'Professional ethics']), resources: [], notes: '' },
    { id: 'y2-taxation', name: 'Taxation: Principles and Planning', year: 'Year 2', blurb: 'Foundations of tax: how individuals and companies are taxed, and basic planning principles.', examRelevance: 'medium', status: 'not-started', confidence: 0, keyTopics: topicify('y2-taxation', ['Tax residency', 'Individual income tax', 'Corporate income tax', 'GST / VAT basics', 'Tax filing & compliance', 'Basic tax planning principles']), resources: [], notes: '' },
    { id: 'y2-business-law', name: 'Business Law', year: 'Year 2', blurb: 'Legal framework for business: contract, agency, company law. Already familiar from prior study.', examRelevance: 'low', status: 'previewing', confidence: 2, keyTopics: topicify('y2-business-law', ['Contract law', 'Tort & negligence', 'Agency', 'Partnership & company law', 'Employment basics']), resources: [], notes: 'Already covered in earlier studies — quick review only.' },
    { id: 'y3-advanced-finance', name: 'Advanced Finance', year: 'Year 3', blurb: 'Builds on Corporate Finance: advanced valuation, M&A, risk management, international finance.', examRelevance: 'high', status: 'not-started', confidence: 0, keyTopics: [], resources: [], notes: '' },
    { id: 'y3-advanced-financial-accounting', name: 'Advanced Financial Accounting Practice and Theory', year: 'Year 3', blurb: 'Advanced reporting topics and the theoretical underpinnings of accounting standards.', examRelevance: 'high', status: 'not-started', confidence: 0, keyTopics: [], resources: [], notes: '' },
    { id: 'y3-research-project', name: 'Accounting and Finance Research Project', year: 'Year 3', blurb: 'Independent research project applying theory and analytical skills to a chosen AF topic.', examRelevance: 'high', status: 'not-started', confidence: 0, keyTopics: [], resources: [], notes: '' },
    { id: 'y3-optional', name: 'Optional Module Slot', year: 'Year 3', blurb: 'Placeholder for Year 3 elective — to be selected closer to the time.', examRelevance: 'low', status: 'not-started', confidence: 0, keyTopics: [], resources: [], notes: '' },
  ],
};
