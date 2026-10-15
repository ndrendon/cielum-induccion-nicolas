import { useState } from 'react';

// Ejercicio básico 2: lista de tareas.
// Cada tarea es un objeto { id, texto, hecha }. La lista vive en el estado y se dibuja con map.
const TAREAS_INICIALES = [
  { id: 1, texto: 'Leer la documentación de React', hecha: true },
  { id: 2, texto: 'Hacer el contador', hecha: false },
  { id: 3, texto: 'Subir la bitácora antes de las 5', hecha: false },
];

export default function ListaTareas() {
  const [tareas, setTareas] = useState(TAREAS_INICIALES);
  const [texto, setTexto] = useState(''); // lo que está escrito en el campo de la tarea nueva
  const [siguienteId, setSiguienteId] = useState(4); // el id que va a tener la próxima tarea

  function agregar(evento) {
    evento.preventDefault(); // que el formulario no recargue la página
    const limpio = texto.trim();
    if (!limpio) {
      return;
    }
    // El arreglo no se cambia: se crea uno nuevo con la tarea al final
    setTareas([...tareas, { id: siguienteId, texto: limpio, hecha: false }]);
    setSiguienteId(siguienteId + 1);
    setTexto('');
  }

  function cambiarHecha(id) {
    setTareas(tareas.map((tarea) => (tarea.id === id ? { ...tarea, hecha: !tarea.hecha } : tarea)));
  }

  function borrar(id) {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  }

  // Esto se calcula cada vez que se dibuja; no necesita su propio estado
  const pendientes = tareas.filter((tarea) => !tarea.hecha).length;
  let resumen = `Te quedan ${pendientes} tareas pendientes.`;
  if (pendientes === 1) resumen = 'Te queda 1 tarea pendiente.';
  if (pendientes === 0) resumen = 'No tienes tareas pendientes.';

  return (
    <section className="tarjeta">
      <h1>Lista de tareas</h1>

      <form onSubmit={agregar} className="fila">
        <input
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Escribe una tarea nueva"
          aria-label="Tarea nueva"
        />
        <button type="submit" className="boton" disabled={!texto.trim()}>
          Agregar
        </button>
      </form>

      {tareas.length === 0 ? (
        <p className="vacio">No hay tareas. Agrega la primera.</p>
      ) : (
        <ul className="tareas">
          {tareas.map((tarea) => (
            // key: le dice a React cuál tarea es cuál cuando la lista cambia
            <li key={tarea.id} className={tarea.hecha ? 'hecha' : ''}>
              <label className="casilla">
                <input type="checkbox" checked={tarea.hecha} onChange={() => cambiarHecha(tarea.id)} />
                <span>{tarea.texto}</span>
              </label>
              <button type="button" className="boton boton-secundario" onClick={() => borrar(tarea.id)}>
                Borrar
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="ayuda">{resumen}</p>
    </section>
  );
}
