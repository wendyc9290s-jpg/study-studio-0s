import styles from './PlaceholderPage.module.css';

type Props = { title: string; description: string; version?: string };

export function PlaceholderPage({ title, description, version = 'v0.2' }: Props) {
  return (
    <section className={styles.placeholder}>
      <h1>{title}</h1>
      <p>This module is planned for a future version. Below is what it will eventually do.</p>
      <ul>
        <li>{description}</li>
      </ul>
      <span>{version}</span>
    </section>
  );
}
