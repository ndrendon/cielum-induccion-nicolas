# Bitácora Día 13 · Zoho CRM

**Fecha:** 19-10-2026

**Horas invertidas:** 6 h (autoinvestigación 2 h · práctica 2 h · reto 2 h)

## Autoinvestigación básica

1. **Pregunta:** ¿Qué es un CRM y para qué lo usa una empresa?

   **Respuesta (con mis palabras):** Un CRM (*Customer Relationship Management*, gestión de la relación con los clientes) es un sistema donde una empresa guarda en un solo lugar la información de sus clientes y de las personas que podrían llegar a serlo: sus datos de contacto, las llamadas, los correos, las reuniones, las ventas que están en curso y lo que ya compraron. La empresa lo usa para que todo el equipo vea la misma información, para hacerle seguimiento a cada cliente sin que se olvide nada, para saber en qué etapa va cada venta y para automatizar tareas que se repiten, como asignarle un cliente nuevo a un vendedor o mandar un correo. También sirve para sacar reportes, por ejemplo cuántas ventas se cerraron en el mes o de dónde llegan los clientes. Zoho CRM es uno de estos sistemas y funciona en la nube, desde el navegador.

   **Fuente:** <https://help.zoho.com/portal/es/kb/crm/getting-started/articles/get-started-introduction-zoho-crm>

2. **Pregunta:** Módulos estándar: Leads, Contacts, Accounts, Deals. Conversión de Lead.

   **Respuesta (con mis palabras):** En Zoho CRM la información está organizada en módulos, y cada módulo guarda un tipo de registro. Los **Leads** (Posibles clientes) son personas o empresas que mostraron interés, pero todavía no se sabe si van a comprar; por ejemplo, alguien que llenó un formulario en la página web. Los **Contacts** (Contactos) son las personas con las que la empresa ya tiene una relación. Las **Accounts** (Cuentas) son las empresas u organizaciones, y una cuenta puede tener varios contactos. Los **Deals** (Tratos) son las ventas u oportunidades de negocio, con su monto, su etapa y la fecha en que se espera cerrarlas. La **conversión de un Lead** se hace cuando ese posible cliente ya está calificado, es decir, cuando de verdad tiene interés. Con sus datos, Zoho crea un contacto y, si el lead tiene nombre de empresa, también una cuenta; en ese mismo paso se puede crear un trato. La conversión no se puede deshacer, y si ya existe un contacto o una cuenta parecidos, Zoho deja unirlos en lugar de crear registros repetidos.

   **Fuente:** <https://help.zoho.com/portal/en/kb/crm/manage-crm-data/leads/articles/convert-leads>

3. **Pregunta:** Campos personalizados, layouts, vistas y listas.

   **Respuesta (con mis palabras):** Cada módulo trae campos estándar, como el nombre, el correo o el teléfono. Un **campo personalizado** es un campo nuevo que la empresa agrega porque necesita guardar un dato que no viene, por ejemplo "Origen Cielum". Se crea en la configuración del módulo, escogiendo el tipo: texto, número, fecha, casilla o lista de selección (*picklist*), que tiene opciones fijas para escoger. Un **layout** (diseño de página) es la forma en que se organizan los campos en el formulario de un módulo: qué campos salen, en qué secciones, en qué orden y cuáles son obligatorios. Un módulo puede tener varios layouts, por ejemplo uno para cada tipo de cliente. Una **vista** es un filtro guardado sobre los registros de un módulo, con las columnas que se quieren ver; por ejemplo, "Leads de origen Web". La **lista** es la pantalla donde se ven los registros de un módulo en forma de tabla: ahí se escoge la vista, se ordena, se filtra y se pueden hacer acciones sobre varios registros a la vez.

   **Fuente:** <https://www.zoho.com/crm/help/customization/> · <https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-page-layouts/articles/user-layout-customization>

4. **Pregunta:** Roles, perfiles y permisos.

   **Respuesta (con mis palabras):** Sirven para controlar qué puede ver y qué puede hacer cada usuario. El **rol** define qué registros puede ver un usuario según su lugar en la jerarquía de la empresa: por ejemplo, un gerente ve los registros de los vendedores que están debajo de él. El **perfil** define qué puede hacer: a qué módulos entra y si puede ver, crear, editar o borrar registros, importar, exportar o entrar a la configuración. Zoho trae perfiles como Administrador y Estándar, y se pueden crear otros. Los **permisos** son cada una de esas autorizaciones que se marcan en el perfil. Cada usuario tiene un rol y un perfil al mismo tiempo: el rol responde qué registros ve, y el perfil responde qué puede hacer con ellos. Además, en las reglas para compartir datos se define si los registros de un módulo son privados o si los ve toda la organización.

   **Fuente:** <https://help.zoho.com/portal/es/kb/crm/users-and-control/data-security-types/articles/gestionar-usuarios-funciones-y-permisos> · <https://help.zoho.com/portal/es/kb/crm/users-and-control/profile-management/articles/creaci%C3%B3n-de-perfiles>

5. **Pregunta:** Importación de datos y reportes/dashboards.

   **Respuesta (con mis palabras):** La **importación** sirve para cargar muchos registros de una vez desde un archivo, por ejemplo un CSV o un Excel, en lugar de crearlos uno por uno. En el módulo se escoge **Importar**, se sube el archivo y se relaciona cada columna con un campo del CRM; eso se llama mapear. Zoho avisa si hay registros repetidos y deja escoger si los salta, los actualiza o los crea igual. Al terminar muestra cuántos registros se agregaron y cuántos no, y la importación queda en un historial. Un **reporte** es una consulta sobre los datos de uno o varios módulos, con filtros y agrupaciones, por ejemplo "leads por origen" o "tratos cerrados por vendedor"; se puede ver como tabla o como gráfico. Un **dashboard** (panel) junta varios gráficos e indicadores en una sola pantalla, para ver de un vistazo cómo va el negocio.

   **Fuente:** <https://help.zoho.com/portal/en/kb/crm-nextgen/data-administration/import-data/articles/nextgen-import-data> · <https://help.zoho.com/portal/en/kb/crm/analytics-and-dashboards/data-analytics-overview/articles/data-analytics-overview>

## Autoinvestigación avanzada

1. **Workflow rules, asignación automática y blueprints.**

   Una **regla de flujo de trabajo** (*workflow rule*) hace algo sola cuando pasa algo en un módulo. Tiene tres partes: cuándo se ejecuta (al crear, editar o borrar un registro, cuando cambia un campo o en una fecha), a qué registros aplica (una condición, por ejemplo "Origen Cielum es Web") y qué hace. Las acciones pueden ser inmediatas o programadas para más tarde: mandar un correo, crear una tarea, actualizar un campo, llamar un webhook o ejecutar una función de Deluge. La **asignación automática** se hace con las reglas de asignación, que deciden a qué usuario le toca cada registro nuevo; por ejemplo, los leads de una ciudad para un vendedor, o repartirlos por turnos entre varios (*round robin*). Un **blueprint** define un proceso paso a paso, con estados y transiciones: en qué orden debe avanzar un registro, quién puede moverlo, qué datos hay que llenar antes de pasar al siguiente estado y qué acciones se ejecutan en cada paso. Así nadie se salta etapas del proceso, por ejemplo calificar un lead antes de convertirlo.

   **Fuente:** <https://help.zoho.com/portal/en/kb/crm/automate-business-processes/overview/articles/get-started-automate-business-process> · <https://help.zoho.com/portal/en/kb/crm/automate-business-processes/workflows/articles/configuring-workflow-rules> · <https://help.zoho.com/portal/en/kb/crm-nextgen/automate-business-processes/assignment-rules/articles/nextgen-set-assignment-rules>

2. **Deluge: qué es y para qué se usa en funciones personalizadas.**

   Deluge es el lenguaje de programación de Zoho. Se usa para escribir **funciones personalizadas** cuando lo que se necesita no se puede hacer solo con la configuración, por ejemplo traer datos de otro módulo, hacer un cálculo o llamar a otro sistema. Una función se puede ejecutar desde una regla de flujo de trabajo, desde un blueprint, desde un botón o de forma programada. Recibe argumentos, como el id del registro que disparó la regla, y trae tareas listas para trabajar con el CRM, como `zoho.crm.v8.getRecordById` para traer un registro y `zoho.crm.v8.updateRecord` para actualizarlo, sin manejar tokens a mano. Las funciones se escriben y se prueban en el editor que trae el mismo CRM, y con `info` se muestran mensajes mientras se prueban. En el reto hice una función que, cuando se crea un trato, actualiza un campo de su contacto.

   **Fuente:** <https://www.zoho.com/crm/developer/docs/functions/language-guide/deluge.html> · <https://www.zoho.com/deluge/help/crm/update-record-V8.html> · <https://www.zoho.com/deluge/help/crm/get-record-by-id-V8.html>

3. **API REST de Zoho CRM (versión vigente en la documentación): OAuth 2.0 con Self Client, access token vs refresh token, scopes, data center (`.com` vs otros dominios).**

   La versión vigente de la API es la **v8**, y sus direcciones empiezan por `/crm/v8/`, por ejemplo `/crm/v8/Leads`. Para usarla hay que autenticarse con **OAuth 2.0**. Con el **Self Client**, que se crea en `api-console.zoho.com`, se usa la API con la cuenta propia, sin una página de inicio de sesión. Ahí se obtienen el `client_id` y el `client_secret`, y en la pestaña **Generate Code** se escriben los scopes y la duración, y se genera el *grant token*: un código de un solo uso que dura pocos minutos (3 por defecto). Ese código se cambia por los tokens con `POST {accounts}/oauth/v2/token` y `grant_type=authorization_code`. La respuesta trae el **access token**, que dura una hora y se manda en cada petición en el header `Authorization: Zoho-oauthtoken <access_token>`, y el **refresh token**, que no vence hasta que se revoca y sirve para pedir un access token nuevo con `grant_type=refresh_token`, sin volver a generar el código. Hay límites: máximo 10 access tokens por refresh token cada 10 minutos y máximo 20 refresh tokens por usuario. Los **scopes** son los permisos que se le dan al token, con la forma servicio.alcance.operación, por ejemplo `ZohoCRM.modules.leads.ALL` o `ZohoCRM.coql.READ`. Zoho guarda los datos en varios **data centers** (Estados Unidos, Europa, India, Australia, Japón, Canadá, China y Arabia Saudita), y cada uno tiene sus propios dominios: una cuenta del data center de Estados Unidos (`.com`) usa `accounts.zoho.com` para los tokens y `www.zohoapis.com` para la API, y una de Europa usa `accounts.zoho.eu` y `www.zohoapis.eu`. Si se usa el dominio de otro data center, no funciona. La respuesta de los tokens trae el campo `api_domain`, con el dominio de la API que le corresponde a la cuenta.

   **Fuente:** <https://www.zoho.com/crm/developer/docs/api/v8/access-refresh.html> · <https://www.zoho.com/crm/developer/docs/api/v8/token-validity.html> · <https://www.zoho.com/crm/developer/docs/api/refresh.html> · <https://www.zoho.com/crm/developer/docs/api/v8/scopes.html> · <https://www.zoho.com/crm/developer/docs/api/v8/multi-dc.html>

4. **CRUD de registros por API, búsqueda y COQL.**

   Con la API se crean, consultan, actualizan y borran registros de cualquier módulo, usando el nombre de API del módulo (`Leads`, `Contacts`, `Accounts`, `Deals`) y de los campos (`Last_Name`, `Company`, `Email`), no el nombre que se ve en la pantalla. Para **crear** se usa `POST /crm/v8/Leads`, con los registros dentro de `data` (hasta 100 por llamada); si se agrega `"trigger": ["workflow"]`, se ejecutan las reglas de flujo de trabajo. Para **consultar** se usa `GET /crm/v8/Leads?fields=Last_Name,Company`: el parámetro `fields` es obligatorio y trae hasta 200 registros por página; un solo registro se trae con `GET /crm/v8/Leads/{id}`. Para **actualizar** se usa `PUT /crm/v8/Leads/{id}` con los campos que cambian, y para **borrar**, `DELETE /crm/v8/Leads/{id}`. La **búsqueda** se hace con `GET /crm/v8/Leads/search`, con un criterio como `criteria=(Last_Name:equals:Pérez)` o con `email`, `phone` o `word`. **COQL** (*CRM Object Query Language*) es el lenguaje de consultas de Zoho CRM: la consulta se escribe con `select`, `from` y `where`, y se manda `POST /crm/v8/coql` con el cuerpo `{"select_query": "select Last_Name, Company from Leads where Lead_Source = 'Web' limit 10"}`. Necesita el scope `ZohoCRM.coql.READ`, acepta `where`, `order by`, `group by` y funciones como `count`, y trae hasta 200 registros por llamada.

   **Fuente:** <https://www.zoho.com/crm/developer/docs/api/v8/get-records.html> · <https://www.zoho.com/crm/developer/docs/api/v8/Get-Records-through-COQL-Query.html> · <https://www.zoho.com/crm/developer/docs/api/v8/COQL-Overview.html>

5. **Webhooks y límites de API.**

   Un **webhook** es una acción que manda una petición HTTP a una dirección externa cuando se cumple una regla de flujo de trabajo, con datos del registro como parámetros o en el cuerpo, por ejemplo en JSON. Sirve para avisarle a otro sistema que pasó algo en el CRM, por ejemplo que se creó un lead. Se crea en **Configuración → Automatización → Acciones → Webhooks** y después se agrega como acción en la regla. En cuanto a los **límites**, Zoho cuenta las llamadas a la API con **créditos** en una ventana de 24 horas. La cantidad depende de la edición y del número de usuarios; la edición gratis tiene 5.000 créditos. Cada llamada gasta créditos: la mayoría gasta 1, y crear o actualizar registros gasta 1 por cada 10 registros. También hay un límite de llamadas al mismo tiempo; cuando se pasa, la API responde el error `TOO_MANY_REQUESTS`. Por eso conviene crear o actualizar varios registros en una sola llamada en lugar de uno por uno, y no pedir un token nuevo en cada petición.

   **Fuente:** <https://help.zoho.com/portal/kb/articles/webhooks-workflow> · <https://zoho.com/crm/developer/docs/api/api-limits.html>

## Lo que aprendí hoy (3 cosas)

- Qué es un CRM y cómo se organiza Zoho CRM: los módulos Leads, Contacts, Accounts y Deals, la conversión de un lead, los campos personalizados, los layouts, las vistas, y los roles y perfiles.
- A automatizar en Zoho CRM: un campo de lista "Origen Cielum", una vista con filtro y una regla de flujo de trabajo que crea una tarea cuando llega un lead de la Web. También una función de Deluge que actualiza el contacto cuando se le crea un trato.
- A usar la API v8 de Zoho CRM con OAuth 2.0: crear un Self Client, cambiar el grant token por el access token y el refresh token, y en Postman crear, consultar, actualizar, buscar (también con COQL) y convertir leads, con la renovación automática del access token.

## Lo que no entendí o me costó

- La diferencia entre el grant token, el access token y el refresh token, y cuál se manda en cada petición: es el access token, en el header `Authorization: Zoho-oauthtoken ...`.
- Que cada cuenta de Zoho vive en un data center y hay que usar sus dominios. Si se usa el de otro data center, los tokens no sirven.
- Que en la API se usan los nombres de API de los módulos y los campos (`Leads`, `Last_Name`, `Origen_Cielum`), no los nombres que se ven en la pantalla.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| `git switch main` falló con `Your local changes to the following files would be overwritten by checkout: proyecto/postman/reporte.html` | Al correr la colección de Postman con Newman, el reporte se volvió a generar y quedó con cambios sin guardar en Git | Descarté ese cambio con `git restore proyecto/postman/reporte.html` y después sí pude cambiar de rama |
| La bitácora del día 12 no estaba en GitHub y el Pull Request de `feature/vue` apuntaba a `main` | No había hecho el `push` de `main`, y al crear el PR quedó la base que sale por defecto | Hice el commit y el `push` de la bitácora en `main`, y en GitHub cambié la base del PR a `feature/react` |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para responder la autoinvestigación con palabras sencillas, armar el CSV de los leads, las guías de configuración, las colecciones de Postman y la función Deluge, y para probar las colecciones con un servidor que imita las respuestas de Zoho antes de usarlas con mi cuenta.
- ¿Qué aprendí de eso? Que antes de usar una API hay que leer la documentación de la versión vigente, porque cambian cosas entre versiones: en la v8, el parámetro `fields` es obligatorio al listar registros y COQL trae máximo 200 registros por llamada.

## Autoevaluación del tema (1-5): 4
