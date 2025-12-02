import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');

if (container) {
  if (!window._reactRoot) {
    window._reactRoot = createRoot(container);
  }
  window._reactRoot.render(<App />);
}

if (import.meta.hot) import.meta.hot.accept();
