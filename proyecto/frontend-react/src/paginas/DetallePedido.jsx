import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import EstadoPedido from '../componentes/EstadoPedido.jsx';
import Mensaje from '../componentes/Mensaje.jsx';
import { ESTADOS, dinero } from '../formato.js';
import { useApi } from '../hooks/useApi.js';
import { useConsulta } from '../hooks/useConsulta.js';

// Detalle de un pedido y formulario para cambiar su estado
export default function DetallePedido() {
  const { id } = useParams(); // el id que viene en la URL: /pedidos/13
  const ubicacion = useLocation();
  const pedir = useApi();
  const { datos, cargando, error } = useConsulta(`/pedidos/${id}`);

  // Al cambiar el estado, la API devuelve el pedido actualizado; se muestra ese en vez del que se cargó
  const [actualizado, setActualizado] = useState(null);
  const pedido = actualizado && String(actualizado.id_pedido) === id ? actualizado : datos;

  const [nuevoEstado, setNuevoEstado] = useState('');
  const [guardando, setGuardando] = useState(false);
  // El mensaje de éxito puede venir de la página anterior (pedido creado)
  const [exito, setExito] = useState(ubicacion.state?.mensaje ?? '');
  const [errorEstado, setErrorEstado] = useState(null);

  async function guardarEstado(evento) {
    evento.preventDefault();
    setGuardando(true);
    setExito('');
    setErrorEstado(null);
    try {
      const respuesta = await pedir(`/pedidos/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado: nuevoEstado } });
      setActualizado(respuesta);
      setExito(
        respuesta.estado === 'cancelado'
          ? 'Pedido cancelado. Las unidades volvieron al stock.'
          : `Estado cambiado a ${respuesta.estado}.`,
      );
      setNuevoEstado('');
    } catch (errorApi) {
      setErrorEstado(errorApi);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando && !pedido) {
    return <p className="cargando">Cargando el pedido...</p>;
  }

  if (error) {
    return (
      <section className="tarjeta">
        <Mensaje texto={error.message} />
        <Link to="/pedidos">Volver a pedidos</Link>
      </section>
    );
  }

  const cancelado = pedido.estado === 'cancelado';

  return (
    <section className="tarjeta">
      <div className="titulo-con-acciones">
        <h1>Pedido #{pedido.id_pedido}</h1>
        <Link to="/pedidos" className="boton boton-secundario">
          Volver a pedidos
        </Link>
      </div>

      <Mensaje tipo="exito" texto={exito} />
      <Mensaje texto={errorEstado?.message} errores={errorEstado?.errores} />

      <dl className="resumen">
        <div>
          <dt>Cliente</dt>
          <dd>{pedido.cliente}</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{pedido.fecha}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>
            <EstadoPedido estado={pedido.estado} />
          </dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>{dinero(pedido.total)}</dd>
        </div>
      </dl>

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="numero">Cantidad</th>
              <th className="numero">Precio unitario</th>
              <th className="numero">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalle.map((linea, posicion) => (
              // Un mismo producto podría estar dos veces en un pedido, por eso la key lleva también la posición
              <tr key={`${linea.id_producto}-${posicion}`}>
                <td>{linea.producto}</td>
                <td className="numero">{linea.cantidad}</td>
                <td className="numero">{dinero(linea.precio_unitario)}</td>
                <td className="numero">{dinero(linea.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={guardarEstado} className="cambio-estado">
        <label>
          Cambiar estado
          <select value={nuevoEstado} onChange={(evento) => setNuevoEstado(evento.target.value)} disabled={cancelado}>
            <option value="">Escoge el nuevo estado</option>
            {ESTADOS.filter((opcion) => opcion !== pedido.estado).map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="boton" disabled={cancelado || !nuevoEstado || guardando}>
          {guardando ? 'Guardando...' : 'Guardar estado'}
        </button>
      </form>
      <p className="ayuda">
        {cancelado
          ? 'Este pedido está cancelado y ya no se puede cambiar.'
          : 'Si lo cancelas, las unidades de sus productos vuelven al stock.'}
      </p>
    </section>
  );
}
