// Punto de entrada: arranca el servidor. Se ejecuta con npm start o npm run dev.

import { app } from './app.js';
import { config } from './config.js';

app.listen(config.PORT, () => {
  console.log(`API escuchando en http://localhost:${config.PORT}`);
});
