// Ejercicio básico: servidor Express con GET /salud.
// Se ejecuta con: npm run basico

import express from 'express';

const app = express();

// Responde si el servidor está funcionando y la fecha y hora actual
app.get('/salud', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date().toISOString() });
});

const puerto = process.env.PORT ?? 3000;

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
