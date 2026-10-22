// Crea la base de datos si no existe y carga el modelo y los datos de ejemplo.
// La usan el comando npm run db:init y las pruebas.

import { readFile } from 'node:fs/promises';
import pg from 'pg';

export async function inicializarBase() {
  const nombreBase = process.env.PGDATABASE;

  // El nombre va dentro del CREATE DATABASE, así que solo se aceptan letras, números y guion bajo
  if (!/^[a-z0-9_]+$/.test(nombreBase ?? '')) {
    throw new Error('PGDATABASE solo puede tener letras minúsculas, números y guion bajo');
  }

  // 1. Conectarse a la base postgres, que siempre existe, y crear la base del proyecto si falta
  const conexionPrincipal = new pg.Client({ database: 'postgres' });
  await conexionPrincipal.connect();
  const resultado = await conexionPrincipal.query('SELECT 1 FROM pg_database WHERE datname = $1', [nombreBase]);
  if (resultado.rowCount === 0) {
    await conexionPrincipal.query(`CREATE DATABASE ${nombreBase}`);
  }
  await conexionPrincipal.end();

  // 2. Conectarse a la base del proyecto y ejecutar los dos archivos SQL, en orden
  const conexion = new pg.Client();
  await conexion.connect();
  for (const archivo of ['01_modelo.sql', '02_datos.sql']) {
    const sql = await readFile(new URL(archivo, import.meta.url), 'utf8');
    await conexion.query(sql);
  }
  await conexion.end();
}
