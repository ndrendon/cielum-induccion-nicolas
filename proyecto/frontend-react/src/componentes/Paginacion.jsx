// Botones para moverse entre las páginas de una lista
export default function Paginacion({ pagina, totalPaginas, total, alCambiar }) {
  return (
    <div className="paginacion">
      <button type="button" className="boton boton-secundario" disabled={pagina <= 1} onClick={() => alCambiar(pagina - 1)}>
        Anterior
      </button>
      <span>
        Página {pagina} de {Math.max(totalPaginas, 1)} · {total} {total === 1 ? 'pedido' : 'pedidos'}
      </span>
      <button
        type="button"
        className="boton boton-secundario"
        disabled={pagina >= totalPaginas}
        onClick={() => alCambiar(pagina + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}
