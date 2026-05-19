import styles from './Badge.module.css';
import { cn } from '../lib/escape';

interface BadgeProps {
  label: string;
  variant?: string;
}

export function Badge({ label, variant }: BadgeProps) {
  const variantClass = variant ? styles[variant as keyof typeof styles] : undefined;
  return <span className={cn(styles.badge, variantClass)}>{label}</span>;
}
