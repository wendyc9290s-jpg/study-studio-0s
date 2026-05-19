import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';
import { cn } from '../lib/escape';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const OVERVIEW: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: '⊞' },
];

const STUDY: NavItem[] = [
  { to: '/study/sim-uob',   label: 'SIM UoB',        icon: '◉' },
  { to: '/study/cfa',       label: 'CFA',             icon: '◈' },
  { to: '/study/acca',      label: 'ACCA',            icon: '◈' },
  { to: '/study/plan',      label: '4-Month Plan',    icon: '▦' },
  { to: '/study/resource',  label: 'Resources',       icon: '◫' },
  { to: '/study/upload',    label: 'Upload & Extract',icon: '↑' },
  { to: '/study/modes',     label: 'Study Modes',     icon: '◑' },
  { to: '/study/ai',        label: 'AI Agent',        icon: '✦' },
];

const LIFE: NavItem[] = [
  { to: '/life/travel',    label: 'Travel & Rest', icon: '◇' },
  { to: '/life/braindump', label: 'Brain Dump',    icon: '◻' },
];

function NavSection({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>{label}</div>
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => cn(styles.item, isActive ? styles.active : undefined)}
        >
          <span className={styles.itemIcon} aria-hidden>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export function Nav() {
  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.brand}>
        <div className={styles.logo}>AF</div>
        <div className={styles.brandText}>
          <div className={styles.appName}>Command Center</div>
          <div className={styles.appSub}>BSc Accounting &amp; Finance</div>
        </div>
      </div>

      <NavSection label="Overview"  items={OVERVIEW} />
      <NavSection label="Study"     items={STUDY} />
      <NavSection label="Life"      items={LIFE} />

      <div className={styles.footer}>
        <div className={styles.footerText}>Phase 1 · v0.1.0</div>
      </div>
    </nav>
  );
}
