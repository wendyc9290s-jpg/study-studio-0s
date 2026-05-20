import type { PlanState } from '../types';

function tasks(weekId: string, texts: string[]) {
  return texts.map((text, i) => ({ id: `${weekId}-t${i}`, text, done: false }));
}

export const planSeed: PlanState = {
  weeks: [
    // ── Phase 1: Accounting Foundation (Weeks 1–4) ───────────────────────
    {
      id: 'w01', weekNumber: 1, phase: 1, title: 'FR — IFRS Framework & Conceptual Basis',
      goals: ['Understand why IFRS exists and its conceptual framework', 'Know the qualitative characteristics of useful financial information'],
      tasks: tasks('w01', [
        'Read IFRS Conceptual Framework (chapter summaries)',
        'Note the 4 qualitative characteristics and enhancing characteristics',
        'Understand the elements of financial statements',
        'Complete 10 ACCA FR-style MCQs on the framework',
        'Add notes to Financial Reporting course card',
      ]),
    },
    {
      id: 'w02', weekNumber: 2, phase: 1, title: 'FR — Income Statement, Balance Sheet & Cash Flows',
      goals: ['Prepare a basic income statement and statement of financial position', 'Understand the indirect method for cash flow statements'],
      tasks: tasks('w02', [
        'Prepare a practice income statement from trial balance',
        'Practice adjusting entries: accruals, prepayments, depreciation',
        'Work through indirect method cash flow statement step-by-step',
        'Revise IAS 7 — Statement of Cash Flows',
        'Complete 2 past exam-style questions (full statements)',
      ]),
    },
    {
      id: 'w03', weekNumber: 3, phase: 1, title: 'MA — Cost Classification & Costing Methods',
      goals: ['Classify costs by behaviour, function, and nature', 'Contrast absorption and marginal costing approaches'],
      tasks: tasks('w03', [
        'Classify a list of 20 costs into fixed/variable/semi-variable',
        'Calculate profit under absorption costing vs marginal costing',
        'Reconcile the profit difference between the two methods',
        'Work through an ABC (activity-based costing) example',
        'Review OpenTuition MA lecture notes (chapters 1–4)',
      ]),
    },
    {
      id: 'w04', weekNumber: 4, phase: 1, title: 'MA — CVP, Budgeting & Variance Analysis',
      goals: ['Calculate break-even point and margin of safety', 'Prepare a flexed budget and compute key variances'],
      tasks: tasks('w04', [
        'Calculate break-even units and revenue for a given scenario',
        'Draw a profit-volume chart',
        'Prepare a flexible budget from actual vs original data',
        'Calculate material price, usage, labour rate, efficiency variances',
        'Practice writing up a short variance report',
      ]),
    },

    // ── Phase 2: Finance + Excel Skills (Weeks 5–9) ──────────────────────
    {
      id: 'w05', weekNumber: 5, phase: 2, title: 'CF — Time Value of Money & Investment Appraisal',
      goals: ['Apply PV, FV, annuity formulae confidently', 'Evaluate projects using NPV, IRR, and payback'],
      tasks: tasks('w05', [
        'Solve 10 TVM problems (PV, FV, annuity, perpetuity)',
        'Build a DCF model in Excel for a simple capital project',
        'Calculate NPV and IRR for a 5-year project manually',
        'Compare IRR vs NPV decision criteria for mutually exclusive projects',
        'Review WACC as the discount rate concept',
      ]),
    },
    {
      id: 'w06', weekNumber: 6, phase: 2, title: 'CF — Risk, Return & CAPM',
      goals: ['Calculate expected return and standard deviation of a portfolio', 'Apply CAPM to derive required return for a risky asset'],
      tasks: tasks('w06', [
        'Calculate expected return, variance, and SD from probability table',
        'Compute portfolio return and variance for a 2-asset portfolio',
        'Use CAPM: E(R) = Rf + β(Rm − Rf) for several scenarios',
        'Understand systematic vs unsystematic risk',
        'Read Brealey Myers Chapter 8 (Risk and Return)',
      ]),
    },
    {
      id: 'w07', weekNumber: 7, phase: 2, title: 'CF — Capital Structure, WACC & Dividend Policy',
      goals: ['Calculate WACC using market values', 'Understand the MM propositions on capital structure and dividends'],
      tasks: tasks('w07', [
        'Calculate WACC for a firm with debt, preference shares, and equity',
        'Apply Modigliani-Miller Proposition I and II (with tax)',
        'Discuss the trade-off theory and pecking order theory',
        'Work through a dividend policy question: Gordon Growth Model',
        'Practice a full integrated CF past question',
      ]),
    },
    {
      id: 'w08', weekNumber: 8, phase: 2, title: 'Excel Skills — Financial Modelling Basics',
      goals: ['Build structured financial models in Excel', 'Use key Excel functions for finance: NPV, IRR, XNPV, INDEX/MATCH'],
      tasks: tasks('w08', [
        'Build a 3-statement model (IS, BS, CF) skeleton in Excel',
        'Practice NPV() and IRR() functions with a project scenario',
        'Learn VLOOKUP / INDEX-MATCH for data lookup',
        'Build a DCF valuation template from scratch',
        'Explore chandoo.org Excel for Finance course (2 lessons)',
      ]),
    },
    {
      id: 'w09', weekNumber: 9, phase: 2, title: 'Excel + CF Integration & Catch-up',
      goals: ['Link Excel skills to CF and FR problems', 'Review and catch up on weeks 5–8'],
      tasks: tasks('w09', [
        'Build a loan amortisation schedule in Excel',
        'Create a ratio analysis dashboard for a sample company',
        'Revisit any weak area from weeks 5–8',
        'Mark key topics as done in course cards',
        'Do a timed 30-minute mixed quiz: CF + MA topics',
      ]),
    },

    // ── Phase 3: Audit & Tax Preview (Weeks 10–12) ───────────────────────
    {
      id: 'w10', weekNumber: 10, phase: 3, title: 'Audit — Risk Model & Materiality',
      goals: ['Apply the audit risk model to a scenario', 'Set and justify planning materiality'],
      tasks: tasks('w10', [
        'Learn the components of audit risk: inherent, control, detection',
        'Read IAASB ISA 315 summary — identifying material misstatements',
        'Practice materiality calculation: 5% profit, 0.5% revenue benchmarks',
        'Work through an audit risk scenario question',
        'Add key topics to Audit course card and mark as previewing',
      ]),
    },
    {
      id: 'w11', weekNumber: 11, phase: 3, title: 'Audit — Evidence, Controls & Reports',
      goals: ['Select appropriate audit procedures for assertions', 'Understand when to modify an audit opinion'],
      tasks: tasks('w11', [
        'List 5 audit procedures for each of: revenue, receivables, inventory',
        'Understand AEIOU mnemonic for audit evidence quality',
        'Distinguish qualified, adverse, and disclaimer of opinion',
        'Review IESBA Code independence threats and safeguards',
        'Complete 1 full Audit exam question (mark and self-review)',
      ]),
    },
    {
      id: 'w12', weekNumber: 12, phase: 3, title: 'Taxation — Individual, Corporate & GST',
      goals: ['Calculate basic individual income tax liability', 'Compute a company\'s chargeable profit and tax payable'],
      tasks: tasks('w12', [
        'Work through an individual income tax computation (employment income)',
        'Calculate capital gains tax on a disposal of shares',
        'Compute corporate tax: trading profit adjustments, capital allowances',
        'Understand GST / VAT input and output tax mechanics',
        'Add notes on tax planning principles to Taxation course card',
      ]),
    },

    // ── Phase 4: Revision & Project Preparation (Weeks 13–16) ───────────
    {
      id: 'w13', weekNumber: 13, phase: 4, title: 'Revision — Financial Reporting Deep Dive',
      goals: ['Consolidate FR knowledge: from framework to group accounts', 'Practise exam-style questions under timed conditions'],
      tasks: tasks('w13', [
        'Attempt a full FR past paper (3 hours) under exam conditions',
        'Mark and analyse errors — log weak topics',
        'Revise IFRS 15, IAS 2, IAS 16, IAS 36, IFRS 10',
        'Create a one-page cheat sheet for key FR adjustments',
        'Update FR course card confidence rating',
      ]),
    },
    {
      id: 'w14', weekNumber: 14, phase: 4, title: 'Revision — MA & CF Consolidation',
      goals: ['Consolidate MA costing and variance analysis', 'Review CF investment appraisal and WACC'],
      tasks: tasks('w14', [
        'Attempt a full MA past paper under timed conditions',
        'Attempt a full CF past paper under timed conditions',
        'Revisit weakest topics from each (variance analysis and WACC)',
        'Build a summary table: MA decision rules, CF appraisal methods',
        'Update both course cards: status and confidence',
      ]),
    },
    {
      id: 'w15', weekNumber: 15, phase: 4, title: 'Research Project — Scoping & Literature',
      goals: ['Define a provisional research question for the Year 3 project', 'Survey available academic literature on the chosen topic'],
      tasks: tasks('w15', [
        'Brainstorm 5 possible research topics in AF',
        'Narrow to 1 research question using SMART criteria',
        'Search Google Scholar for 5 relevant academic papers',
        'Write a 300-word project rationale',
        'Update Research Project course card with scoping notes',
      ]),
    },
    {
      id: 'w16', weekNumber: 16, phase: 4, title: 'Reset Week — Review & Plan Semester',
      goals: ['Consolidate all progress and rest', 'Set semester study targets and schedule'],
      tasks: tasks('w16', [
        'Review all course card statuses and confidence ratings',
        'Identify top 3 weakest topics across all Year 2 modules',
        'Create a semester study schedule (2-3 subjects per week)',
        'Set CFA and ACCA goals: which papers/levels to target first',
        'Rest — no heavy study. Light review only.',
      ]),
    },
  ],
};
