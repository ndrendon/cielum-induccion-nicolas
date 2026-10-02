import { obtenerUsuarios, obtenerPosts } from "./api.js";
import { generarReporte } from "./reporte.js";

const estado = document.querySelector("#estado");
const tabla = document.querySelector("#tabla-reporte");
const cuerpoTabla = tabla.querySelector("tbody");
const totalPosts = document.querySelector("#total-posts");

function crearFila(fila) {
  const tr = document.createElement("tr");

  const tdUsuario = document.createElement("td");
  tdUsuario.textContent = fila.usuario;

  const tdCiudad = document.createElement("td");
  tdCiudad.textContent = fila.ciudad;

  const tdPosts = document.createElement("td");
  tdPosts.textContent = fila.cantidadPosts;
  tdPosts.classList.add("numero");

  tr.append(tdUsuario, tdCiudad, tdPosts);
  return tr;
}

function mostrarReporte(reporte) {
  cuerpoTabla.replaceChildren(...reporte.map(crearFila));
  totalPosts.textContent = reporte.reduce((total, fila) => total + fila.cantidadPosts, 0);
  tabla.hidden = false;
  estado.textContent = `${reporte.length} usuarios encontrados`;
}

async function iniciar() {
  try {
    const [usuarios, posts] = await Promise.all([obtenerUsuarios(), obtenerPosts()]);
    mostrarReporte(generarReporte(usuarios, posts));
  } catch (error) {
    estado.textContent = `No se pudo cargar el reporte: ${error.message}`;
    estado.classList.add("error");
  }
}

iniciar();
