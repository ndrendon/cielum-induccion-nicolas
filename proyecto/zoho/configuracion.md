# Configuración de Zoho CRM

Lo que se configuró en Zoho CRM para el proyecto integrador (parte 6), con sus capturas de pantalla.

## La cuenta

| Dato | Valor |
|---|---|
| Edición | Prueba gratis |
| Data center | Estados Unidos (`.com`): `crm.zoho.com`, `accounts.zoho.com` y `www.zohoapis.com` |
| Módulos que se usan | Leads, Contacts, Accounts, Deals y Tasks |
| Versión de la API | v8 |

Si tu cuenta quedó en otro data center, cambia esta tabla y el `accounts_url` del entorno de Postman.

## 1. Campo personalizado "Origen Cielum"

| Propiedad | Valor |
|---|---|
| Módulo | Leads |
| Etiqueta | Origen Cielum |
| Nombre de API | `Origen_Cielum` |
| Tipo | Lista de selección (*Pick List*) |
| Opciones | Web, Referido, Evento |
| Diseño | Estándar, en la sección de información del lead |

![Campo Origen Cielum en el diseño de Leads](capturas/01-campo-origen-cielum.png)

## 2. Vista "Leads de origen Web"

| Propiedad | Valor |
|---|---|
| Módulo | Leads |
| Criterio | Origen Cielum es Web |
| Columnas | Nombre, Empresa, Correo electrónico, Ciudad, Origen Cielum |
| Resultado con los datos del CSV | 4 leads: Laura Restrepo, Julián Cardona, Valentina Ortiz y Felipe Castaño |

![Vista Leads de origen Web](capturas/02-vista-leads-web.png)

## 3. Regla "Tarea para leads de la Web"

| Propiedad | Valor |
|---|---|
| Módulo | Leads |
| Cuándo | Al crear un registro |
| Condición | Origen Cielum es Web |
| Acción instantánea | Tarea: "Llamar al lead que llegó por la Web", vence 1 día después de la regla, prioridad alta, asignada al propietario del lead |

![Regla de flujo de trabajo Tarea para leads de la Web](capturas/03-workflow-tarea-web.png)

![La tarea creada en un lead de origen Web](capturas/04-tarea-creada.png)

## 4. Campo "Ultimo trato" en Contacts

| Propiedad | Valor |
|---|---|
| Módulo | Contacts |
| Etiqueta | Ultimo trato |
| Nombre de API | `Ultimo_trato` |
| Tipo | Línea única (*Single Line*) |
| Lo llena | La función de Deluge `actualizar_contacto_del_trato` |

![Campo Ultimo trato en el diseño de Contacts](capturas/05-campo-ultimo-trato.png)

## 5. Regla "Actualizar contacto al crear trato" y su función de Deluge

| Propiedad | Valor |
|---|---|
| Módulo | Deals |
| Cuándo | Al crear un registro |
| Condición | Todos los tratos |
| Acción instantánea | Función `actualizar_contacto_del_trato`, con el argumento `dealId` = Deal Id |
| Código | [`deluge/actualizar_contacto_del_trato.dg`](deluge/actualizar_contacto_del_trato.dg) |

![Regla Actualizar contacto al crear trato](capturas/06-workflow-funcion-deluge.png)

![La función de Deluge en el editor](capturas/07-funcion-deluge.png)

![Un contacto con el campo Ultimo trato lleno por la función](capturas/08-contacto-actualizado.png)

## 6. Self Client para la API

| Propiedad | Valor |
|---|---|
| Consola | <https://api-console.zoho.com> |
| Tipo de cliente | Self Client |
| Scopes | `ZohoCRM.modules.ALL,ZohoCRM.coql.READ` |
| Duración del grant token | 10 minutos |

En la captura no debe verse el **Client Secret**.

![Self Client en la consola de la API](capturas/09-self-client.png)

## 7. La colección de Postman

El resultado de correr la colección **zoho-crm** (`postman/`) con el entorno **zoho-crm**.

![Resultado de la colección zoho-crm en Postman](capturas/10-postman-zoho-crm.png)

## Capturas que faltan por tomar

Guárdalas en `capturas/` con estos nombres, para que salgan en este documento:

- [ ] `01-campo-origen-cielum.png`: el diseño de Leads con el campo y sus tres opciones.
- [ ] `02-vista-leads-web.png`: la vista con los 4 leads.
- [ ] `03-workflow-tarea-web.png`: la regla con su condición y la acción de tarea.
- [ ] `04-tarea-creada.png`: un lead de origen Web con la tarea en Actividades abiertas.
- [ ] `05-campo-ultimo-trato.png`: el diseño de Contacts con el campo.
- [ ] `06-workflow-funcion-deluge.png`: la regla de Deals con la función.
- [ ] `07-funcion-deluge.png`: el código en el editor de funciones.
- [ ] `08-contacto-actualizado.png`: un contacto con el campo Ultimo trato lleno.
- [ ] `09-self-client.png`: el Self Client, sin mostrar el Client Secret.
- [ ] `10-postman-zoho-crm.png`: el resultado de la colección en Postman.
