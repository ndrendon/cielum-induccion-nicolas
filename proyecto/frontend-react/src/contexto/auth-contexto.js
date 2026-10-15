import { createContext } from 'react';

// El contexto donde vive la sesión. Lo llena AuthProvider y se lee con useAuth().
export const AuthContexto = createContext(null);
