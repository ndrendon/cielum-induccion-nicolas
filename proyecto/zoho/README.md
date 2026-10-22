# Zoho CRM (proyecto integrador, parte 6)

La parte 6 del proyecto configura Zoho CRM y lo usa por API. Se usan los mismos leads, campos y reglas de los ejercicios del día 13 (`semana-3/zoho`). Además se agrega un trato que dispara una función de Deluge.

| Archivo o carpeta | Qué tiene |
|---|---|
| `configuracion.md` | Todo lo que se configuró en Zoho CRM, con sus capturas: campos, vista, reglas y la función |
| `capturas/` | Las capturas de pantalla que usa `configuracion.md` |
| `postman/zoho-crm.postman_collection.json` | La colección **zoho-crm**: tokens, Leads, conversión, tratos y limpieza. Usa variables y no tiene tokens reales |
| `postman/zoho-crm.postman_environment.json` | El entorno **zoho-crm**, con las variables vacías |
| `deluge/actualizar_contacto_del_trato.dg` | La función de Deluge que, al crear un trato, actualiza su contacto |
| `deluge/README.md` | Qué hace la función, cómo se crea en Zoho y cómo se prueba |

## En qué orden se hace

1. **Los ejercicios del día 13.** La cuenta de prueba, los leads, el campo **Origen Cielum**, la vista y la regla de la tarea, como dice `../../semana-3/zoho/README.md`.
2. **La función de Deluge.** El campo **Ultimo trato** en Contacts y la regla `Actualizar contacto al crear trato`, como dice `deluge/README.md`.
3. **Las capturas.** Guárdalas en `capturas/` con los nombres que pide `configuracion.md`.
4. **La colección de Postman**, como se explica abajo.

## La colección zoho-crm

| Carpeta | Peticiones | Qué hace |
|---|---|---|
| 0. Tokens | 2 | Cambia el grant token del Self Client por el access token y el refresh token, y renueva el access token |
| 1. Leads | 7 | Crea un lead de origen Web, lo consulta, lista los leads, lo actualiza, lo busca por correo y con COQL, y lo convierte en contacto y cuenta |
| 2. Tratos y función Deluge | 2 | Crea un trato para el contacto y revisa que la función Deluge haya llenado el campo **Ultimo trato** del contacto |
| 3. Limpieza | 3 | Borra el trato, el contacto y la cuenta que creó la colección |

En total son 14 peticiones con 19 pruebas.

**Cómo correrla:**
1. Crea el Self Client y genera el grant token, como dice el ejercicio avanzado en `../../semana-3/zoho/README.md`.
2. En Postman, importa los dos archivos de `postman/` y escoge el entorno **zoho-crm**.
3. Llena el **Current value** de `client_id`, `client_secret` y `grant_token`.
4. Clic derecho en la colección **zoho-crm** → **Run collection** → **Run**.

**Lo que la colección hace sola:**
- Antes de cada petición, si el access token ya venció, pide uno nuevo con el refresh token. No hay que renovarlo a mano cada hora.
- Guarda los ids que crea (lead, contacto, cuenta y trato) en variables de la colección. Así cada petición usa el registro que creó la anterior.
- Manda el token en el header `Authorization: Zoho-oauthtoken {{access_token}}`, configurado una sola vez en la autorización de la colección.

La colección se probó con Newman contra un servidor que imita las respuestas de Zoho, con los mismos códigos y el mismo formato de la documentación de la API v8. Pasaron las 19 pruebas, y también la renovación automática con un token vencido. Con una cuenta real, los resultados dependen de cómo esté configurada:
- **La prueba del campo Ultimo trato** solo pasa si la regla y la función de Deluge están activas.
- **La búsqueda por correo** puede responder 204 si se envía justo después de crear el lead.

## Variables

| Variable | Dónde | Qué es |
|---|---|---|
| `accounts_url` | Entorno | El servidor de cuentas del data center: `https://accounts.zoho.com` para `.com` |
| `api_domain` | Entorno | El dominio de la API. Se llena solo con la respuesta de los tokens |
| `client_id`, `client_secret` | Entorno | Los datos del Self Client |
| `grant_token` | Entorno | El código de la pestaña Generate Code. Se borra solo después de usarlo |
| `access_token`, `refresh_token`, `token_vence` | Entorno | Los tokens y la hora en que vence el access token. Se llenan solos |
| `lead_email`, `nombre_trato` | Colección | Los datos de prueba |
| `lead_id`, `contact_id`, `account_id`, `deal_id`, `fecha_cierre` | Colección | Los ids y la fecha que guarda cada petición para la siguiente |

Los valores secretos van solo en **Current value**. El entorno de este repo va vacío, y así se debe quedar.
