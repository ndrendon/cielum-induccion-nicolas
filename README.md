# Cielum · Inducción backend · Nicolas Rendón

Repositorio de la inducción en Cielum: la bitácora de cada día, los ejercicios de cada tema y el proyecto integrador.

## Qué hay en el repositorio

| Carpeta | Qué tiene |
|---|---|
| `bitacora/` | La bitácora de cada día (`dia-01.md`, `dia-02.md`, …) |
| `semana-1/` | Ejercicios y retos de JavaScript, Python y SQL básico |
| `semana-2/` | Ejercicios de SQL avanzado, Node.js y Express, Postman y Docker |
| `semana-3/` | Ejercicios de React |
| `proyecto/` | El proyecto integrador: API REST + PostgreSQL + Postman + Docker + React |
| `entorno.md` | Versiones de las herramientas instaladas |

## Proyecto integrador

API REST de una tienda (clientes, productos, pedidos y login con JWT), con su base de datos en PostgreSQL, una colección de Postman con 135 pruebas, una página web en React para manejar los pedidos y todo corriendo en Docker. Para prenderlo, parado en `proyecto`:

```powershell
Copy-Item .env.example .env
docker compose up -d
```

Antes de `docker compose up -d` hay que llenar las tres contraseñas del `.env`. La página queda en <http://localhost:8080> y la API en <http://localhost:3001>. Los pasos completos están en [`proyecto/README.md`](proyecto/README.md).

## Ramas

Las bitácoras van en `main`. Cada tema va en su propia rama y entra a `main` con un Pull Request.

| Rama | Días | Qué agrega |
|---|---|---|
| `main` | 01 a 11 | Las bitácoras |
| `feature/js-fundamentos` | 02 y 03 | `semana-1/javascript` |
| `feature/python-fundamentos` | 04 | `semana-1/python` |
| `feature/sql-fundamentos` | 05 | `semana-1/sql` |
| `feature/sql-avanzado` | 06 | `semana-2/sql-avanzado` |
| `feature/node-express` | 07 | `semana-2/node-express` y `proyecto/api` (proyecto, parte 1) |
| `feature/postman` | 08 | `semana-2/postman` y `proyecto/postman` (proyecto, parte 2) |
| `feature/docker` | 09 y 10 | `semana-2/docker` y `proyecto/docker-compose.yml` (proyecto, parte 3) |
| `feature/react` | 11 | `semana-3/react` y `proyecto/frontend-react` (proyecto, parte 4) |

Las ramas del proyecto van una encima de la otra: `feature/postman` sale de `feature/node-express`, `feature/docker` sale de `feature/postman` y `feature/react` sale de `feature/docker`. Por eso `feature/react` tiene el proyecto completo.
