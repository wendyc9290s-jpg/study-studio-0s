import styles from './PlaceholderPage.module.css';

interface PlaceholderPageProps {
  title: string;
  description: string;
  versionTag: 'v0.2' | 'v0.3' | 'v0.4';
}

export function PlaceholderPage({ title, description, versionTag }: PlaceholderPageProps) {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lead}>This module is planned for a future version.</p>
      <p className={styles.description}>{description}</p>
      <span className={styles.tag}>{versionTag}</span>
    </div>
  );
}
