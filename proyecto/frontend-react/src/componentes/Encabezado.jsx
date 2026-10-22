import { NavLink } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

// Barra de arriba: el nombre de la aplicación y, si hay sesión, el menú y el usuario
export default function Encabezado() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <header className="encabezado">
      <span className="marca">Tienda · Pedidos</span>

      {usuario && (
        <>
          <nav className="menu">
            <NavLink to="/pedidos" end>
              Pedidos
            </NavLink>
            <NavLink to="/pedidos/nuevo">Nuevo pedido</NavLink>
          </nav>
          <div className="usuario">
            <span>
              {usuario.nombre} <span className="rol">{usuario.rol}</span>
            </span>
            <button type="button" className="boton boton-secundario" onClick={() => cerrarSesion()}>
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </header>
  );
}
