import type { CfaState, CfaTopic } from '../types';

// CFA Program — based on official 2026 curriculum from CFA Institute.
// • Level I & II: 10 topics each, weights as ranges (official 2026 values).
// • Level III (restructured in 2025): Core (5 topics, ~65–70%) + one Specialized Pathway
//   chosen at registration (~30–35%). Three pathways exist:
//     – Portfolio Management
//     – Private Wealth
//     – Private Markets
//   Pathway is left as a placeholder for now — to be filled once Charlotte decides.

function items(topicId: string, texts: string[]) {
  return texts.map((text, i) => ({ id: `${topicId}-i${i}`, text, done: false }));
}

function topic(
  id: string,
  level: CfaTopic['level'],
  name: string,
  wMin: number,
  wMax: number,
  uobOverlap: string[],
  itemTexts: string[],
): CfaTopic {
  return {
    id,
    level,
    name,
    examWeightMin: wMin,
    examWeightMax: wMax,
    status: 'not-started',
    confidence: 0,
    uobOverlap,
    items: items(id, itemTexts),
    notes: '',
  };
}

export const cfaSeed: CfaState = {
  topics: [
    // ── Level I — 10 topics, 93 Learning Modules ────────────────────────────
    //    Tests: foundational knowledge across all 10 topics
    //    Format: 2 sessions × 90 multiple-choice questions
    topic('l1-ethics', 'I', 'Ethical & Professional Standards', 15, 20, ['y2-audit'], [
      'Code of Ethics — six components',
      'Standard I: Professionalism',
      'Standard II: Integrity of Capital Markets',
      'Standard III: Duties to Clients',
      'Standard IV: Duties to Employers',
      'Standard V: Investment Analysis, Recommendations & Actions',
      'Standard VI: Conflicts of Interest',
      'Standard VII: Responsibilities as a CFA Institute Member or Candidate',
      'Global Investment Performance Standards (GIPS) — introduction',
    ]),

    topic('l1-quant', 'I', 'Quantitative Methods', 6, 9, ['y2-corporate-finance'], [
      'Time value of money: PV, FV, annuities, perpetuities',
      'Statistical concepts & market returns',
      'Probability concepts & Bayes\' theorem',
      'Common probability distributions: normal, binomial, lognormal',
      'Sampling & estimation; central limit theorem',
      'Hypothesis testing fundamentals',
      'Introduction to linear regression',
    ]),

    topic('l1-econ', 'I', 'Economics', 6, 9, [], [
      'Topics in demand & supply analysis',
      'Firm structures & market organisation',
      'Aggregate output, prices & economic growth',
      'Business cycles',
      'Monetary & fiscal policy',
      'International trade & capital flows',
      'Currency exchange rates — basics',
    ]),

    topic('l1-fsa', 'I', 'Financial Statement Analysis', 11, 14, ['y2-financial-reporting', 'y2-management-accounting'], [
      'Introduction to financial statement analysis',
      'Analysing income statements',
      'Analysing balance sheets',
      'Analysing statements of cash flows',
      'Analysis of inventories',
      'Analysis of long-lived assets',
      'Analysis of income taxes',
      'Analysis of non-current liabilities',
      'Financial reporting quality',
      'Financial analysis techniques & ratio analysis',
    ]),

    topic('l1-corp', 'I', 'Corporate Issuers', 6, 9, ['y2-corporate-finance'], [
      'Organisational forms, corporate issuer features & ownership',
      'Investors & other stakeholders',
      'Corporate governance: conflicts, mechanisms & risks',
      'Working capital & liquidity',
      'Capital investments & capital allocation',
      'Capital structure',
      'Business models',
    ]),

    topic('l1-equity', 'I', 'Equity Investments', 11, 14, ['y2-corporate-finance'], [
      'Market organisation & structure',
      'Security market indexes',
      'Market efficiency',
      'Overview of equity securities',
      'Company analysis: past & present',
      'Industry & competitive analysis',
      'Company analysis: forecasting',
      'Equity valuation: concepts & basic tools',
      'Company analysis: financial modelling',
    ]),

    topic('l1-fi', 'I', 'Fixed Income', 11, 14, ['y2-corporate-finance'], [
      'Fixed-income instrument features',
      'Fixed-income cash flows & types',
      'Fixed-income issuance, trading & funding',
      'Fixed-income markets for corporate issuers',
      'Fixed-income markets for government issuers',
      'Fixed-income bond valuation: prices & yields',
      'Yield & yield spread measures',
      'The term structure of interest rates',
      'Interest rate risk & return',
      'Yield-based bond duration measures & properties',
      'Yield-based bond convexity & portfolio properties',
      'Curve-based & empirical fixed-income risk measures',
      'Credit risk',
      'Credit analysis for government issuers',
      'Credit analysis for corporate issuers',
      'Fixed-income securitisation & ABS',
    ]),

    topic('l1-deriv', 'I', 'Derivatives', 5, 8, [], [
      'Derivative instrument & derivative market features',
      'Forward commitment & contingent claim features and instruments',
      'Derivative benefits, risks & issuer/investor uses',
      'Arbitrage, replication & the cost of carry in pricing derivatives',
      'Pricing & valuation of forward contracts and underlying assets',
      'Pricing & valuation of futures contracts',
      'Pricing & valuation of interest rate & other swaps',
      'Pricing & valuation of options',
      'Option replication using put-call parity',
      'Valuing a derivative using a one-period binomial model',
    ]),

    topic('l1-alts', 'I', 'Alternative Investments', 7, 10, [], [
      'Alternative investment features, methods & structures',
      'Alternative investment performance & returns',
      'Investments in private capital: equity & debt',
      'Real estate & infrastructure',
      'Natural resources',
      'Hedge funds',
      'Introduction to digital assets',
    ]),

    topic('l1-pm', 'I', 'Portfolio Management', 8, 12, ['y2-corporate-finance'], [
      'Portfolio risk & return: Part I (single & two-asset portfolios)',
      'Portfolio risk & return: Part II (CAPM, beta, SML)',
      'Portfolio management: an overview',
      'Basics of portfolio planning & construction',
      'The behavioural biases of individuals',
      'Introduction to risk management',
    ]),

    // ── Level II — 10 topics, 45 Learning Modules ──────────────────────────
    //    Tests: application & analysis via item-set (vignette) questions
    //    Format: 2 sessions × 44 questions in item-set format
    //    5 topics at 10–15%; 5 topics at 5–10%
    topic('l2-ethics', 'II', 'Ethical & Professional Standards', 10, 15, ['y2-audit'], [
      'Code of Ethics & Standards — application to complex scenarios',
      'Soft dollar standards & trade allocation',
      'Asset Manager Code of Professional Conduct',
      'GIPS verification, compliance & composite construction',
    ]),

    topic('l2-quant', 'II', 'Quantitative Methods', 5, 10, [], [
      'Basics of multiple regression',
      'Evaluating regression model fit',
      'Model misspecification',
      'Time-series analysis: AR, MA, ARMA, ARCH',
      'Machine learning in finance — supervised, unsupervised, deep learning',
      'Big data projects in investment research',
    ]),

    topic('l2-econ', 'II', 'Economics', 5, 10, [], [
      'Currency exchange rates: interest rate parity & forward rates',
      'Economic growth & investment decisions',
      'Economics of regulation',
    ]),

    topic('l2-fsa', 'II', 'Financial Statement Analysis', 10, 15, ['y2-financial-reporting', 'y3-advanced-financial-accounting'], [
      'Intercorporate investments — equity, consolidation, joint ventures',
      'Employee compensation: post-employment & share-based',
      'Multinational operations & foreign currency translation',
      'Analysis of financial institutions',
      'Evaluating quality of financial reports',
      'Integration of financial statement analysis techniques',
    ]),

    topic('l2-corp', 'II', 'Corporate Issuers', 5, 10, ['y2-corporate-finance'], [
      'Analysis of dividends & share repurchases',
      'Cost of capital — advanced topics',
      'ESG considerations in investment analysis',
      'Mergers & acquisitions and corporate restructuring',
    ]),

    topic('l2-equity', 'II', 'Equity Investments', 10, 15, ['y2-corporate-finance', 'y3-advanced-finance'], [
      'Equity valuation: applications & processes',
      'Discounted dividend valuation (DDM)',
      'Free cash flow valuation (FCFF & FCFE)',
      'Market-based valuation: price & enterprise value multiples',
      'Residual income valuation',
      'Private company valuation',
    ]),

    topic('l2-fi', 'II', 'Fixed Income', 10, 15, ['y2-corporate-finance', 'y3-advanced-finance'], [
      'The term structure & interest rate dynamics',
      'The arbitrage-free valuation framework',
      'Valuation & analysis of bonds with embedded options',
      'Credit analysis models',
      'Credit default swaps',
    ]),

    topic('l2-deriv', 'II', 'Derivatives', 5, 10, [], [
      'Pricing & valuation of forward commitments — advanced',
      'Valuation of contingent claims (binomial, Black-Scholes-Merton)',
      'Derivatives strategies for managing market exposure',
    ]),

    topic('l2-alts', 'II', 'Alternative Investments', 5, 10, [], [
      'Private equity investments — strategies & valuation',
      'Real estate investments — direct & indirect',
      'Hedge fund strategies',
      'Commodities & commodity derivatives',
    ]),

    topic('l2-pm', 'II', 'Portfolio Management', 10, 15, ['y3-advanced-finance'], [
      'Exchange-traded funds — structure & uses',
      'Using multifactor models',
      'Measuring & managing market risk',
      'Backtesting & simulation',
      'Economics & investment markets — linkage',
      'Analysis of active portfolio management',
      'Trading costs & electronic markets',
    ]),

    // ── Level III — restructured in 2025 ───────────────────────────────────
    //    65–70%: Common Core (5 topics, 22 readings)
    //    30–35%: Specialized Pathway (choose 1 of 3 at registration)
    //
    //    Pathway is NOT seeded — Charlotte to decide later.
    //    Three options: Portfolio Management | Private Wealth | Private Markets
    //    Pathway choice is locked after the 14-day registration cooling-off period.
    topic('l3-aa', 'III', 'Asset Allocation', 15, 20, ['y3-advanced-finance'], [
      'Capital market expectations: framework & macro considerations',
      'Capital market expectations: forecasting asset class returns',
      'Overview of asset allocation',
      'Principles of asset allocation',
      'Asset allocation with real-world constraints',
    ]),

    topic('l3-pc', 'III', 'Portfolio Construction', 15, 20, ['y3-advanced-finance'], [
      'Overview of equity portfolio management',
      'Passive equity investing',
      'Active equity investing: strategies',
      'Active equity investing: portfolio construction',
      'Overview of fixed-income portfolio management',
      'Liability-driven & index-based strategies',
      'Yield curve strategies',
      'Fixed-income active management: credit strategies',
    ]),

    topic('l3-pm', 'III', 'Performance Measurement', 5, 10, [], [
      'Portfolio performance evaluation',
      'Investment manager selection',
      'GIPS for firms — composite construction & presentation',
    ]),

    topic('l3-drm', 'III', 'Derivatives and Risk Management', 10, 15, [], [
      'Options strategies',
      'Swaps, forwards & futures strategies',
      'Currency management: an introduction',
    ]),

    topic('l3-ethics', 'III', 'Ethical & Professional Standards', 10, 15, ['y2-audit'], [
      'Code of Ethics & Standards — case-based application',
      'Asset Manager Code of Professional Conduct — implementation',
      'Ethical considerations in investment manager selection',
      'GIPS in practice — firm-level compliance',
    ]),

    // ── Specialized Pathway placeholder ────────────────────────────────────
    // Pathway will contribute ~30–35% of the Level III exam.
    // Decide between: Portfolio Management | Private Wealth | Private Markets.
    // Once chosen, replace this placeholder with pathway-specific topics.
    topic('l3-pathway-placeholder', 'III', 'Specialized Pathway (to be chosen)', 30, 35, [], [
      'Choose 1 of 3 pathways at CFA Level III registration:',
      '  • Portfolio Management — buy-side investment management roles',
      '  • Private Wealth — high-net-worth client advisory',
      '  • Private Markets — private equity, venture capital, private credit',
      'Note: pathway is locked 14 days after registration; cannot be changed.',
    ]),
  ],
};
