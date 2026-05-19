const STORAGE_KEY = 'af-command-center:v1';

const topicify = (courseId, topics = []) => topics.map((text, index) => ({ id: `${courseId}-t${index + 1}`, text, done: false }));
const resourceId = (course) => `${course.id}-r${course.resources.length + 1}`;

const seed = {
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

const isValidState = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!data.programme || typeof data.programme.name !== 'string') return false;
  if (!Array.isArray(data.courses)) return false;
  return data.courses.every((course) => (
    course && typeof course.id === 'string' && typeof course.name === 'string' && typeof course.year === 'string'
    && typeof course.status === 'string' && typeof course.confidence === 'number'
    && Array.isArray(course.keyTopics) && Array.isArray(course.resources)
  ));
};

let state = loadState();
let filter = 'all';
let expanded = new Set();

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return structuredClone(seed);
  }
  try {
    const parsed = JSON.parse(raw);
    return isValidState(parsed) ? parsed : structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}

let timer;
function persist() {
  clearTimeout(timer);
  timer = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), 300);
}

function route() { return location.hash.slice(1) || '/'; }
const placeholders = { '/': 'Aggregated dashboard. Will show today\'s study tasks, current 4-month phase, progress across all subjects, energy check-in, and recent brain dump entries.', '/study/cfa': 'Roadmap for CFA Level I/II/III with topic checklists and overlap mapping to UoB modules.', '/study/acca': 'Roadmap for current and future ACCA qualification structures.', '/study/plan': 'Phase-based study plan for the pre-university holiday: Accounting Foundation, Finance Foundation, UoB Preview, Audit/Tax Preview, CFA/ACCA orientation, reset week.', '/study/resource': 'Cross-module library of YouTube/Bilibili/PDF/web resources with filtering and progress tracking.', '/study/upload': 'Upload PDF/PPT/docs and use Claude API to extract summaries, key terms, checklists, flashcards, and quiz questions.', '/study/modes': 'Browse, Checklist, Flashcard, Quiz, and Explain modes for active recall.', '/study/ai': 'Conversational planner that suggests minimum-effort study plans based on energy level, progress, and upcoming travel.', '/life/travel': 'Travel destinations, dates, and budget. Will integrate with the 4-Month Plan to auto-adjust workload.', '/life/braindump': 'Quick capture for stray thoughts, todos, and life admin.' };
function titleFromPath(p) { return p === '/' ? 'Home' : p.split('/').pop().replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()); }
function stars(n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }

function render() {
  const p = route();
  document.getElementById('app').innerHTML = `<nav class="nav"><a class="nav-item link" href="#/">Home</a><div class="nav-item">Study<div class="menu">${[['/study/sim-uob', 'SIM UoB'], ['/study/cfa', 'CFA'], ['/study/acca', 'ACCA'], ['/study/plan', '4-Month Plan'], ['/study/resource', 'Resource Library'], ['/study/upload', 'Upload & Extract'], ['/study/modes', 'Study Modes'], ['/study/ai', 'AI Agent']].map(([u, l]) => `<a class="${p === u ? 'active' : ''}" href="#${u}">${l}</a>`).join('')}</div></div><div class="nav-item">Life<div class="menu"><a href="#/life/travel">Travel & Rest</a><a href="#/life/braindump">Brain Dump</a></div></div></nav><main class="page">${p === '/study/sim-uob' ? simPage() : placeholderPage(p)}</main>`;
  bindEvents();
}

function placeholderPage(p) { return `<section class="placeholder"><h1>${titleFromPath(p)}</h1><p class="muted">This module is planned for a future version. Below is what it will eventually do.</p><ul><li>${placeholders[p] || 'Planned module.'}</li></ul><span class="tag">v0.2</span></section>`; }
function simPage() { const c = state.courses.filter((x) => filter === 'all' || x.status === filter); const groups = { 'Year 2': c.filter((x) => x.year === 'Year 2'), 'Year 3': c.filter((x) => x.year === 'Year 3') }; return `<h1>SIM UoB Accounting & Finance</h1><p class="muted">BSc (Hons) — Year 2 (25%) + Year 3 (75%)</p><div class="toolbar"><select id="filter"><option value="all">all</option><option value="not-started">not-started</option><option value="previewing">previewing</option><option value="studying">studying</option><option value="done">done</option></select><button id="export">Export JSON</button><button id="import">Import JSON</button><button id="reset">Reset to seed</button><input type="file" id="import-file" accept="application/json" style="display:none"></div>${Object.entries(groups).map(([year, list]) => `<h2>${year}</h2><div class="grid">${list.map(card).join('')}</div>`).join('')}`; }
function card(course) { const isExp = expanded.has(course.id); return `<article class="card course" role="button" tabindex="0" aria-expanded="${isExp}" data-id="${course.id}"><h3>${course.name}</h3><div class="muted">${course.blurb}</div><div class="badges"><span class="badge">${course.status}</span><span class="badge">${course.examRelevance}</span><span class="badge">${stars(course.confidence)}</span></div>${isExp ? `<div class="expanded"><div class="row"><label>Status <select data-field="status">${['not-started', 'previewing', 'studying', 'done'].map((v) => `<option ${course.status === v ? 'selected' : ''} value="${v}">${v}</option>`).join('')}</select></label><label>Relevance <select data-field="examRelevance">${['low', 'medium', 'high'].map((v) => `<option ${course.examRelevance === v ? 'selected' : ''} value="${v}">${v}</option>`).join('')}</select></label><label>Confidence <select data-field="confidence">${[0, 1, 2, 3, 4, 5].map((v) => `<option ${course.confidence === v ? 'selected' : ''} value="${v}">${stars(v)}</option>`)}</select></label></div><strong>Key Topics</strong><ul class="topics">${course.keyTopics.map((t, i) => `<li><input data-topic-check="${i}" type="checkbox" ${t.done ? 'checked' : ''}><input data-topic-text="${i}" value="${t.text}"><button data-topic-del="${i}">Delete</button></li>`).join('')}</ul><button data-topic-add="1">Add topic</button><strong>Resources</strong>${course.resources.map((r, i) => `<div class="resource-item"><a class="link" href="${r.url}" target="_blank">${r.title}</a><span class="badge">${r.type}</span><button data-resource-del="${i}">Delete</button></div>`).join('')}<div class="row"><input placeholder="Title" data-res-title><input placeholder="URL" data-res-url><select data-res-type>${['youtube', 'bilibili', 'pdf', 'web', 'note'].map((x) => `<option>${x}</option>`)}</select><button data-resource-add="1">Add</button></div><label>Notes<textarea data-notes>${course.notes || ''}</textarea></label></div>` : ''}</article>`; }

function bindEvents() {
  const f = document.getElementById('filter'); if (f) { f.value = filter; f.onchange = (e) => { filter = e.target.value; render(); }; }
  const ex = document.getElementById('export'); if (ex) ex.onclick = () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `af-command-center-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); };
  const imp = document.getElementById('import'); if (imp) imp.onclick = () => document.getElementById('import-file').click();
  const inp = document.getElementById('import-file'); if (inp) inp.onchange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!isValidState(data)) throw new Error('invalid');
        if (confirm('This will replace all current data. Continue?')) { state = data; persist(); render(); }
      } catch {
        alert('Invalid JSON: expected programme.name and a valid courses[] shape.');
      }
    };
    r.readAsText(file);
  };
  const reset = document.getElementById('reset'); if (reset) reset.onclick = () => { if (confirm('Reset to seed data?')) { state = structuredClone(seed); persist(); render(); } };

  for (const el of document.querySelectorAll('.course')) {
    const toggle = () => { const id = el.dataset.id; expanded.has(id) ? expanded.delete(id) : expanded.add(id); render(); };
    el.addEventListener('click', (e) => {
      if (e.target.closest('button, input, select, textarea, a, label')) return;
      toggle();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    const id = el.dataset.id; const course = state.courses.find((c) => c.id === id); if (!course) continue;
    el.querySelectorAll('button, input, select, textarea, a').forEach((node) => node.addEventListener('click', (e) => e.stopPropagation()));
    el.querySelectorAll('input, select, textarea').forEach((node) => node.addEventListener('keydown', (e) => e.stopPropagation()));

    el.querySelectorAll('select[data-field]').forEach((s) => s.onchange = (e) => { course[e.target.dataset.field] = e.target.dataset.field === 'confidence' ? Number(e.target.value) : e.target.value; persist(); render(); });
    const notes = el.querySelector('[data-notes]'); if (notes) notes.onblur = (e) => { course.notes = e.target.value; persist(); };
    el.querySelectorAll('[data-topic-check]').forEach((i) => i.onchange = (e) => { course.keyTopics[e.target.dataset.topicCheck].done = e.target.checked; persist(); });
    el.querySelectorAll('[data-topic-text]').forEach((i) => i.onblur = (e) => { course.keyTopics[e.target.dataset.topicText].text = e.target.value; persist(); });
    el.querySelectorAll('[data-topic-del]').forEach((b) => b.onclick = (e) => { course.keyTopics.splice(Number(e.target.dataset.topicDel), 1); persist(); render(); });
    const addT = el.querySelector('[data-topic-add]'); if (addT) addT.onclick = () => { course.keyTopics.push({ id: `${course.id}-t${course.keyTopics.length + 1}`, text: 'New topic', done: false }); persist(); render(); };
    el.querySelectorAll('[data-resource-del]').forEach((b) => b.onclick = (e) => { course.resources.splice(Number(e.target.dataset.resourceDel), 1); persist(); render(); });
    const addR = el.querySelector('[data-resource-add]'); if (addR) addR.onclick = () => { const t = el.querySelector('[data-res-title]').value.trim(); const u = el.querySelector('[data-res-url]').value.trim(); const ty = el.querySelector('[data-res-type]').value; if (!t || !u) return; course.resources.push({ id: resourceId(course), title: t, url: u, type: ty, addedAt: new Date().toISOString() }); persist(); render(); };
  }
}

window.addEventListener('hashchange', render);
render();
