import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Mensaje from '../componentes/Mensaje.jsx';
import { dinero } from '../formato.js';
import { useApi } from '../hooks/useApi.js';
import { useConsulta } from '../hooks/useConsulta.js';

// Formulario para crear un pedido: se escoge el cliente y uno o varios productos con su cantidad.
// La API crea el pedido en una transacción: si un producto no tiene stock, no se guarda nada.
export default function NuevoPedido() {
  const pedir = useApi();
  const navegar = useNavigate();
  const clientes = useConsulta('/clientes');
  const productos = useConsulta('/productos');

  const siguienteClave = useRef(2); // la key de cada línea, para que React sepa cuál es cuál
  const [idCliente, setIdCliente] = useState('');
  const [lineas, setLineas] = useState([{ clave: 1, idProducto: '', cantidad: 1 }]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const listaProductos = productos.datos ?? [];
  const buscarProducto = (id) => listaProductos.find((producto) => producto.id_producto === Number(id));

  // Total aproximado con los precios actuales; el total de verdad lo calcula la API
  const totalEstimado = lineas.reduce((suma, linea) => {
    const producto = buscarProducto(linea.idProducto);
    return producto ? suma + producto.precio * linea.cantidad : suma;
  }, 0);

  function cambiarLinea(clave, cambios) {
    setLineas((actuales) => actuales.map((linea) => (linea.clave === clave ? { ...linea, ...cambios } : linea)));
  }

  function agregarLinea() {
    setLineas((actuales) => [...actuales, { clave: siguienteClave.current++, idProducto: '', cantidad: 1 }]);
  }

  function quitarLinea(clave) {
    setLineas((actuales) => actuales.filter((linea) => linea.clave !== clave));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError(null);

    // Revisión antes de llamar a la API, para dar un mensaje claro
    if (!idCliente) {
      setError({ message: 'Escoge el cliente del pedido.' });
      return;
    }
    if (lineas.some((linea) => !linea.idProducto)) {
      setError({ message: 'Escoge el producto de cada línea, o quita las líneas vacías.' });
      return;
    }
    if (lineas.some((linea) => !Number.isInteger(linea.cantidad) || linea.cantidad < 1)) {
      setError({ message: 'La cantidad de cada producto debe ser un número entero mayor que 0.' });
      return;
    }

    setEnviando(true);
    try {
      const pedido = await pedir('/pedidos', {
        metodo: 'POST',
        cuerpo: {
          id_cliente: Number(idCliente),
          detalle: lineas.map((linea) => ({ id_producto: Number(linea.idProducto), cantidad: linea.cantidad })),
        },
      });
      // Va al detalle del pedido nuevo y le pasa el mensaje de éxito
      navegar(`/pedidos/${pedido.id_pedido}`, {
        state: { mensaje: `Pedido ${pedido.id_pedido} creado por ${dinero(pedido.total)}.` },
      });
    } catch (errorApi) {
      setError(errorApi);
      setEnviando(false);
    }
  }

  if (clientes.cargando || productos.cargando) {
    return <p className="cargando">Cargando clientes y productos...</p>;
  }

  if (clientes.error || productos.error) {
    const errorCarga = clientes.error ?? productos.error;
    return <Mensaje texto={`No se pudieron cargar los datos: ${errorCarga.message}`} />;
  }

  return (
    <section className="tarjeta">
      <div className="titulo-con-acciones">
        <h1>Nuevo pedido</h1>
        <Link to="/pedidos" className="boton boton-secundario">
          Volver a pedidos
        </Link>
      </div>

      <Mensaje texto={error?.message} errores={error?.errores} />

      <form onSubmit={enviar} className="formulario">
        <label>
          Cliente
          <select value={idCliente} onChange={(evento) => setIdCliente(evento.target.value)}>
            <option value="">Escoge un cliente</option>
            {clientes.datos.map((cliente) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre} · {cliente.ciudad}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="lineas">
          <legend>Productos</legend>
          {lineas.map((linea, posicion) => {
            // Un producto que ya está en otra línea no se puede volver a escoger
            const usados = lineas.filter((otra) => otra.clave !== linea.clave).map((otra) => otra.idProducto);
            const producto = buscarProducto(linea.idProducto);
            return (
              <div key={linea.clave} className="linea">
                <select
                  aria-label={`Producto ${posicion + 1}`}
                  value={linea.idProducto}
                  onChange={(evento) => cambiarLinea(linea.clave, { idProducto: evento.target.value })}
                >
                  <option value="">Escoge un producto</option>
                  {listaProductos
                    .filter((opcion) => !usados.includes(String(opcion.id_producto)))
                    .map((opcion) => (
                      <option key={opcion.id_producto} value={opcion.id_producto}>
                        {opcion.nombre} · {dinero(opcion.precio)} · stock {opcion.stock}
                      </option>
                    ))}
                </select>
                <input
                  type="number"
                  min="1"
                  aria-label={`Cantidad ${posicion + 1}`}
                  value={linea.cantidad}
                  onChange={(evento) => cambiarLinea(linea.clave, { cantidad: Number(evento.target.value) })}
                />
                <span className="subtotal">{producto ? dinero(producto.precio * linea.cantidad) : '—'}</span>
                <button
                  type="button"
                  className="boton boton-secundario"
                  onClick={() => quitarLinea(linea.clave)}
                  disabled={lineas.length === 1}
                >
                  Quitar
                </button>
              </div>
            );
          })}
          <button type="button" className="boton boton-secundario" onClick={agregarLinea}>
            Agregar producto
          </button>
        </fieldset>

        <p className="total">
          Total aproximado: <strong>{dinero(totalEstimado)}</strong>
        </p>

        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Creando...' : 'Crear pedido'}
        </button>
      </form>
    </section>
  );
}
