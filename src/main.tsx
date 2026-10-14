import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyAccentColor, getSavedAccentColor } from './utils/accentColor.ts';

// Apply saved user brand accent color immediately before first render
applyAccentColor(getSavedAccentColor());

createRoot(document.getElementById('root')!).render(<App />);
