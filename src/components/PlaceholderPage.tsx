import styles from './PlaceholderPage.module.css';

interface PlaceholderPageProps {
  title: string;
  description: string;
  versionTag: 'v0.2' | 'v0.3' | 'v0.4';
}

export function PlaceholderPage({ title, description, versionTag }: PlaceholderPageProps) {
  return (
    <div className={styles.root}>
      <p className={styles.eyebrow}>Planned module</p>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.card}>
        <p className={styles.cardLabel}>What this will do</p>
        <p className={styles.description}>{description}</p>
        <span className={styles.tag}>{versionTag}</span>
      </div>
    </div>
  );
}
