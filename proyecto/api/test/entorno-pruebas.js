// Las pruebas usan otra base, proyecto_test, para no tocar los datos de la base proyecto.
// Este archivo se importa de primero en api.test.js, antes de cargar la app y la conexión,
// para que ya tengan estos valores cuando lean las variables de entorno.
process.env.PGDATABASE = 'proyecto_test';
process.env.NODE_ENV = 'test';
