import { writeFile } from "node:fs/promises";
import { obtenerUsuarios, obtenerPosts } from "./api.js";
import { generarReporte } from "./reporte.js";

const RUTA_REPORTE = new URL("./reporte.json", import.meta.url);

async function main() {
  try {
    const [usuarios, posts] = await Promise.all([obtenerUsuarios(), obtenerPosts()]);
    const reporte = generarReporte(usuarios, posts);

    console.log("Reporte de usuarios");
    console.table(reporte);

    await writeFile(RUTA_REPORTE, JSON.stringify(reporte, null, 2), "utf-8");
    console.log(`Reporte guardado en reporte.json (${reporte.length} usuarios)`);
  } catch (error) {
    console.error("No se pudo generar el reporte:", error.message);
    process.exitCode = 1;
  }
}

main();
