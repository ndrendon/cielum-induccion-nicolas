import { Navigate, Route, Routes } from 'react-router';
import Encabezado from './componentes/Encabezado.jsx';
import RutaProtegida from './componentes/RutaProtegida.jsx';
import DetallePedido from './paginas/DetallePedido.jsx';
import Login from './paginas/Login.jsx';
import NoEncontrada from './paginas/NoEncontrada.jsx';
import NuevoPedido from './paginas/NuevoPedido.jsx';
import Pedidos from './paginas/Pedidos.jsx';

// Las rutas de la aplicación. Las que están dentro de RutaProtegida necesitan sesión.
export default function App() {
  return (
    <>
      <Encabezado />
      <main className="contenido">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RutaProtegida />}>
            <Route path="/" element={<Navigate to="/pedidos" replace />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/pedidos/nuevo" element={<NuevoPedido />} />
            <Route path="/pedidos/:id" element={<DetallePedido />} />
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
    </>
  );
}
