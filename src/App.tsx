import { NavLink, Route, Routes } from 'react-router-dom';
import { PlaceholderPage } from './components/PlaceholderPage';
import { SimUobPage } from './pages/SimUobPage';
import { LifePage } from './pages/LifePage';
import styles from './App.module.css';

const placeholders = {
  '/': { title: 'Home', description: "Aggregated dashboard. Will show today's study tasks, current 4-month phase, progress across all subjects, energy check-in, and recent brain dump entries." },
  '/study/cfa': { title: 'CFA', description: 'Roadmap for CFA Level I/II/III with topic checklists and overlap mapping to UoB modules.' },
  '/study/acca': { title: 'ACCA', description: 'Roadmap for current and future ACCA qualification structures.' },
  '/study/plan': { title: '4-Month Plan', description: 'Phase-based study plan for the pre-university holiday.' },
  '/study/resource': { title: 'Resource Library', description: 'Cross-module library of YouTube/Bilibili/PDF/web resources with filtering and progress tracking.' },
  '/study/upload': { title: 'Upload & Extract', description: 'Upload PDF/PPT/docs and extract summaries, key terms, checklists, flashcards, and quiz questions.' },
  '/study/modes': { title: 'Study Modes', description: 'Browse, Checklist, Flashcard, Quiz, and Explain modes for active recall.' },
  '/study/ai': { title: 'AI Agent', description: 'Conversational planner that suggests minimum-effort study plans.' },
};

function P({ path }: { path: keyof typeof placeholders }) {
  return <PlaceholderPage title={placeholders[path].title} description={placeholders[path].description} />;
}

export function App() {
  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <NavLink to="/">Home</NavLink>
        <div className={styles.group}>
          <span>Study</span>
          <div className={styles.menu}>
            <NavLink to="/study/sim-uob">SIM UoB</NavLink>
            <NavLink to="/study/cfa">CFA</NavLink>
            <NavLink to="/study/acca">ACCA</NavLink>
            <NavLink to="/study/plan">4-Month Plan</NavLink>
            <NavLink to="/study/resource">Resource Library</NavLink>
            <NavLink to="/study/upload">Upload & Extract</NavLink>
            <NavLink to="/study/modes">Study Modes</NavLink>
            <NavLink to="/study/ai">AI Agent</NavLink>
          </div>
        </div>
        <div className={styles.group}>
          <span>Life</span>
          <div className={styles.menu}>
            <NavLink to="/life">Life</NavLink>
          </div>
        </div>
      </nav>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<P path="/" />} />
          <Route path="/study/sim-uob" element={<SimUobPage />} />
          <Route path="/study/cfa" element={<P path="/study/cfa" />} />
          <Route path="/study/acca" element={<P path="/study/acca" />} />
          <Route path="/study/plan" element={<P path="/study/plan" />} />
          <Route path="/study/resource" element={<P path="/study/resource" />} />
          <Route path="/study/upload" element={<P path="/study/upload" />} />
          <Route path="/study/modes" element={<P path="/study/modes" />} />
          <Route path="/study/ai" element={<P path="/study/ai" />} />
          <Route path="/life" element={<LifePage />} />
        </Routes>
      </main>
    </div>
  );
}
