import { useState } from 'react';

// Ejercicio básico 1: contador.
// La página muestra dos contadores hechos con el mismo componente.
// Cada uno recibe sus props (titulo, paso y meta) y guarda su propio número en el estado.
export default function PaginaContador() {
  return (
    <section className="tarjeta">
      <h1>Contador</h1>
      <p className="ayuda">Los dos usan el mismo componente, pero cada uno guarda su propio número.</p>
      <div className="contadores">
        <Contador titulo="Vasos de agua" meta={8} />
        <Contador titulo="Pasos" paso={500} meta={5000} />
      </div>
    </section>
  );
}

// titulo, paso y meta son props: llegan desde afuera y el componente solo las lee.
// valor es el estado: se cambia con setValor y React vuelve a dibujar el contador.
function Contador({ titulo, paso = 1, meta }) {
  const [valor, setValor] = useState(0);

  return (
    <div className="contador">
      <h2>{titulo}</h2>
      <p className="valor">{valor}</p>

      <div className="acciones">
        {/* (anterior) es el valor que tiene el contador justo antes del clic */}
        <button
          type="button"
          className="boton boton-secundario"
          onClick={() => setValor((anterior) => anterior - paso)}
          disabled={valor < paso}
        >
          −{paso}
        </button>
        <button type="button" className="boton" onClick={() => setValor((anterior) => anterior + paso)}>
          +{paso}
        </button>
        <button type="button" className="boton boton-secundario" onClick={() => setValor(0)} disabled={valor === 0}>
          Reiniciar
        </button>
      </div>

      {/* Renderizado condicional: el mensaje solo sale cuando se llega a la meta */}
      {valor >= meta ? (
        <p className="mensaje mensaje-exito">¡Llegaste a la meta de {meta}!</p>
      ) : (
        <p className="ayuda">Faltan {meta - valor} para la meta.</p>
      )}
    </div>
  );
}
