// Formatos para mostrar los datos

const pesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

// 960000 → "$ 960.000"
export function dinero(valor) {
  return pesos.format(valor);
}

export const ESTADOS = ['pendiente', 'enviado', 'entregado', 'cancelado'];
