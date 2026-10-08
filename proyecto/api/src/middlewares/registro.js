// Muestra en la consola cada petición: método, ruta, código de respuesta y cuánto tardó.

export function registrarPeticiones(req, res, next) {
  const inicio = Date.now();

  // 'finish' se dispara cuando la respuesta ya se envió
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - inicio} ms`);
  });

  next();
}
