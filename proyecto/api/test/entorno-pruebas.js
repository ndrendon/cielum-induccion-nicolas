// Las pruebas usan otra base, proyecto_test, para no tocar los datos de la base proyecto.
// Este archivo se importa de primero en api.test.js, antes de cargar la app y la conexión,
// para que ya tengan estos valores cuando lean las variables de entorno.
process.env.PGDATABASE = 'proyecto_test';
process.env.NODE_ENV = 'test';

// Las pruebas levantan un n8n falso en este puerto (ver api.test.js)
// para revisar el aviso que la API manda cada vez que se crea un pedido.
process.env.N8N_WEBHOOK_URL = 'http://127.0.0.1:3999/webhook/pedido-creado';
process.env.N8N_WEBHOOK_SECRET = 'secreto-de-las-pruebas-123';
