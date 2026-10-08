// Conexión a PostgreSQL.

import pg from 'pg';

// pg devuelve las columnas NUMERIC, como los precios, como texto ("180000.00").
// Con esto llegan como número. 1700 es el código que PostgreSQL usa para el tipo NUMERIC.
pg.types.setTypeParser(1700, (valor) => Number(valor));

// pg convierte las columnas DATE en una fecha con hora ("2026-10-01T05:00:00.000Z"),
// y la hora cambia según la zona horaria del computador. Con esto llegan tal cual
// están en la base ("2026-10-01"). 1082 es el código del tipo DATE.
pg.types.setTypeParser(1082, (valor) => valor);

// El pool es un grupo de conexiones que se reutilizan entre peticiones.
// Toma los datos de conexión de las variables PGHOST, PGPORT, PGDATABASE, PGUSER y PGPASSWORD.
export const pool = new pg.Pool();

// Ejecuta varias consultas dentro de una transacción.
// Si todo sale bien hace COMMIT; si algo lanza un error hace ROLLBACK y lo vuelve a lanzar.
export async function enTransaccion(trabajo) {
  const conexion = await pool.connect();
  try {
    await conexion.query('BEGIN');
    const resultado = await trabajo(conexion);
    await conexion.query('COMMIT');
    return resultado;
  } catch (error) {
    await conexion.query('ROLLBACK');
    throw error;
  } finally {
    // La conexión siempre se devuelve al pool, haya error o no
    conexion.release();
  }
}
