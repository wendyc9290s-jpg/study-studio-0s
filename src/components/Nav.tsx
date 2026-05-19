import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Nav.module.css';
import { cn } from '../lib/escape';

interface MenuItem {
  to: string;
  label: string;
}

interface DropdownProps {
  label: string;
  items: MenuItem[];
}

function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div className={styles.dropdown} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {label}
        <span className={cn(styles.chevron, open ? styles.chevronOpen : undefined)} aria-hidden>
          ▾
        </span>
      </button>
      <div
        className={cn(styles.menu, open ? styles.menuOpen : undefined)}
        role="menu"
        aria-label={label}
      >
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            role="menuitem"
            className={({ isActive }) =>
              cn(styles.menuItem, isActive ? styles.menuItemActive : undefined)
            }
            onClick={() => setOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

const STUDY_ITEMS: MenuItem[] = [
  { to: '/study/sim-uob', label: 'SIM UoB' },
  { to: '/study/cfa', label: 'CFA' },
  { to: '/study/acca', label: 'ACCA' },
  { to: '/study/plan', label: '4-Month Plan' },
  { to: '/study/resource', label: 'Resource Library' },
  { to: '/study/upload', label: 'Upload & Extract' },
  { to: '/study/modes', label: 'Study Modes' },
  { to: '/study/ai', label: 'AI Agent' },
];

const LIFE_ITEMS: MenuItem[] = [
  { to: '/life/travel', label: 'Travel & Rest' },
  { to: '/life/braindump', label: 'Brain Dump' },
];

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => cn(styles.homeLink, isActive ? styles.active : undefined)}
      >
        Home
      </NavLink>
      <Dropdown label="Study" items={STUDY_ITEMS} />
      <Dropdown label="Life" items={LIFE_ITEMS} />
    </nav>
  );
}
