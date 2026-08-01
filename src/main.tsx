import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Limpar todos os cookies ao acessar o site
try {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    if (!cookie) continue;
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    if (name) {
      const host = window.location.hostname;
      const hostParts = host.split('.');

      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${host}`;

      if (hostParts.length > 1) {
        const domain = '.' + hostParts.slice(-2).join('.');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      }
    }
  }
} catch (e) {
  console.warn('Erro ao limpar cookies:', e);
}

// Catch uncaught errors or unhandled promise rejections to prevent top-level Script Errors
window.addEventListener('error', (event) => {
  console.warn('Captured window error:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Captured unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
