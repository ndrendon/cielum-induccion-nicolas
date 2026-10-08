// Error que lleva el código HTTP con el que se debe responder (404, 409...).
// Se lanza desde los servicios y lo responde el middleware de errores.

export class ErrorHttp extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}
