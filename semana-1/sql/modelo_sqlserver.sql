-- Modelo del proyecto integrador en SQL Server.
-- Ejecutar conectado a la base de datos induccion.
-- Si las tablas ya existen, las borra y las vuelve a crear vacías.

DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS clientes;

CREATE TABLE clientes (
    id_cliente INT IDENTITY(1, 1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    ciudad NVARCHAR(60) NOT NULL
);

CREATE TABLE productos (
    id_producto INT IDENTITY(1, 1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    categoria NVARCHAR(50) NOT NULL,
    precio DECIMAL(12, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

CREATE TABLE pedidos (
    id_pedido INT IDENTITY(1, 1) PRIMARY KEY,
    id_cliente INT NOT NULL REFERENCES clientes (id_cliente),
    fecha DATE NOT NULL,
    estado NVARCHAR(20) NOT NULL DEFAULT 'pendiente'
);

CREATE TABLE detalle_pedido (
    id_detalle INT IDENTITY(1, 1) PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedidos (id_pedido),
    id_producto INT NOT NULL REFERENCES productos (id_producto),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12, 2) NOT NULL
);
