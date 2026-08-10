import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App'
import '@/app/styles/index.css'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)