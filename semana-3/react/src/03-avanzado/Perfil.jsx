import { useApi } from './useApi.js';
import { useAuth } from './useAuth.js';

// Página protegida: solo se ve con sesión (App.jsx la pone dentro de RutaProtegida).
// Usa useApi dos veces: para el perfil (GET /auth/perfil) y para los clientes (GET /clientes).
// Las dos rutas de la API piden token, y useApi lo pone en cada petición.
export default function Perfil() {
  const { usuario, cerrarSesion, usarTokenFalso } = useAuth();
  const perfil = useApi('/auth/perfil');
  const clientes = useApi('/clientes');

  return (
    <section className="tarjeta">
      <div className="titulo-con-acciones">
        <h1>Hola, {usuario.nombre}</h1>
        <button type="button" className="boton boton-secundario" onClick={() => cerrarSesion()}>
          Cerrar sesión
        </button>
      </div>

      <h2>Mi perfil según la API</h2>
      {perfil.cargando && <p className="cargando">Cargando el perfil...</p>}
      {perfil.error && <p className="mensaje mensaje-error">{perfil.error}</p>}
      {perfil.datos && (
        <dl className="resumen">
          <div>
            <dt>Id</dt>
            <dd>{perfil.datos.id_usuario}</dd>
          </div>
          <div>
            <dt>Nombre</dt>
            <dd>{perfil.datos.nombre}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>{perfil.datos.rol}</dd>
          </div>
        </dl>
      )}

      <div className="titulo-con-acciones">
        <h2>Clientes</h2>
        <button type="button" className="boton boton-secundario" onClick={clientes.recargar}>
          Volver a pedir
        </button>
      </div>
      {clientes.cargando && <p className="cargando">Cargando los clientes...</p>}
      {clientes.error && <p className="mensaje mensaje-error">{clientes.error}</p>}
      {clientes.datos && (
        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {clientes.datos.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.ciudad}</td>
                  <td>{cliente.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Probar un token que no sirve</h2>
      <p className="ayuda">
        Este botón cambia el token por uno falso. La API responde 401, useApi cierra la sesión y la ruta protegida
        manda al login.
      </p>
      <button type="button" className="boton boton-peligro" onClick={usarTokenFalso}>
        Usar un token falso
      </button>
    </section>
  );
}
