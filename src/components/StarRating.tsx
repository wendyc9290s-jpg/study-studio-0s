import styles from './StarRating.module.css';
import { cn } from '../lib/escape';

interface StarRatingProps {
  value: 0 | 1 | 2 | 3 | 4 | 5;
  onChange?: (value: 0 | 1 | 2 | 3 | 4 | 5) => void;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, readOnly = false }: StarRatingProps) {
  return (
    <span className={styles.root} aria-label={`${value} out of 5 stars`}>
      {([1, 2, 3, 4, 5] as const).map(n => (
        <button
          key={n}
          type="button"
          className={cn(styles.star, n <= value ? styles.starFilled : undefined)}
          onClick={
            readOnly
              ? undefined
              : e => {
                  e.stopPropagation();
                  onChange?.(n as 0 | 1 | 2 | 3 | 4 | 5);
                }
          }
          aria-label={`${n} star${n !== 1 ? 's' : ''}`}
          disabled={readOnly}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </span>
  );
}
