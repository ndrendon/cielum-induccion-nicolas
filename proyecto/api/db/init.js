// Se ejecuta con: npm run db:init
// Ojo: borra las tablas de la base que diga PGDATABASE y las vuelve a crear con los datos de ejemplo.

import { inicializarBase } from './inicializar.js';

await inicializarBase();
console.log(`La base de datos ${process.env.PGDATABASE} quedó lista, con el modelo y los datos de ejemplo`);
