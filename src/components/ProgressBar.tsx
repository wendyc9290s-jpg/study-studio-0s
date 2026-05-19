import styles from './ProgressBar.module.css';
import { cn } from '../lib/escape';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'accent' | 'green' | 'amber';
  size?: 'sm' | 'md';
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'accent',
  size = 'md',
  label,
  showValue = false,
}: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div className={styles.root}>
      {(label !== undefined || showValue) && (
        <div className={styles.meta}>
          {label !== undefined && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.value}>
              {max === 100 ? `${pct}%` : `${value}/${max}`}
            </span>
          )}
        </div>
      )}
      <div className={cn(styles.track, styles[size])}>
        <div
          className={cn(styles.fill, styles[color])}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
