import { AppProviders } from '#src/providers/AppProviders';
import '#src/theme/theme.css';
import '@fontsource-variable/bitter';
import '@fontsource-variable/inter';
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Could not find root element');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppProviders />
  </React.StrictMode>,
);
