import { BrowserRouter } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext';
import { Nav } from './components/Nav';
import { AppRoutes } from './router';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <Nav />
        <main className={styles.main}>
          <AppRoutes />
        </main>
      </AppStateProvider>
    </BrowserRouter>
  );
}
