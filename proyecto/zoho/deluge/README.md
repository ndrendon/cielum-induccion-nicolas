# Función Deluge: actualizar el contacto al crear un trato

`actualizar_contacto_del_trato.dg` es una función de Deluge para Zoho CRM. Cuando se crea un trato (Deal), escribe el nombre del trato en el campo **Ultimo trato** del contacto del trato. Así, al abrir un contacto, se ve cuál fue su último negocio sin entrar a sus tratos.

## Qué hace, paso a paso

1. Recibe `dealId`, el id del trato que se acaba de crear.
2. Trae el trato con `zoho.crm.v8.getRecordById`, solo con los campos `Deal_Name` y `Contact_Name`.
3. Si el trato no tiene contacto, solo deja un mensaje con `info` y no cambia nada.
4. Si tiene contacto, arma un `Map` con el campo `Ultimo_trato` y el nombre del trato.
5. Actualiza el contacto con `zoho.crm.v8.updateRecord` y muestra la respuesta con `info`.

Como la actualización se hace sin el parámetro de opciones, no dispara las reglas de flujo de trabajo de Contacts. Así no hay riesgo de que una regla llame a otra sin parar.

## Cómo se crea en Zoho CRM

**1. Crear el campo en Contacts**

1. ⚙ **Configuración** → **Personalización** → **Módulos y campos** → **Contacts (Contactos)** → **Diseños** → **Estándar**.
2. Arrastra un campo **Línea única** (*Single Line*) a la sección **Información del contacto**.
3. Ponle de etiqueta `Ultimo trato`, sin tilde, para que el nombre de API quede `Ultimo_trato`.
4. Dale **Guardar y cerrar**.

Para revisar el nombre de API: ⚙ **Configuración** → **Developer Hub** → **API y SDK** → **Nombres de API** → **Contacts**. Si no sale `Ultimo_trato`, cámbialo en la línea `datos.put("Ultimo_trato", ...)` de la función.

**2. Crear la regla y la función**

1. ⚙ **Configuración** → **Automatización** → **Reglas de flujo de trabajo** → **Crear regla**.
2. Módulo **Deals (Tratos)**, nombre `Actualizar contacto al crear trato`.
3. Cuándo: **Al realizar una acción en un registro** → **Crear**.
4. Condición: **Todos los tratos**.
5. En **Acciones instantáneas** escoge **Función** → **Nueva función** → **Escribir tu propia función**.
6. Nombre de la función: `actualizar_contacto_del_trato`.
7. En el editor, dale **Editar argumentos**. Agrega el argumento `dealId` y escoge el campo **Deal Id** del módulo Deals.
8. Copia el contenido de `actualizar_contacto_del_trato.dg` en el editor. Si el editor ya muestra la línea `void automation.actualizar_contacto_del_trato(Int dealId)`, pega solo lo que va entre las llaves `{ }`.
9. Dale **Guardar y ejecutar** para probarla con el id de un trato que ya exista. Después dale **Guardar** y guarda la regla.

## Cómo probarla

- **A mano:** crea un trato desde un contacto. Después abre el contacto: el campo **Ultimo trato** debe tener el nombre del trato.
- **Con Postman:** corre la colección `../postman/zoho-crm.postman_collection.json`.
  1. La petición **Crear trato del contacto** crea el trato con `"trigger": ["workflow"]`, para que la regla se ejecute.
  2. **Ver el contacto actualizado por la función** revisa que `Ultimo_trato` tenga el nombre del trato.
- **Si no se actualiza:**
  - Revisa en la regla que la función esté guardada y que la regla esté activa.
  - En el editor de la función, dale **Guardar y ejecutar** con el id de un trato y revisa el mensaje que deja `info`.

## Funciones de Deluge que usa

| Función | Qué hace |
|---|---|
| `Map()` y `put` | Crean un mapa de clave y valor y le agregan datos |
| `zoho.crm.v8.getRecordById("Deals", dealId, consulta)` | Trae un registro por su id. `consulta` dice qué campos traer (`fields` es obligatorio) |
| `trato.get("Contact_Name")` | Lee un campo del registro. Un campo de búsqueda trae un mapa con `name` e `id` |
| `toLong()` | Convierte el id, que llega como texto, a número |
| `zoho.crm.v8.updateRecord("Contacts", id, datos)` | Actualiza los campos del mapa `datos` en el registro |
| `info` | Muestra un mensaje en el resultado cuando se prueba la función |

Fuentes: <https://www.zoho.com/deluge/help/crm/get-record-by-id-V8.html> · <https://www.zoho.com/deluge/help/crm/update-record-V8.html>
