// La etiqueta de color con el estado de un pedido
export default function EstadoPedido({ estado }) {
  return <span className={`estado estado-${estado}`}>{estado}</span>;
}
