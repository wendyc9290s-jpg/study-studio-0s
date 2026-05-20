import type { AccaState } from '../types';

export const accaSeed: AccaState = {
  papers: [
    // ── Applied Knowledge ────────────────────────────────────────────────
    {
      id: 'acca-bt',  code: 'BT',  name: 'Business and Technology',
      group: 'Applied Knowledge', status: 'not-started', priority: 'medium',
      uobOverlap: ['y2-business-law'], examDate: '', notes: '',
    },
    {
      id: 'acca-ma',  code: 'MA',  name: 'Management Accounting',
      group: 'Applied Knowledge', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-management-accounting'], examDate: '', notes: 'Foundation of PM and APM. Maps closely to UoB Management Accounting.',
    },
    {
      id: 'acca-fa',  code: 'FA',  name: 'Financial Accounting',
      group: 'Applied Knowledge', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-financial-reporting'], examDate: '', notes: 'Foundation for FR and SBR. Overlaps directly with Financial Reporting module.',
    },

    // ── Applied Skills ───────────────────────────────────────────────────
    {
      id: 'acca-lw',  code: 'LW',  name: 'Corporate and Business Law',
      group: 'Applied Skills', status: 'not-started', priority: 'medium',
      uobOverlap: ['y2-business-law'], examDate: '', notes: 'Strong overlap with UoB Business Law — consider sitting early.',
    },
    {
      id: 'acca-pm',  code: 'PM',  name: 'Performance Management',
      group: 'Applied Skills', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-management-accounting'], examDate: '', notes: 'Advanced MA topics: advanced budgeting, performance measurement, decision-making.',
    },
    {
      id: 'acca-tx',  code: 'TX',  name: 'Taxation',
      group: 'Applied Skills', status: 'not-started', priority: 'medium',
      uobOverlap: ['y2-taxation'], examDate: '', notes: 'UK tax focus. Complements UoB Taxation module (SG/UK differences to note).',
    },
    {
      id: 'acca-fr',  code: 'FR',  name: 'Financial Reporting',
      group: 'Applied Skills', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-financial-reporting', 'y3-advanced-financial-accounting'], examDate: '', notes: 'Core paper. Prepare alongside UoB FR and before sitting SBR.',
    },
    {
      id: 'acca-aa',  code: 'AA',  name: 'Audit and Assurance',
      group: 'Applied Skills', status: 'not-started', priority: 'medium',
      uobOverlap: ['y2-audit'], examDate: '', notes: 'Direct overlap with UoB Audit module. Sits well alongside.',
    },
    {
      id: 'acca-fm',  code: 'FM',  name: 'Financial Management',
      group: 'Applied Skills', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-corporate-finance'], examDate: '', notes: 'Mirrors UoB Corporate Finance + treasury management. Prepares for AFM.',
    },

    // ── Strategic Professional (Essentials) ──────────────────────────────
    {
      id: 'acca-sbr', code: 'SBR', name: 'Strategic Business Reporting',
      group: 'Strategic Professional', status: 'not-started', priority: 'high',
      uobOverlap: ['y3-advanced-financial-accounting'], examDate: '', notes: 'Advanced FR + ethics. Pairs well with UoB Advanced Financial Accounting.',
    },
    {
      id: 'acca-sbl', code: 'SBL', name: 'Strategic Business Leadership',
      group: 'Strategic Professional', status: 'not-started', priority: 'high',
      uobOverlap: ['y3-research-project'], examDate: '', notes: 'Case study exam. Apply research and strategic thinking from UoB Research Project.',
    },

    // ── Strategic Professional (Optional — choose 2) ─────────────────────
    {
      id: 'acca-afm', code: 'AFM', name: 'Advanced Financial Management',
      group: 'Strategic Professional Optional', status: 'not-started', priority: 'high',
      uobOverlap: ['y3-advanced-finance'], examDate: '', notes: 'Recommended given UoB Advanced Finance overlap. Treasury, risk, M&A.',
    },
    {
      id: 'acca-apm', code: 'APM', name: 'Advanced Performance Management',
      group: 'Strategic Professional Optional', status: 'not-started', priority: 'medium',
      uobOverlap: ['y2-management-accounting'], examDate: '', notes: 'Strategic management accounting. Good complement to UoB MA track.',
    },
    {
      id: 'acca-atx', code: 'ATX', name: 'Advanced Taxation',
      group: 'Strategic Professional Optional', status: 'not-started', priority: 'low',
      uobOverlap: ['y2-taxation'], examDate: '', notes: 'UK advanced tax. Overlap with UoB Taxation limited to principles.',
    },
    {
      id: 'acca-aaa', code: 'AAA', name: 'Advanced Audit and Assurance',
      group: 'Strategic Professional Optional', status: 'not-started', priority: 'low',
      uobOverlap: ['y2-audit'], examDate: '', notes: 'Consider only if planning to enter public accounting/assurance.',
    },
  ],
};
