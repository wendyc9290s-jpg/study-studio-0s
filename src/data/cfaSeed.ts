import type { CfaState, CfaTopic } from '../types';

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
  return { id, level, name, examWeightMin: wMin, examWeightMax: wMax, status: 'not-started', confidence: 0, uobOverlap, items: items(id, itemTexts), notes: '' };
}

export const cfaSeed: CfaState = {
  topics: [
    // ── Level I ─────────────────────────────────────────────────────────
    topic('l1-ethics', 'I', 'Ethics & Professional Standards', 15, 20, ['y2-audit'],
      ['Code of Ethics — 6 components', 'Standard I: Professionalism', 'Standard II: Integrity of Capital Markets', 'Standard III: Duties to Clients', 'Standard IV: Duties to Employers', 'Standard V: Investment Analysis & Recommendations', 'Standard VI: Conflicts of Interest', 'Standard VII: Responsibilities as a CFA Member', 'Global Investment Performance Standards (GIPS)']),

    topic('l1-quant', 'I', 'Quantitative Methods', 8, 12, ['y2-corporate-finance'],
      ['Time value of money: PV, FV, annuities', 'Nominal vs effective interest rates', 'Probability: basic rules, Bayes formula', 'Common distributions: normal, binomial, t-distribution', 'Sampling theory & central limit theorem', 'Hypothesis testing: t-test, z-test, p-value', 'Simple & multiple linear regression', 'Technical analysis basics']),

    topic('l1-econ', 'I', 'Economics', 8, 12, ['y2-corporate-finance'],
      ['Demand, supply & market equilibrium', 'Elasticity: price, income, cross', 'Firm & market structures: perfect competition → monopoly', 'GDP, business cycles & economic indicators', 'Monetary policy: money supply, interest rates', 'Fiscal policy: government spending & taxation', 'International trade: comparative advantage, trade policy', 'Currency exchange rates & parity conditions']),

    topic('l1-fsa', 'I', 'Financial Statement Analysis', 13, 17, ['y2-financial-reporting', 'y2-management-accounting'],
      ['Income statement: revenue recognition, EPS', 'Balance sheet: assets, liabilities, equity', 'Cash flow statement: direct vs indirect method', 'Financial ratio analysis: liquidity, leverage, profitability', 'DuPont decomposition of ROE', 'Inventory methods: FIFO, LIFO, weighted average', 'Long-lived assets: depreciation & impairment', 'Income taxes: deferred tax assets & liabilities', 'Long-term liabilities & leases', 'Intercorporate investments: equity method, consolidation']),

    topic('l1-corp', 'I', 'Corporate Issuers', 8, 12, ['y2-corporate-finance', 'y2-management-accounting'],
      ['Capital budgeting: NPV, IRR, payback period', 'Working capital management: cash, receivables, inventory', 'Capital structure: debt vs equity trade-offs', 'Dividends & share repurchases', 'Corporate governance: board, shareholders, stakeholders', 'ESG considerations in corporate decision-making']),

    topic('l1-equity', 'I', 'Equity Investments', 10, 12, ['y2-corporate-finance'],
      ['Market organisation: types, intermediaries', 'Equity securities: common, preferred, depository receipts', 'Industry analysis: Porter\'s five forces, life cycle', 'Equity valuation: DDM, FCFE, relative valuation', 'Price multiples: P/E, P/B, EV/EBITDA', 'Efficient market hypothesis: weak, semi-strong, strong']),

    topic('l1-fi', 'I', 'Fixed Income', 10, 12, ['y2-corporate-finance'],
      ['Bond features: coupon, maturity, par value', 'Bond pricing: YTM, spot rates, forward rates', 'Duration: Macaulay, modified, effective', 'Convexity and price-yield relationship', 'Yield spreads: OAS, Z-spread', 'Securitisation: MBS, ABS structures', 'Credit analysis: ratings, default risk, recovery rates']),

    topic('l1-deriv', 'I', 'Derivatives', 5, 8, ['y3-advanced-finance'],
      ['Forward contracts: pricing and valuation', 'Futures: marking to market, basis risk', 'Interest rate & currency swaps', 'Options: call and put, payoff diagrams', 'Put-call parity', 'Option pricing: Black-Scholes, Greeks (delta, gamma, vega)', 'Hedging strategies using derivatives']),

    topic('l1-alts', 'I', 'Alternative Investments', 5, 8, ['y3-advanced-finance'],
      ['Private equity: venture capital, LBO', 'Real estate: direct vs indirect investment', 'Commodities: spot prices, futures curves', 'Hedge funds: strategies, fee structures', 'Infrastructure and natural resources', 'Due diligence and risk of alternative investments']),

    topic('l1-pm', 'I', 'Portfolio Management', 5, 8, ['y2-corporate-finance', 'y3-advanced-finance'],
      ['Portfolio risk & return: expected return, variance', 'Diversification and correlation', 'Efficient frontier and minimum variance portfolio', 'Capital market line (CML)', 'CAPM: SML, beta, security selection', 'Behavioural biases: overconfidence, anchoring, herding', 'Investment policy statement (IPS)', 'Risk management framework overview']),

    // ── Level II ────────────────────────────────────────────────────────
    topic('l2-ethics', 'II', 'Ethics & Professional Standards', 10, 15, ['y2-audit'],
      ['Application of Standards to complex scenarios', 'Research objectivity standards', 'Soft dollar & trade allocation practices', 'GIPS verification and compliance']),

    topic('l2-quant', 'II', 'Quantitative Methods', 5, 10, ['y2-corporate-finance'],
      ['Multiple regression: multicollinearity, heteroskedasticity', 'Time-series: AR, MA, ARMA models', 'Machine learning in finance: supervised, unsupervised', 'Big data concepts for investment analysis']),

    topic('l2-fsa', 'II', 'Financial Statement Analysis', 10, 15, ['y2-financial-reporting', 'y3-advanced-financial-accounting'],
      ['Intercorporate investments: fair value vs equity method', 'Business combinations under IFRS 3', 'Pension accounting: defined benefit obligations', 'Multi-national operations: translation methods', 'Quality of earnings analysis', 'Financial reporting manipulation: red flags']),

    topic('l2-corp', 'II', 'Corporate Issuers', 5, 10, ['y2-corporate-finance'],
      ['Advanced capital structure: agency costs, signalling', 'Dividend policy: clientele, signalling theories', 'M&A: types, due diligence, synergy valuation', 'Corporate restructuring: divestitures, spin-offs']),

    topic('l2-equity', 'II', 'Equity Investments', 10, 15, ['y2-corporate-finance', 'y3-advanced-finance'],
      ['Equity valuation models in depth: DDM variations', 'Free cash flow models: FCFF vs FCFE', 'Residual income valuation', 'Market-based valuation: P/E, P/B, P/S', 'Private company valuation', 'Industry and competitive analysis']),

    topic('l2-fi', 'II', 'Fixed Income', 10, 15, ['y2-corporate-finance', 'y3-advanced-finance'],
      ['Term structure of interest rates: theories', 'Valuation of embedded options: binomial tree', 'Mortgage-backed securities: prepayment risk', 'Credit default swaps and CDOs', 'Sovereign vs corporate credit analysis']),

    topic('l2-deriv', 'II', 'Derivatives', 5, 10, ['y3-advanced-finance'],
      ['Advanced option strategies: spreads, collars', 'Valuation of interest rate derivatives', 'Currency swaps and risk management', 'Credit derivatives: CDS pricing']),

    topic('l2-alts', 'II', 'Alternative Investments', 5, 10, ['y3-advanced-finance'],
      ['Private equity valuation: NAV, IRR, TVPI', 'Real estate: cap rate, NOI, REIT analysis', 'Hedge fund strategies in depth', 'Commodities: roll yield, convenience yield']),

    topic('l2-pm', 'II', 'Portfolio Management', 5, 10, ['y3-advanced-finance'],
      ['Active portfolio management: information ratio', 'Factor models: CAPM, APT, Fama-French', 'Risk management: VaR, CVaR, stress testing', 'Liability-driven investing', 'Portfolio performance attribution']),

    // ── Level III ───────────────────────────────────────────────────────
    topic('l3-ethics', 'III', 'Ethics & Professional Standards', 10, 15, ['y2-audit'],
      ['Ethical decision-making frameworks', 'Case studies: conflicts, insider trading', 'Compliance programme design', 'GIPS: composite construction and reporting']),

    topic('l3-bfin', 'III', 'Behavioural Finance', 5, 10, ['y3-advanced-finance'],
      ['Cognitive errors vs emotional biases', 'Market anomalies: momentum, value, size', 'Behavioural portfolio theory', 'Adviser-client biases and mitigation']),

    topic('l3-pm-inst', 'III', 'Portfolio Management — Institutional', 10, 15, ['y3-advanced-finance'],
      ['IPS for institutional investors: pension, endowment, insurance', 'Asset-liability management', 'Liability-driven investing strategies', 'Endowment model: Yale approach']),

    topic('l3-pm-indiv', 'III', 'Portfolio Management — Individual', 10, 15, ['y3-advanced-finance'],
      ['Human capital and lifecycle investing', 'Goals-based wealth management', 'Tax considerations in portfolio management', 'Estate planning basics']),

    topic('l3-asset-alloc', 'III', 'Asset Allocation', 10, 15, ['y3-advanced-finance'],
      ['Strategic vs tactical asset allocation', 'Mean-variance optimisation in practice', 'Risk factor-based allocation', 'Currency management: overlay strategies', 'Rebalancing policies']),

    topic('l3-fi', 'III', 'Fixed Income Portfolio Management', 10, 15, ['y3-advanced-finance'],
      ['Liability-driven strategies: immunisation, cash flow matching', 'Yield curve strategies: bullet, barbell, ladder', 'Credit strategies: investment grade vs high yield', 'International bond investing: currency risk']),

    topic('l3-equity', 'III', 'Equity Portfolio Management', 10, 15, ['y3-advanced-finance'],
      ['Passive vs active equity strategies', 'Smart beta and factor investing', 'Long/short equity hedge strategies', 'Global vs domestic equity allocation', 'Equity portfolio construction and risk budgeting']),

    topic('l3-alts', 'III', 'Alternative Investments Portfolio Management', 5, 10, ['y3-advanced-finance'],
      ['Role of alternatives in a multi-asset portfolio', 'Private equity as an asset class', 'Real assets: infrastructure, timberland', 'Hedge fund due diligence and selection']),

    topic('l3-risk', 'III', 'Risk Management', 5, 10, ['y3-advanced-finance'],
      ['Enterprise risk management framework', 'Measuring market risk: VaR methods', 'Credit risk: counterparty exposure', 'Operational risk and tail risk', 'Risk governance and oversight']),

    topic('l3-trading', 'III', 'Trading, Performance Evaluation', 5, 10, [],
      ['Trading strategy: principal, agency, algorithmic', 'Transaction costs: explicit and implicit', 'Performance measurement: time-weighted vs money-weighted', 'Performance attribution: Brinson model', 'GIPS: composite construction, presentation']),
  ],
};
