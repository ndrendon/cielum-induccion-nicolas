import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { AuthProvider } from './contexto/AuthProvider.jsx';
import './index.css';

// BrowserRouter maneja las URLs de la aplicación y AuthProvider guarda la sesión.
// Los dos envuelven a App para que cualquier página pueda usarlos.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
