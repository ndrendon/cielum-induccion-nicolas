# Cielum · Inducción backend · Nicolas Rendón

Repositorio de la inducción en Cielum: la bitácora de cada día, los ejercicios de cada tema y el proyecto integrador.

## Qué hay en el repositorio

| Carpeta | Qué tiene |
|---|---|
| `bitacora/` | La bitácora de cada día (`dia-01.md`, `dia-02.md`, …) |
| `semana-1/` | Ejercicios y retos de JavaScript, Python y SQL básico |
| `semana-2/` | Ejercicios de SQL avanzado, Node.js y Express, Postman y Docker |
| `semana-3/` | Ejercicios de React, Vue, Zoho CRM, y RPA con n8n |
| `proyecto/` | El proyecto integrador: API REST + PostgreSQL + Postman + Docker + React + Vue + Zoho CRM + n8n + RPA |
| `docs/` | Documentos del proyecto: la comparación entre React y Vue (`react-vs-vue.md`) |
| `entorno.md` | Versiones de las herramientas instaladas |

## Proyecto integrador

API REST de una tienda (clientes, productos, pedidos y login con JWT), con su base de datos en PostgreSQL, una colección de Postman con 135 pruebas, una página web para manejar los pedidos, hecha en React y también en Vue, y todo corriendo en Docker. Cada pedido nuevo pasa por n8n a Zoho CRM, y un bot de Python arma el reporte diario en Excel. Para prenderlo, parado en `proyecto`:

```powershell
Copy-Item .env.example .env
docker compose up -d
```

Antes de `docker compose up -d` hay que llenar los cinco valores vacíos del `.env`. La página en React queda en <http://localhost:8080>, la de Vue en <http://localhost:8082>, la API en <http://localhost:3001>, n8n en <http://localhost:5678> y Mailpit en <http://localhost:8025>. Los pasos completos están en [`proyecto/README.md`](proyecto/README.md). La configuración de Zoho CRM y su colección de Postman están en [`proyecto/zoho/`](proyecto/zoho/README.md), el workflow de n8n en [`proyecto/n8n/`](proyecto/n8n/README.md) y el bot del reporte en [`proyecto/rpa/`](proyecto/rpa/README.md).

## Ramas

Las bitácoras van en `main`. Cada tema va en su propia rama y entra a `main` con un Pull Request.

| Rama | Días | Qué agrega |
|---|---|---|
| `main` | 01 a 14 | Las bitácoras |
| `feature/js-fundamentos` | 02 y 03 | `semana-1/javascript` |
| `feature/python-fundamentos` | 04 | `semana-1/python` |
| `feature/sql-fundamentos` | 05 | `semana-1/sql` |
| `feature/sql-avanzado` | 06 | `semana-2/sql-avanzado` |
| `feature/node-express` | 07 | `semana-2/node-express` y `proyecto/api` (proyecto, parte 1) |
| `feature/postman` | 08 | `semana-2/postman` y `proyecto/postman` (proyecto, parte 2) |
| `feature/docker` | 09 y 10 | `semana-2/docker` y `proyecto/docker-compose.yml` (proyecto, parte 3) |
| `feature/react` | 11 | `semana-3/react` y `proyecto/frontend-react` (proyecto, parte 4) |
| `feature/vue` | 12 | `semana-3/vue`, `proyecto/frontend-vue` y `docs/react-vs-vue.md` (proyecto, parte 5) |
| `feature/zoho` | 13 | `semana-3/zoho` y `proyecto/zoho` (proyecto, parte 6) |
| `feature/rpa-n8n` | 14 | `semana-3/rpa-n8n`, `proyecto/n8n`, `proyecto/rpa` y n8n en `proyecto/docker-compose.yml` (proyecto, parte 7) |

Las ramas del proyecto van una encima de la otra: `feature/postman` sale de `feature/node-express`, `feature/docker` sale de `feature/postman`, `feature/react` sale de `feature/docker`, `feature/vue` sale de `feature/react`, `feature/zoho` sale de `feature/vue` y `feature/rpa-n8n` sale de `feature/zoho`. Por eso `feature/rpa-n8n` tiene el proyecto completo.
