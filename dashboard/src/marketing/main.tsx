import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';
import './marketing.css';
import { Landing } from './Landing';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Landing heroVariant="split" showLivePulse />
  </StrictMode>
);
