import { useEffect, useState } from 'react';

// Ejercicio intermedio: tabla de productos.
// Cuando la página aparece, useEffect le pide los productos a la API (GET /productos).
// Mientras llegan se muestra "Cargando...", y si algo falla se muestra el error con un botón para reintentar.
// GET /productos es público en la API, así que no necesita token.

const pesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

// Pide la lista a la API. Si la API no responde bien, lanza un error con un mensaje para mostrar.
async function pedirProductos(ruta) {
  let respuesta;
  try {
    respuesta = await fetch(ruta);
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }
  // Cuando la API está apagada, Vite responde 502
  if (respuesta.status === 502) {
    throw new Error('La API no respondió (código 502). Revisa que esté prendida.');
  }
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}.`);
  }
  return respuesta.json();
}

export default function TablaProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true); // empieza en true porque la página pide los datos apenas aparece
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0); // al sumarle 1, el efecto vuelve a pedir los productos
  const [simularError, setSimularError] = useState(false);

  // Con el casillero marcado se pide una ruta que no existe, para ver cómo se muestra el error
  const ruta = simularError ? '/api/productos-que-no-existen' : '/api/productos';

  useEffect(() => {
    // Si la página desaparece o se vuelve a pedir antes de que llegue la respuesta,
    // esa respuesta vieja se ignora
    let vigente = true;

    pedirProductos(ruta)
      .then((lista) => {
        if (vigente) {
          setProductos(lista);
          setCargando(false);
        }
      })
      .catch((errorCarga) => {
        if (vigente) {
          setError(errorCarga.message);
          setCargando(false);
        }
      });

    // Limpieza: React la ejecuta antes de volver a correr el efecto y cuando la página desaparece
    return () => {
      vigente = false;
    };
  }, [ruta, intento]); // dependencias: el efecto vuelve a correr cuando cambia la ruta o el intento

  // Al reintentar, la pantalla vuelve a "Cargando..." y el efecto pide los datos otra vez
  function reintentar() {
    setCargando(true);
    setError('');
    setIntento(intento + 1);
  }

  function cambiarSimulacion(evento) {
    setCargando(true);
    setError('');
    setSimularError(evento.target.checked);
  }

  return (
    <section className="tarjeta">
      <h1>Productos</h1>
      <p className="ayuda">
        Vienen de la API del proyecto: <code>GET /productos</code>.
      </p>

      <label className="casilla">
        <input type="checkbox" checked={simularError} onChange={cambiarSimulacion} />
        Simular un error (pedir una ruta que no existe)
      </label>

      {cargando && <p className="cargando">Cargando productos...</p>}

      {!cargando && error && (
        <div className="mensaje mensaje-error" role="alert">
          <p>No se pudieron cargar los productos. {error}</p>
          <button type="button" className="boton boton-secundario" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && productos.length === 0 && <p className="vacio">No hay productos.</p>}

      {!cargando && !error && productos.length > 0 && (
        <>
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th className="numero">Precio</th>
                  <th className="numero">Stock</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>{producto.id_producto}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td className="numero">{pesos.format(producto.precio)}</td>
                    <td className="numero">
                      {producto.stock < 10 && <span className="etiqueta-poco">Poco stock</span>} {producto.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ayuda">{productos.length} productos.</p>
        </>
      )}
    </section>
  );
}
