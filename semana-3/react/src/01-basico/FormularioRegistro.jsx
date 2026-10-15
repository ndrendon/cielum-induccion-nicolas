import { useState } from 'react';

// Ejercicio básico 3: formulario controlado.
// Cada campo muestra lo que hay en el estado (value) y cada cambio actualiza el estado (onChange).
// Así React siempre sabe qué hay escrito, y los datos se pueden revisar antes de enviarlos.
const VACIO = { nombre: '', correo: '', ciudad: '', noticias: false };
const CIUDADES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'];

export default function FormularioRegistro() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(null); // los datos del último registro que se envió bien

  // Un solo manejador para todos los campos: el name del campo dice cuál dato cambiar.
  // En el casillero el valor está en checked; en los demás campos, en value.
  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos({ ...datos, [name]: type === 'checkbox' ? checked : value });
    // Si el campo tenía un error, se quita apenas el usuario lo cambia
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  }

  function revisar() {
    const encontrados = {};
    if (datos.nombre.trim().length < 3) {
      encontrados.nombre = 'Escribe tu nombre, mínimo 3 letras.';
    }
    if (!datos.correo.includes('@') || !datos.correo.includes('.')) {
      encontrados.correo = 'Escribe un correo válido, por ejemplo ana@correo.com.';
    }
    if (!datos.ciudad) {
      encontrados.ciudad = 'Escoge una ciudad.';
    }
    return encontrados;
  }

  function enviar(evento) {
    evento.preventDefault(); // que el navegador no recargue la página
    const encontrados = revisar();
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setEnviado(null);
      return;
    }
    setEnviado(datos);
    setDatos(VACIO); // limpia el formulario
  }

  return (
    <section className="tarjeta">
      <h1>Formulario de registro</h1>

      {enviado && (
        <div className="mensaje mensaje-exito" role="status">
          <p>
            ¡Listo, {enviado.nombre}! Quedaste registrado con el correo {enviado.correo}, desde {enviado.ciudad}.
            {enviado.noticias ? ' Te vamos a mandar noticias.' : ' No te vamos a mandar noticias.'}
          </p>
        </div>
      )}

      <div className="dos-columnas">
        {/* noValidate: la revisión la hace el código de React y no el navegador */}
        <form onSubmit={enviar} className="formulario" noValidate>
          <label>
            Nombre
            <input name="nombre" value={datos.nombre} onChange={cambiar} />
            {errores.nombre && <span className="error-campo">{errores.nombre}</span>}
          </label>

          <label>
            Correo
            <input name="correo" type="email" value={datos.correo} onChange={cambiar} />
            {errores.correo && <span className="error-campo">{errores.correo}</span>}
          </label>

          <label>
            Ciudad
            <select name="ciudad" value={datos.ciudad} onChange={cambiar}>
              <option value="">Escoge una ciudad</option>
              {CIUDADES.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
            {errores.ciudad && <span className="error-campo">{errores.ciudad}</span>}
          </label>

          <label className="casilla">
            <input name="noticias" type="checkbox" checked={datos.noticias} onChange={cambiar} />
            Quiero recibir noticias por correo
          </label>

          <div className="acciones">
            <button type="submit" className="boton">
              Registrarme
            </button>
            <button
              type="button"
              className="boton boton-secundario"
              onClick={() => {
                setDatos(VACIO);
                setErrores({});
              }}
            >
              Limpiar
            </button>
          </div>
        </form>

        {/* Lo que hay en el estado en este momento: cambia con cada letra que se escribe */}
        <div className="estado-actual">
          <h2>Lo que hay en el estado</h2>
          <pre>{JSON.stringify(datos, null, 2)}</pre>
        </div>
      </div>
    </section>
  );
}
