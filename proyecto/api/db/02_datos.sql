-- Datos de ejemplo del proyecto integrador (los mismos de la semana 1) y dos usuarios.

INSERT INTO clientes (nombre, email, ciudad) VALUES
    ('Ana Gómez', 'ana.gomez@example.com', 'Medellín'),
    ('Luis Pérez', 'luis.perez@example.com', 'Bogotá'),
    ('Sofía Ruiz', 'sofia.ruiz@example.com', 'Cali'),
    ('Mateo Díaz', 'mateo.diaz@example.com', 'Medellín'),
    ('Carlos Mora', 'carlos.mora@example.com', 'Bogotá'),
    ('Valentina Restrepo', 'valentina.restrepo@example.com', 'Medellín'),
    ('Juan Torres', 'juan.torres@example.com', 'Barranquilla'),
    ('Camila Zapata', 'camila.zapata@example.com', 'Cali'),
    ('Andrés López', 'andres.lopez@example.com', 'Bucaramanga'),
    ('Laura García', 'laura.garcia@example.com', 'Medellín');

INSERT INTO productos (nombre, categoria, precio, stock) VALUES
    ('Teclado mecánico', 'Periféricos', 180000.00, 25),
    ('Mouse inalámbrico', 'Periféricos', 65000.00, 40),
    ('Monitor 24 pulgadas', 'Pantallas', 720000.00, 8),
    ('Audífonos bluetooth', 'Audio', 150000.00, 15),
    ('Cámara web HD', 'Periféricos', 120000.00, 12),
    ('Base para portátil', 'Accesorios', 85000.00, 30),
    ('Disco SSD 1 TB', 'Almacenamiento', 310000.00, 18),
    ('Memoria USB 64 GB', 'Almacenamiento', 35000.00, 60),
    ('Silla ergonómica', 'Mobiliario', 890000.00, 5),
    ('Hub USB-C', 'Accesorios', 95000.00, 20);

INSERT INTO pedidos (id_cliente, fecha, estado) VALUES
    (1, '2026-08-03', 'entregado'),
    (2, '2026-08-10', 'entregado'),
    (3, '2026-08-18', 'entregado'),
    (1, '2026-08-25', 'entregado'),
    (4, '2026-09-02', 'entregado'),
    (5, '2026-09-07', 'enviado'),
    (6, '2026-09-12', 'entregado'),
    (2, '2026-09-15', 'cancelado'),
    (7, '2026-09-20', 'enviado'),
    (8, '2026-09-24', 'pendiente'),
    (3, '2026-09-28', 'pendiente'),
    (1, '2026-10-01', 'pendiente');

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES
    (1, 1, 1, 180000.00),
    (1, 2, 2, 65000.00),
    (2, 3, 1, 720000.00),
    (3, 4, 2, 150000.00),
    (3, 8, 3, 35000.00),
    (4, 7, 1, 310000.00),
    (4, 6, 1, 85000.00),
    (5, 2, 1, 65000.00),
    (5, 5, 1, 120000.00),
    (6, 3, 2, 720000.00),
    (7, 1, 1, 180000.00),
    (7, 4, 1, 150000.00),
    (7, 8, 2, 35000.00),
    (8, 7, 1, 310000.00),
    (9, 6, 1, 85000.00),
    (9, 2, 2, 65000.00),
    (10, 5, 1, 120000.00),
    (10, 8, 5, 35000.00),
    (11, 1, 3, 180000.00),
    (12, 3, 1, 720000.00),
    (12, 2, 1, 65000.00);

-- Usuarios de prueba. Las contraseñas son Admin2026* y Vendedor2026*,
-- guardadas como hash de bcrypt.
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
    ('Administrador', 'admin@cielum.test', '$2b$10$5sB3unISh84Yt2kM/eOaCuhpodUjKfG0H8IoxbXp/saP4Fcb6N2ji', 'admin'),
    ('Vendedor', 'vendedor@cielum.test', '$2b$10$ZGEe8kflsQ/Lr5yxDiUjKufXr.TO5jdbB9g2vJ/q7KPKe4Qxon42O', 'vendedor');
