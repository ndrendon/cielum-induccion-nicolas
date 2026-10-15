import { Link } from 'react-router';

// Lo que se muestra cuando la URL no coincide con ninguna ruta
export default function NoEncontrada() {
  return (
    <section className="tarjeta tarjeta-angosta">
      <h1>Esta página no existe</h1>
      <Link to="/pedidos">Ir a los pedidos</Link>
    </section>
  );
}
