import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppStateProvider } from './context/AppStateContext';
import { Nav } from './components/Nav';
import { AppRoutes } from './router';
import styles from './App.module.css';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppStateProvider>
          <div className={styles.layout}>
            <Nav />
            <main className={styles.main}>
              <AppRoutes />
            </main>
          </div>
        </AppStateProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
