-- Reto día 06 · 1. Procedimiento registrar_pedido en SQL Server (T-SQL).
-- Ejecutar en la base de datos induccion, con el modelo y los datos de semana-1/sql.
--
-- Registra un pedido con su detalle y descuenta el stock de cada producto dentro
-- de una transacción. Si algún producto no tiene stock suficiente, hace ROLLBACK
-- de todo (el pedido y los descuentos de stock) y devuelve un error con THROW.
--
-- El detalle se recibe como un JSON con la lista de productos y cantidades:
-- N'[{"id_producto": 9, "cantidad": 1}, {"id_producto": 10, "cantidad": 2}]'
--
-- En DBeaver: seleccionar desde CREATE OR ALTER PROCEDURE hasta el END; final,
-- sin incluir el GO, y ejecutarlo con Ctrl+Enter.

CREATE OR ALTER PROCEDURE dbo.registrar_pedido
    @id_cliente INT,
    @detalle NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @id_pedido INT;
    DECLARE @productos_pedidos INT;
    DECLARE @productos_descontados INT;
    DECLARE @mensaje NVARCHAR(200);
    DECLARE @items TABLE (id_producto INT, cantidad INT);

    -- 1. Validaciones antes de tocar los datos
    IF @detalle IS NULL OR ISJSON(@detalle) = 0
        THROW 50001, N'El detalle del pedido no es un JSON válido', 1;

    -- Si un producto viene repetido en el JSON, se suman sus cantidades.
    INSERT INTO @items (id_producto, cantidad)
    SELECT id_producto, SUM(cantidad)
    FROM OPENJSON(@detalle) WITH (id_producto INT, cantidad INT)
    GROUP BY id_producto;

    SET @productos_pedidos = @@ROWCOUNT;

    IF @productos_pedidos = 0
        THROW 50002, N'El pedido no tiene productos', 1;

    IF NOT EXISTS (SELECT 1 FROM clientes WHERE id_cliente = @id_cliente)
    BEGIN
        SET @mensaje = CONCAT(N'El cliente ', @id_cliente, N' no existe');
        THROW 50003, @mensaje, 1;
    END;

    SELECT TOP 1 @mensaje = CONCAT(N'La cantidad del producto ', id_producto, N' debe ser mayor que 0')
    FROM OPENJSON(@detalle) WITH (id_producto INT, cantidad INT)
    WHERE cantidad IS NULL OR cantidad <= 0;

    IF @mensaje IS NOT NULL
        THROW 50004, @mensaje, 1;

    SELECT TOP 1 @mensaje = CONCAT(N'El producto ', i.id_producto, N' no existe')
    FROM @items i
    WHERE NOT EXISTS (SELECT 1 FROM productos pr WHERE pr.id_producto = i.id_producto);

    IF @mensaje IS NOT NULL
        THROW 50005, @mensaje, 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 2. Registrar el pedido
        INSERT INTO pedidos (id_cliente, fecha, estado)
        VALUES (@id_cliente, CAST(GETDATE() AS DATE), 'pendiente');

        SET @id_pedido = SCOPE_IDENTITY();

        -- 3. Descontar el stock solo de los productos que tienen suficiente.
        --    Validar y descontar en la misma sentencia evita que dos pedidos
        --    al mismo tiempo dejen el stock negativo.
        UPDATE pr
        SET pr.stock = pr.stock - i.cantidad
        FROM productos pr
        INNER JOIN @items i ON i.id_producto = pr.id_producto
        WHERE pr.stock >= i.cantidad;

        SET @productos_descontados = @@ROWCOUNT;

        -- 4. Si algún producto no alcanzó, ROLLBACK de todo y error
        IF @productos_descontados < @productos_pedidos
        BEGIN
            ROLLBACK TRANSACTION;

            SET @mensaje = N'Stock insuficiente: no se registró el pedido';

            SELECT TOP 1 @mensaje = CONCAT(N'Stock insuficiente para ', pr.nombre,
                N': hay ', pr.stock, N', se pidieron ', i.cantidad)
            FROM @items i
            INNER JOIN productos pr ON pr.id_producto = i.id_producto
            WHERE pr.stock < i.cantidad
            ORDER BY pr.id_producto;

            THROW 50006, @mensaje, 1;
        END;

        -- 5. Guardar el detalle con el precio actual de cada producto
        INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
        SELECT @id_pedido, i.id_producto, i.cantidad, pr.precio
        FROM @items i
        INNER JOIN productos pr ON pr.id_producto = i.id_producto;

        COMMIT TRANSACTION;

        PRINT CONCAT(N'Pedido ', @id_pedido, N' registrado');
    END TRY
    BEGIN CATCH
        -- Cualquier otro error también deshace la transacción.
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH;
END;
GO

-- ============================================================
-- Pruebas: ejecutar una por una con Ctrl+Enter
-- ============================================================

-- Prueba 1 (sí hay stock): Andrés López (cliente 9) compra 1 Silla ergonómica y 2 Hub USB-C.
EXEC dbo.registrar_pedido @id_cliente = 9, @detalle = N'[{"id_producto": 9, "cantidad": 1}, {"id_producto": 10, "cantidad": 2}]';

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
EXEC dbo.registrar_pedido @id_cliente = 10, @detalle = N'[{"id_producto": 2, "cantidad": 1}, {"id_producto": 9, "cantidad": 10}]';

-- Revisar que se hizo ROLLBACK: Laura sigue sin pedidos y el mouse sigue con 40 unidades,
-- aunque el UPDATE alcanzó a descontarlo antes de que se detectara el problema con las sillas.
SELECT COUNT(*) AS pedidos_de_laura FROM pedidos WHERE id_cliente = 10;

SELECT id_producto, nombre, stock
FROM productos
WHERE id_producto IN (2, 9, 10)
ORDER BY id_producto;

-- Prueba 3 (producto que no existe): debe salir el error "El producto 99 no existe".
EXEC dbo.registrar_pedido @id_cliente = 1, @detalle = N'[{"id_producto": 99, "cantidad": 1}]';
