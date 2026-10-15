// Muestra un mensaje de éxito o de error.
// Si el error trae los campos que fallaron (respuesta 400 de la API), también los lista.
export default function Mensaje({ tipo = 'error', texto, errores }) {
  if (!texto) {
    return null;
  }

  return (
    <div className={`mensaje mensaje-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <p>{texto}</p>
      {errores && (
        <ul>
          {Object.entries(errores).map(([campo, lista]) => (
            <li key={campo}>
              <strong>{campo}:</strong> {lista.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
