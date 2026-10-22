-- Proyecto integrador, parte 7: registro de lo que hace n8n con cada pedido.
-- El workflow pedido-a-zoho de n8n escribe una fila cada vez que procesa el aviso de un pedido nuevo.
-- Se puede ejecutar varias veces: si la tabla ya existe, no la toca ni borra sus datos.

CREATE TABLE IF NOT EXISTS log_integraciones (
    id_log SERIAL PRIMARY KEY,
    -- Sin llave foránea a pedidos: el registro queda aunque el pedido se borre después
    id_pedido INTEGER,
    sistema VARCHAR(30) NOT NULL DEFAULT 'zoho_crm',
    -- creado: el contacto no existía en Zoho y se creó
    -- actualizado: el contacto ya existía y se actualizó
    -- rechazado: el aviso no pasó la validación
    -- error: falló Zoho u otro paso del workflow
    resultado VARCHAR(20) NOT NULL CHECK (resultado IN ('creado', 'actualizado', 'rechazado', 'error')),
    email_cliente VARCHAR(150),
    -- id del contacto en Zoho CRM
    id_externo VARCHAR(40),
    mensaje TEXT,
    fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_log_integraciones_pedido ON log_integraciones (id_pedido);
