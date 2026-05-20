import type { LibraryState } from '../types';

export const resourceSeed: LibraryState = {
  resources: [
    // ── YouTube / Video ──────────────────────────────────────────────────
    { id: 'r01', title: 'OpenTuition — ACCA FR Full Lecture Series', url: 'https://opentuition.com/acca/fr/', type: 'youtube', tags: ['IFRS', 'financial statements', 'consolidation'], modules: ['y2-financial-reporting', 'acca-fr'], done: false, notes: 'Free and excellent. Work through alongside Kaplan text.' },
    { id: 'r02', title: 'OpenTuition — ACCA MA Lectures', url: 'https://opentuition.com/acca/ma/', type: 'youtube', tags: ['costing', 'budgeting', 'variance'], modules: ['y2-management-accounting', 'acca-ma'], done: false, notes: '' },
    { id: 'r03', title: 'OpenTuition — ACCA AA Lectures', url: 'https://opentuition.com/acca/aa/', type: 'youtube', tags: ['audit risk', 'evidence', 'reporting'], modules: ['y2-audit', 'acca-aa'], done: false, notes: '' },
    { id: 'r04', title: 'OpenTuition — ACCA FM Lectures', url: 'https://opentuition.com/acca/fm/', type: 'youtube', tags: ['NPV', 'WACC', 'capital structure'], modules: ['y2-corporate-finance', 'acca-fm'], done: false, notes: 'Strong overlap with Corporate Finance module.' },
    { id: 'r05', title: 'IFT — CFA Level I Lectures (Ethics + Quant)', url: 'https://ift.world/cfa-level-1/', type: 'youtube', tags: ['CFA L1', 'ethics', 'quantitative methods'], modules: ['l1-ethics', 'l1-quant'], done: false, notes: 'IFT is one of the best free CFA prep providers.' },
    { id: 'r06', title: 'Khan Academy — Finance & Capital Markets', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance', type: 'youtube', tags: ['TVM', 'bonds', 'stocks', 'derivatives'], modules: ['y2-corporate-finance', 'l1-fi', 'l1-equity'], done: false, notes: 'Great for building intuition. Use as a supplement.' },
    { id: 'r07', title: 'Bilibili — CFA备考全攻略 (CFA Prep in Chinese)', url: 'https://www.bilibili.com', type: 'bilibili', tags: ['CFA L1', 'Chinese', 'overview'], modules: ['l1-ethics', 'l1-fsa'], done: false, notes: 'Search "CFA一级" on Bilibili for relevant playlists.' },
    { id: 'r08', title: 'Bilibili — ACCA FR备考讲解', url: 'https://www.bilibili.com', type: 'bilibili', tags: ['ACCA FR', 'Chinese', 'IFRS'], modules: ['y2-financial-reporting', 'acca-fr'], done: false, notes: 'Search "ACCA FR 讲解" — multiple full-course uploads.' },

    // ── PDF / Textbooks ──────────────────────────────────────────────────
    { id: 'r09', title: 'ACCA FR Study Text — Kaplan Publishing', url: 'https://www.kaplanpublishing.co.uk/acca', type: 'pdf', tags: ['IFRS', 'FR', 'exam prep'], modules: ['y2-financial-reporting', 'acca-fr'], done: false, notes: 'Core textbook. Read chapters before attempting questions.' },
    { id: 'r10', title: 'ACCA FM Study Text — Kaplan Publishing', url: 'https://www.kaplanpublishing.co.uk/acca', type: 'pdf', tags: ['corporate finance', 'WACC', 'NPV'], modules: ['y2-corporate-finance', 'acca-fm'], done: false, notes: '' },
    { id: 'r11', title: 'ACCA MA Study Text — BPP Learning Media', url: 'https://www.bpp.com/acca', type: 'pdf', tags: ['management accounting', 'costing', 'budgeting'], modules: ['y2-management-accounting', 'acca-ma'], done: false, notes: '' },
    { id: 'r12', title: 'Brealey, Myers & Allen — Principles of Corporate Finance (13e)', url: 'https://www.mheducation.com', type: 'pdf', tags: ['corporate finance', 'valuation', 'M&A'], modules: ['y2-corporate-finance', 'y3-advanced-finance', 'l1-corp'], done: false, notes: 'The bible of corporate finance. Read selectively for key chapters.' },
    { id: 'r13', title: 'CFA Institute — Official Curriculum Level I (Vol 1–6)', url: 'https://www.cfainstitute.org/en/programs/cfa/curriculum', type: 'pdf', tags: ['CFA L1', 'official', 'all topics'], modules: ['l1-ethics', 'l1-fsa', 'l1-equity', 'l1-fi', 'l1-pm'], done: false, notes: 'Official source. Dense but authoritative.' },

    // ── Web References ───────────────────────────────────────────────────
    { id: 'r14', title: 'IFRS Foundation — Issued Standards', url: 'https://www.ifrs.org/issued-standards/list-of-standards/', type: 'web', tags: ['IFRS', 'standards reference', 'IAS', 'IFRS S1'], modules: ['y2-financial-reporting', 'y3-advanced-financial-accounting'], done: false, notes: 'Primary source for all IFRS/IAS standards text.' },
    { id: 'r15', title: 'Investopedia — Finance & Accounting Reference', url: 'https://www.investopedia.com', type: 'web', tags: ['concepts', 'definitions', 'CFA', 'quick reference'], modules: ['y2-corporate-finance', 'l1-equity', 'l1-fi'], done: false, notes: 'Quick concept lookup. Not a study resource on its own.' },
    { id: 'r16', title: 'ACCA Global — Past Papers & Marking Schemes', url: 'https://www.accaglobal.com/gb/en/student/exam-support-resources.html', type: 'web', tags: ['past papers', 'ACCA', 'exam prep'], modules: ['acca-fr', 'acca-aa', 'acca-fm', 'acca-pm'], done: false, notes: 'Free past papers and examiner reports. Essential for exam prep.' },
    { id: 'r17', title: 'CFA Institute — Practice Problems', url: 'https://www.cfainstitute.org/en/programs/cfa/exam/prepare', type: 'web', tags: ['CFA', 'practice', 'mock exam'], modules: ['l1-ethics', 'l1-quant', 'l1-fsa', 'l1-pm'], done: false, notes: 'QBank and mock exams. Critical for the last 6 weeks of prep.' },

    // ── Excel ────────────────────────────────────────────────────────────
    { id: 'r18', title: 'Chandoo — Excel for Finance (Blog + Courses)', url: 'https://chandoo.org/wp/excel-for-finance/', type: 'excel', tags: ['Excel', 'modelling', 'finance'], modules: [], done: false, notes: 'Excellent Excel tutorials specifically for financial analysts.' },
    { id: 'r19', title: 'Corporate Finance Institute — Excel Crash Course', url: 'https://corporatefinanceinstitute.com/resources/excel/', type: 'excel', tags: ['Excel', 'financial modelling', 'CFI'], modules: ['y2-corporate-finance'], done: false, notes: 'Free crash course covering the key Excel functions for finance.' },
    { id: 'r20', title: 'Breaking Into Wall Street — Excel & Financial Modelling', url: 'https://breakingintowallstreet.com', type: 'excel', tags: ['Excel', 'DCF', 'LBO', 'modelling'], modules: ['y2-corporate-finance', 'y3-advanced-finance'], done: false, notes: 'Premium but worth it if targeting investment banking/PE. Free samples available.' },
  ],
};
