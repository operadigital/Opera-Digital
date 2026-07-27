import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

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
