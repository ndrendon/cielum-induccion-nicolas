import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './03-avanzado/AuthProvider.jsx';
import App from './App.jsx';
import './index.css';

// BrowserRouter maneja las URLs y AuthProvider guarda la sesión (ejercicio avanzado).
// Los dos envuelven a App para que cualquier página los pueda usar.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
