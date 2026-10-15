import { Link, useSearchParams } from 'react-router';
import EstadoPedido from '../componentes/EstadoPedido.jsx';
import Mensaje from '../componentes/Mensaje.jsx';
import Paginacion from '../componentes/Paginacion.jsx';
import { ESTADOS, dinero } from '../formato.js';
import { useConsulta } from '../hooks/useConsulta.js';

// Lista de pedidos con filtro por estado y paginación.
// Los filtros se guardan en la URL (?estado=pendiente&pagina=2&limite=10),
// así se pueden compartir y no se pierden al ir al detalle y volver.
export default function Pedidos() {
  const [parametros, setParametros] = useSearchParams();
  const estado = parametros.get('estado') ?? '';
  const pagina = Number(parametros.get('pagina') ?? 1);
  const limite = Number(parametros.get('limite') ?? 10);

  const { datos, cargando, error, recargar } = useConsulta(`/pedidos?estado=${estado}&pagina=${pagina}&limite=${limite}`);

  // Cambia un filtro en la URL; al cambiar el estado o el límite se vuelve a la página 1
  function cambiar(cambios) {
    const nuevos = { estado, pagina, limite, ...cambios };
    const valores = { pagina: String(nuevos.pagina), limite: String(nuevos.limite) };
    if (nuevos.estado) valores.estado = nuevos.estado;
    setParametros(valores);
  }

  return (
    <section className="tarjeta">
      <div className="titulo-con-acciones">
        <h1>Pedidos</h1>
        <Link to="/pedidos/nuevo" className="boton">
          Nuevo pedido
        </Link>
      </div>

      <div className="filtros">
        <label>
          Estado
          <select value={estado} onChange={(evento) => cambiar({ estado: evento.target.value, pagina: 1 })}>
            <option value="">Todos</option>
            {ESTADOS.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
        <label>
          Por página
          <select value={limite} onChange={(evento) => cambiar({ limite: Number(evento.target.value), pagina: 1 })}>
            {[5, 10, 20].map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <>
          <Mensaje texto={error.message} errores={error.errores} />
          <button type="button" className="boton boton-secundario" onClick={recargar}>
            Reintentar
          </button>
        </>
      )}

      {cargando && !datos && <p className="cargando">Cargando pedidos...</p>}

      {datos && datos.datos.length === 0 && <p className="vacio">No hay pedidos con ese filtro.</p>}

      {datos && datos.datos.length > 0 && (
        <>
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th className="numero">Total</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {datos.datos.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td>{pedido.id_pedido}</td>
                    <td>{pedido.fecha}</td>
                    <td>{pedido.cliente}</td>
                    <td>
                      <EstadoPedido estado={pedido.estado} />
                    </td>
                    <td className="numero">{dinero(pedido.total)}</td>
                    <td>
                      <Link to={`/pedidos/${pedido.id_pedido}`}>Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginacion
            pagina={datos.pagina}
            totalPaginas={datos.totalPaginas}
            total={datos.total}
            alCambiar={(nuevaPagina) => cambiar({ pagina: nuevaPagina })}
          />
        </>
      )}
    </section>
  );
}
