-- Reto día 06 · 1. Procedimiento registrar_pedido en PostgreSQL (PL/pgSQL).
-- Ejecutar en la base de datos induccion, con el modelo y los datos de semana-1/sql.
--
-- Registra un pedido con su detalle y descuenta el stock de cada producto.
-- Todo pasa dentro de la misma transacción: si un producto no tiene stock
-- suficiente, el procedimiento lanza un error con RAISE EXCEPTION y PostgreSQL
-- hace ROLLBACK de todo lo que alcanzó a hacer (el pedido, el detalle y los
-- descuentos de stock).
--
-- El detalle se recibe como un JSON con la lista de productos y cantidades:
-- '[{"id_producto": 9, "cantidad": 1}, {"id_producto": 10, "cantidad": 2}]'
--
-- En DBeaver: seleccionar desde CREATE OR REPLACE PROCEDURE hasta el $$; final
-- y ejecutarlo con Ctrl+Enter.

CREATE OR REPLACE PROCEDURE registrar_pedido(p_id_cliente INTEGER, p_detalle JSONB)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_pedido INTEGER;
    v_item RECORD;
    v_precio NUMERIC(12, 2);
    v_nombre VARCHAR(100);
    v_stock INTEGER;
BEGIN
    -- 1. Validaciones antes de tocar los datos
    IF p_detalle IS NULL OR jsonb_array_length(p_detalle) = 0 THEN
        RAISE EXCEPTION 'El pedido no tiene productos';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM clientes WHERE id_cliente = p_id_cliente) THEN
        RAISE EXCEPTION 'El cliente % no existe', p_id_cliente;
    END IF;

    FOR v_item IN
        SELECT x.id_producto, x.cantidad
        FROM jsonb_to_recordset(p_detalle) AS x(id_producto INTEGER, cantidad INTEGER)
    LOOP
        IF v_item.cantidad IS NULL OR v_item.cantidad <= 0 THEN
            RAISE EXCEPTION 'La cantidad del producto % debe ser mayor que 0', v_item.id_producto;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM productos WHERE id_producto = v_item.id_producto) THEN
            RAISE EXCEPTION 'El producto % no existe', v_item.id_producto;
        END IF;
    END LOOP;

    -- 2. Registrar el pedido
    INSERT INTO pedidos (id_cliente, fecha, estado)
    VALUES (p_id_cliente, CURRENT_DATE, 'pendiente')
    RETURNING id_pedido INTO v_id_pedido;

    -- 3. Por cada producto, descontar el stock y guardar el detalle.
    --    Si un producto viene repetido en el JSON, se suman sus cantidades.
    FOR v_item IN
        SELECT x.id_producto, SUM(x.cantidad) AS cantidad
        FROM jsonb_to_recordset(p_detalle) AS x(id_producto INTEGER, cantidad INTEGER)
        GROUP BY x.id_producto
        ORDER BY x.id_producto
    LOOP
        -- Descuenta solo si el stock alcanza. Validar y descontar en la misma
        -- sentencia evita que dos pedidos al mismo tiempo dejen el stock negativo.
        UPDATE productos
        SET stock = stock - v_item.cantidad
        WHERE id_producto = v_item.id_producto
          AND stock >= v_item.cantidad
        RETURNING precio INTO v_precio;

        -- 4. Si no alcanzó, el error cancela la transacción y se hace ROLLBACK de todo.
        IF NOT FOUND THEN
            SELECT nombre, stock INTO v_nombre, v_stock
            FROM productos
            WHERE id_producto = v_item.id_producto;

            RAISE EXCEPTION 'Stock insuficiente para %: hay %, se pidieron %',
                v_nombre, v_stock, v_item.cantidad;
        END IF;

        INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
        VALUES (v_id_pedido, v_item.id_producto, v_item.cantidad, v_precio);
    END LOOP;

    RAISE NOTICE 'Pedido % registrado', v_id_pedido;
END;
$$;

-- ============================================================
-- Pruebas: ejecutar una por una con Ctrl+Enter
-- ============================================================

-- Prueba 1 (sí hay stock): Andrés López (cliente 9) compra 1 Silla ergonómica y 2 Hub USB-C.
CALL registrar_pedido(9, '[{"id_producto": 9, "cantidad": 1}, {"id_producto": 10, "cantidad": 2}]');

-- Revisar el pedido nuevo, su detalle y el stock que quedó.
SELECT p.id_pedido, c.nombre AS cliente, p.fecha, p.estado,
       pr.nombre AS producto, d.cantidad, d.precio_unitario, pr.stock AS stock_actual
FROM pedidos p
INNER JOIN clientes c ON c.id_cliente = p.id_cliente
INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
INNER JOIN productos pr ON pr.id_producto = d.id_producto
WHERE p.id_pedido = (SELECT MAX(id_pedido) FROM pedidos)
ORDER BY pr.nombre;

-- Prueba 2 (no hay stock): Laura García (cliente 10) pide 1 Mouse inalámbrico y 10 Sillas
-- ergonómicas, pero solo quedan 4 sillas. Debe salir el error
-- "Stock insuficiente para Silla ergonómica: hay 4, se pidieron 10".
CALL registrar_pedido(10, '[{"id_producto": 2, "cantidad": 1}, {"id_producto": 9, "cantidad": 10}]');

-- Revisar que se hizo ROLLBACK: Laura sigue sin pedidos y el mouse sigue con 40 unidades,
-- aunque el procedimiento alcanzó a descontarlo antes de llegar a las sillas.
SELECT COUNT(*) AS pedidos_de_laura FROM pedidos WHERE id_cliente = 10;

SELECT id_producto, nombre, stock
FROM productos
WHERE id_producto IN (2, 9, 10)
ORDER BY id_producto;

-- Prueba 3 (producto que no existe): debe salir el error "El producto 99 no existe".
CALL registrar_pedido(1, '[{"id_producto": 99, "cantidad": 1}]');
