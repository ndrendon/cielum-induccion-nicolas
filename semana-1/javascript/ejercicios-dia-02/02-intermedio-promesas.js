function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function llamarServicio(nombre, ms, debeFallar = false) {
  await esperar(ms);
  if (debeFallar) {
    throw new Error(`El servicio ${nombre} no respondió`);
  }
  return `${nombre} respondió en ${ms} ms`;
}

async function probarPromiseAll() {
  console.log("--- Promise.all (todos responden) ---");
  console.time("Tiempo Promise.all");
  const resultados = await Promise.all([
    llamarServicio("usuarios", 1000),
    llamarServicio("productos", 500),
    llamarServicio("pagos", 1500),
  ]);
  console.timeEnd("Tiempo Promise.all");
  console.log(resultados);
}

async function probarPromiseAllConError() {
  console.log("\n--- Promise.all (uno falla) ---");
  try {
    await Promise.all([
      llamarServicio("usuarios", 1000),
      llamarServicio("productos", 500, true),
      llamarServicio("pagos", 1500),
    ]);
  } catch (error) {
    console.log("Promise.all se rechazó:", error.message);
  }
}

async function probarPromiseAllSettled() {
  console.log("\n--- Promise.allSettled (uno falla) ---");
  const resultados = await Promise.allSettled([
    llamarServicio("usuarios", 1000),
    llamarServicio("productos", 500, true),
    llamarServicio("pagos", 1500),
  ]);

  resultados.forEach((resultado) => {
    if (resultado.status === "fulfilled") {
      console.log("OK:", resultado.value);
    } else {
      console.log("FALLÓ:", resultado.reason.message);
    }
  });
}

async function main() {
  await probarPromiseAll();
  await probarPromiseAllConError();
  await probarPromiseAllSettled();
}

main();
