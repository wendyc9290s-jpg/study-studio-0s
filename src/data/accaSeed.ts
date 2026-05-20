import type { AccaState } from '../types';

// ACCA — Future Qualification (effective September 2027).
//
// Source: ACCA Global official redesign announcement.
// https://www.accaglobal.com/gb/en/campaigns/accountancy-redefined/future-acca-qualification.html
//
// Structure:
//   • Foundations level (optional entry, for those who don't meet minimum entry criteria)
//   • Knowledge level (3 mandatory exams + 1 EEM)
//   • Expertise level (5 mandatory exams + 1 EEM)
//   • Strategic Professional level (2 core + 1 option from 5 + 1 EEM + PER)
//
// Each level has an Essential Employability Module (EEM) — included here as
// special "papers" tagged in the notes, since they're a required component.
//
// Charlotte's situation: SIM × UoB BSc Accounting & Finance graduate.
// She will most likely enter at Knowledge level (meets minimum entry criteria
// via degree) with potential exemptions for K1 / K2 / K3 and possibly some
// Expertise papers — confirm with ACCA exemption tool when ready.

export const accaSeed: AccaState = {
  papers: [
    // ── Foundations level (entry route — likely exempted via degree) ──────
    {
      id: 'acca-f1', code: 'F1', name: 'Accounts Preparation',
      group: 'Foundations', status: 'not-started', priority: 'low',
      uobOverlap: [], examDate: '',
      notes: 'Foundations entry route — likely exempted via UoB degree. Skip if not required.',
    },
    {
      id: 'acca-f2', code: 'F2', name: 'Management Information and Costing',
      group: 'Foundations', status: 'not-started', priority: 'low',
      uobOverlap: [], examDate: '',
      notes: 'Foundations entry route — likely exempted via UoB degree.',
    },
    {
      id: 'acca-f3', code: 'F3', name: 'Decision Making with Data',
      group: 'Foundations', status: 'not-started', priority: 'low',
      uobOverlap: [], examDate: '',
      notes: 'Foundations entry route — likely exempted via UoB degree.',
    },

    // ── Knowledge level (3 mandatory) ─────────────────────────────────────
    // Recommended order: K1 → K2 → K3
    {
      id: 'acca-k1', code: 'K1', name: 'Financial Accounting',
      group: 'Knowledge', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-financial-reporting'], examDate: '',
      notes: 'Foundation for E2 Financial Reporting. Maps to UoB Financial Reporting — likely exemption available.',
    },
    {
      id: 'acca-k2', code: 'K2', name: 'Management Accounting',
      group: 'Knowledge', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-management-accounting'], examDate: '',
      notes: 'Foundation for E5 Performance with Data Analysis. Maps to UoB Management Accounting — likely exemption available.',
    },
    {
      id: 'acca-k3', code: 'K3', name: 'Business Law',
      group: 'Knowledge', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-business-law'], examDate: '',
      notes: 'Maps closely to UoB Business Law. Strong overlap; consider exemption.',
    },
    {
      id: 'acca-eem-k', code: 'EEM-K', name: 'Responsible Business Management',
      group: 'Knowledge', status: 'not-started', priority: 'medium',
      uobOverlap: [], examDate: '',
      notes: 'Essential Employability Module — required to complete Knowledge level. Awards Higher Diploma in Accounting and Business.',
    },

    // ── Expertise level (5 mandatory) ─────────────────────────────────────
    // Recommended order: E1 → E2 → E3 → E4 → E5
    // E4 and E5 may be completed via UoB BSc programme partnership.
    {
      id: 'acca-e1', code: 'E1', name: 'Taxation',
      group: 'Expertise', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-taxation'], examDate: '',
      notes: 'Replaces TX. Builds on UoB Taxation: Principles and Planning — but ACCA focus is UK-specific.',
    },
    {
      id: 'acca-e2', code: 'E2', name: 'Financial Reporting',
      group: 'Expertise', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-financial-reporting', 'y3-advanced-financial-accounting'], examDate: '',
      notes: 'Replaces FR. Core paper. Strong overlap with UoB FR + Advanced Financial Accounting.',
    },
    {
      id: 'acca-e3', code: 'E3', name: 'Audit, Risk and Control',
      group: 'Expertise', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-audit'], examDate: '',
      notes: 'Replaces AA + adds Risk and Control. Direct overlap with UoB Audit module.',
    },
    {
      id: 'acca-e4', code: 'E4', name: 'Finance and Investment',
      group: 'Expertise', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-corporate-finance', 'y3-advanced-finance'], examDate: '',
      notes: 'Replaces FM. Strong overlap with UoB Corporate Finance + Advanced Finance. May be completed via UoB BSc partnership.',
    },
    {
      id: 'acca-e5', code: 'E5', name: 'Performance with Data Analysis',
      group: 'Expertise', status: 'not-started', priority: 'high',
      uobOverlap: ['y2-management-accounting'], examDate: '',
      notes: 'NEW paper. Replaces PM with added data analytics focus. May be completed via UoB BSc partnership.',
    },
    {
      id: 'acca-eem-e', code: 'EEM-E', name: 'Digital Tech and Innovation',
      group: 'Expertise', status: 'not-started', priority: 'medium',
      uobOverlap: [], examDate: '',
      notes: 'Essential Employability Module — required to complete Expertise level. Awards Advanced Diploma in Accounting and Business.',
    },

    // ── Strategic Professional level (2 core) ─────────────────────────────
    {
      id: 'acca-s1', code: 'S1', name: 'Business and Sustainability Reporting',
      group: 'Strategic Professional', status: 'not-started', priority: 'high',
      uobOverlap: ['y3-advanced-financial-accounting'], examDate: '',
      notes: 'Core exam. Replaces SBR with added sustainability reporting focus. Pairs well with UoB Advanced Financial Accounting.',
    },
    {
      id: 'acca-s2', code: 'S2', name: 'Strategic Business Leader',
      group: 'Strategic Professional', status: 'not-started', priority: 'high',
      uobOverlap: ['y3-research-project'], examDate: '',
      notes: 'Core exam. Case study format. Apply strategic thinking developed in UoB Research Project.',
    },
    {
      id: 'acca-eem-s', code: 'EEM-S', name: 'Ethical, Sustainable Leadership',
      group: 'Strategic Professional', status: 'not-started', priority: 'medium',
      uobOverlap: [], examDate: '',
      notes: 'Essential Employability Module — required to complete Strategic Professional level. Together with PER, awards ACCA Qualification.',
    },

    // ── Strategic Professional Options (choose 1 of 5) ────────────────────
    // Charlotte will need to pick ONE option exam based on career direction.
    // Some jurisdictions require multiple options for audit/practice licences.
    {
      id: 'acca-saa', code: 'SAA', name: 'Audit and Assurance Professional',
      group: 'Strategic Professional Options', status: 'not-started', priority: 'medium',
      uobOverlap: ['y2-audit'], examDate: '',
      notes: 'Option exam. Replaces AAA. Choose if entering public accounting / assurance. Some jurisdictions may require this for audit licences.',
    },
    {
      id: 'acca-scf', code: 'SCF', name: 'Corporate Finance Professional',
      group: 'Strategic Professional Options', status: 'not-started', priority: 'medium',
      uobOverlap: ['y3-advanced-finance'], examDate: '',
      notes: 'Option exam. Replaces AFM. Strong fit with UoB Advanced Finance — recommended option if pursuing M&A, treasury, or investment banking.',
    },
    {
      id: 'acca-sds', code: 'SDS', name: 'Data Science Professional',
      group: 'Strategic Professional Options', status: 'not-started', priority: 'medium',
      uobOverlap: [], examDate: '',
      notes: 'Option exam. NEW — no current ACCA equivalent. Choose if pursuing analytics / fintech / data-driven finance roles.',
    },
    {
      id: 'acca-spi', code: 'SPI', name: 'Performance and Insights Professional',
      group: 'Strategic Professional Options', status: 'not-started', priority: 'medium',
      uobOverlap: ['y2-management-accounting'], examDate: '',
      notes: 'Option exam. Replaces APM. Strategic management accounting + business partnering.',
    },
    {
      id: 'acca-sta', code: 'STA', name: 'Taxation Advisory Professional',
      group: 'Strategic Professional Options', status: 'not-started', priority: 'medium',
      uobOverlap: ['y2-taxation'], examDate: '',
      notes: 'Option exam. Replaces ATX. Choose if pursuing tax advisory / planning roles.',
    },
  ],
};
