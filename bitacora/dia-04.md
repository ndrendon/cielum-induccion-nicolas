# Bitácora Día 04 · Python para scripts, datos y automatización

**Fecha:** 05-10-2026

**Horas invertidas:** 6 h (autoinvestigación 3 h · práctica 2 h · reto 1 h)

## Autoinvestigación básica

1. **Pregunta:** Tipos de datos, listas, tuplas, diccionarios, sets: ¿cuándo usar cada uno?

   **Respuesta (con mis palabras):** Python tiene tipos básicos como `int` (enteros), `float` (decimales), `str` (texto), `bool` (`True` o `False`) y `None` (sin valor), y no hay que declarar el tipo porque Python lo detecta solo. Para guardar varios datos hay cuatro estructuras. La lista (`[]`) es ordenada y se puede modificar, así que la uso cuando voy a agregar o quitar elementos, como una lista de productos; se parece a `List<T>` de C#. La tupla (`()`) también es ordenada, pero no se puede modificar, entonces sirve para datos fijos, como unas coordenadas. El diccionario (`{clave: valor}`) guarda pares de clave y valor, y lo uso cuando quiero buscar algo por su clave, como el precio de un producto por su nombre. El set (`{}` con valores sueltos) no guarda repetidos ni tiene orden, y sirve para quitar duplicados o comparar grupos, como un `HashSet`.

   **Ejemplo propio:**

   ```python
   productos = ["Teclado", "Mouse"]
   productos.append("Monitor")

   coordenada_medellin = (6.2442, -75.5812)

   precios = {"Teclado": 180000, "Mouse": 65000}
   precios["Monitor"] = 720000

   ciudades = {"Medellín", "Cali", "Medellín", "Bogotá"}

   print(productos)
   print(coordenada_medellin[0])
   print(precios["Mouse"])
   print(len(ciudades))
   ```

   La lista quedó con tres productos porque le agregué "Monitor" con `append`. De la tupla saco la latitud con el índice `0`, pero no la puedo cambiar porque las tuplas no se pueden modificar. En el diccionario busco el precio del mouse por su nombre y agrego el monitor con una clave nueva. Y aunque escribí "Medellín" dos veces en el set, `len` da `3` porque el set no guarda repetidos.

   **Fuente:** <https://docs.python.org/es/3/tutorial/datastructures.html>

2. **Pregunta:** Funciones, parámetros por defecto, `*args` y `**kwargs`.

   **Respuesta (con mis palabras):** Una función se crea con `def`, recibe parámetros y devuelve un resultado con `return`. Los parámetros por defecto ya tienen un valor asignado, así que si no los envío se usa ese valor; sirven para opciones que casi siempre son iguales. `*args` permite recibir cualquier cantidad de argumentos sin nombre, y dentro de la función llegan como una tupla; se parece a `params` en C#. `**kwargs` recibe cualquier cantidad de argumentos con nombre, y llegan como un diccionario. Algo que leí es que no se debe poner una lista como valor por defecto (`def agregar(lista=[])`), porque esa misma lista se comparte entre todas las llamadas.

   **Ejemplo propio:**

   ```python
   def saludar(nombre, saludo="Hola"):
       return f"{saludo}, {nombre}"


   def sumar(*numeros):
       return sum(numeros)


   def crear_perfil(nombre, **datos):
       return {"nombre": nombre, **datos}


   print(saludar("Nicolas"))
   print(saludar("Nicolas", "Buenos días"))
   print(sumar(10, 20, 30))
   print(crear_perfil("Nicolas", empresa="Cielum", semestre=5))
   ```

   La primera vez llamo a `saludar` solo con el nombre, entonces usa el saludo por defecto e imprime "Hola, Nicolas"; la segunda vez le paso otro saludo y lo reemplaza. A `sumar` le puedo pasar los números que quiera porque `*numeros` los recibe todos como una tupla, y da `60`. En `crear_perfil`, los datos con nombre (`empresa` y `semestre`) llegan en `**datos` como un diccionario y los junto con el nombre, por eso imprime `{'nombre': 'Nicolas', 'empresa': 'Cielum', 'semestre': 5}`.

   **Fuente:** <https://docs.python.org/es/3/tutorial/controlflow.html>

3. **Pregunta:** ¿Qué es un entorno virtual (`venv`) y por qué se usa? ¿Qué es `requirements.txt`?

   **Respuesta (con mis palabras):** Un entorno virtual es una carpeta con una copia aislada de Python y sus propias librerías para un proyecto. Se usa para que cada proyecto tenga las versiones que necesita sin afectar a los demás ni al Python instalado en el computador; por ejemplo, un proyecto puede usar una versión de pandas y otro una diferente. Es parecido a como en .NET cada proyecto tiene sus paquetes de NuGet, o en Node cada proyecto tiene su `node_modules`. `requirements.txt` es un archivo de texto con la lista de librerías que necesita el proyecto, y opcionalmente sus versiones, para que otra persona pueda instalar lo mismo con un solo comando. La carpeta del entorno virtual no se sube a Git; lo que se sube es el `requirements.txt`.

   **Ejemplo propio:**

   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install pandas openpyxl pytest
   pip freeze > requirements.txt
   pip install -r requirements.txt
   ```

   Con el primer comando se crea el entorno virtual en la carpeta `.venv`, y con el segundo se activa en PowerShell; en la terminal aparece `(.venv)` al inicio de la línea. Después instalo las librerías, que quedan solo dentro de ese entorno. Con `pip freeze > requirements.txt` guardo la lista de lo que instalé con sus versiones, y otra persona que clone el repositorio solo tiene que crear su entorno y ejecutar `pip install -r requirements.txt` para tener lo mismo.

   **Fuente:** <https://docs.python.org/es/3/tutorial/venv.html>

4. **Pregunta:** Lectura y escritura de archivos, manejo de excepciones (`try/except/finally`).

   **Respuesta (con mis palabras):** Para trabajar con archivos se usa `open()` indicando el modo: `"r"` para leer, `"w"` para escribir (borra lo que había) y `"a"` para agregar al final. Lo recomendado es usarlo con `with`, porque así el archivo se cierra solo al terminar, y poner `encoding="utf-8"` para que las tildes no salgan dañadas, sobre todo en Windows. Para manejar errores se usa `try` para el código que puede fallar, `except` para atrapar un error específico, como `FileNotFoundError` o `ValueError`, y `finally` para el código que se ejecuta siempre, haya error o no. Funciona igual que `try/catch/finally` en C#.

   **Ejemplo propio:**

   ```python
   with open("notas.txt", "w", encoding="utf-8") as archivo:
       archivo.write("Nicolas,4.2\n")
       archivo.write("Ana,3.8\n")

   try:
       with open("notas.txt", encoding="utf-8") as archivo:
           for linea in archivo:
               nombre, nota = linea.strip().split(",")
               print(f"{nombre}: {float(nota)}")
       with open("no_existe.txt", encoding="utf-8") as archivo:
           print(archivo.read())
   except FileNotFoundError as error:
       print(f"No se encontró el archivo: {error.filename}")
   finally:
       print("Lectura terminada")
   ```

   Primero creo el archivo `notas.txt` con dos líneas usando el modo `"w"`. Luego, dentro del `try`, lo leo línea por línea, separo el nombre y la nota con `split(",")` y convierto la nota a número. Después intento abrir un archivo que no existe, entonces Python lanza `FileNotFoundError`, y el `except` lo atrapa y muestra un mensaje en vez de que el programa se detenga. Al final, el `finally` imprime "Lectura terminada" pase lo que pase.

   **Fuente:** <https://docs.python.org/es/3/tutorial/inputoutput.html> · <https://docs.python.org/es/3/tutorial/errors.html>

5. **Pregunta:** List comprehensions y dict comprehensions.

   **Respuesta (con mis palabras):** Son una forma corta de crear una lista o un diccionario a partir de otra colección en una sola línea, en vez de hacer un `for` con `append`. La forma de una list comprehension es `[expresión for elemento in colección if condición]`, donde el `if` es opcional y sirve para filtrar. La dict comprehension es igual, pero con llaves y `clave: valor`. Se parecen a usar `map` y `filter` en JavaScript, o `Select` y `Where` de LINQ en C#. Conviene usarlas cuando quedan fáciles de leer; si la lógica es muy larga, es mejor un `for` normal.

   **Ejemplo propio:**

   ```python
   precios = [180000, 65000, 720000, 35000]

   con_iva = [round(precio * 1.19) for precio in precios]
   mayores_a_100000 = [precio for precio in precios if precio > 100000]

   productos = ["Teclado", "Mouse", "Monitor"]
   letras_por_producto = {producto: len(producto) for producto in productos}

   print(con_iva)
   print(mayores_a_100000)
   print(letras_por_producto)
   ```

   En `con_iva` recorro cada precio, lo multiplico por 1.19 y obtengo una lista nueva con los precios con IVA: `[214200, 77350, 856800, 41650]`. En `mayores_a_100000` uso el `if` para quedarme solo con los precios mayores a 100.000. Y en `letras_por_producto` creo un diccionario donde la clave es el nombre del producto y el valor es cuántas letras tiene. Con un `for` normal esto me hubiera tomado varias líneas.

   **Fuente:** <https://docs.python.org/es/3/tutorial/datastructures.html>

## Autoinvestigación avanzada

1. **POO en Python: clases, herencia, `dataclasses`, métodos mágicos (`__str__`, `__repr__`).**

   En Python una clase se crea con `class` y el constructor es el método `__init__`, que recibe `self` como primer parámetro; `self` es como el `this` de C#, pero en Python hay que escribirlo siempre. La herencia se hace poniendo la clase padre entre paréntesis, por ejemplo `class Gerente(Empleado):`, y con `super().__init__()` se llama al constructor del padre. Los `dataclasses` sirven para clases que principalmente guardan datos: con el decorador `@dataclass`, Python crea solo el `__init__`, el `__repr__` y la comparación con `==`, así no tengo que escribir todo eso a mano; se parecen a los `record` de C#. Los métodos mágicos son los que empiezan y terminan con doble guion bajo, y Python los llama automáticamente: `__str__` define cómo se ve el objeto cuando se muestra a un usuario, y `__repr__` cómo se ve para el desarrollador, por ejemplo al depurar. En el ejercicio intermedio usé `@dataclass` para `Producto` y le agregué un `__str__` para mostrarlo de forma clara en los logs.

2. **Decoradores y context managers (`with`).**

   Un decorador es una función que recibe otra función y le agrega comportamiento sin modificar su código, y se usa escribiendo `@nombre` encima de la función. Por dentro, el decorador crea una función nueva que hace algo antes y después de llamar a la original. En el ejercicio avanzado hice `@medir_tiempo`, que toma el tiempo antes y después de ejecutar la función y registra con `logging` cuánto tardó; usé `functools.wraps` para que la función decorada no pierda su nombre. Un context manager es un objeto que se usa con `with` y se encarga de preparar algo al entrar al bloque y de liberarlo al salir, aunque ocurra un error. El ejemplo más común es `with open(...) as archivo:`, que cierra el archivo solo; se parece al `using` de C#. En el reto lo usé con `pd.ExcelWriter`, que guarda y cierra el Excel cuando termina el bloque.

3. **Type hints y para qué sirven.**

   Los type hints son anotaciones que indican qué tipo de dato espera una variable o un parámetro y qué tipo devuelve una función, por ejemplo `def calcular_total(precio: float, cantidad: int) -> float:`. Algo que me sorprendió viniendo de C# es que Python no los revisa cuando ejecuta el programa: si paso un texto donde dice `int`, el código igual corre. Sirven para que el código sea más fácil de entender, para que VS Code autocomplete mejor y avise de errores antes de ejecutar, y para herramientas como `mypy`, que revisan los tipos. Los usé en todas las funciones del reto y del inventario.

4. **`logging` en vez de `print`. `argparse` para scripts de línea de comandos.**

   `print` solo muestra texto en la consola, mientras que `logging` permite registrar mensajes con niveles (`DEBUG`, `INFO`, `WARNING`, `ERROR` y `CRITICAL`), agregarles la hora automáticamente, enviarlos a un archivo y decidir qué nivel mostrar sin borrar líneas del código. Por eso en scripts que se ejecutan solos, como un RPA, es mejor `logging`: si algo falla, queda el registro de lo que pasó. En el reto uso `INFO` para los pasos normales, `WARNING` para las fechas inválidas y `ERROR` cuando no existe el archivo. `argparse` es la librería para recibir parámetros desde la terminal: defino los argumentos, como `--entrada` y `--salida`, si son obligatorios y su descripción, y la librería se encarga de leerlos, validar que estén y generar la ayuda con `--help`. Así el mismo script sirve para diferentes archivos sin cambiar el código.

5. **Pruebas con `pytest`.**

   `pytest` es una librería para hacer pruebas automáticas. Se escriben funciones que empiezan con `test_` en archivos que también empiezan con `test_`, y dentro se usa `assert` para comprobar que el resultado es el esperado. Al ejecutar `pytest` en la terminal, encuentra solo todas las pruebas, las corre y muestra cuáles pasaron y cuáles fallaron; en mi equipo tuve que usar `python -m pytest`, porque la seguridad de Windows bloquea el archivo `pytest.exe`. También tiene `pytest.raises` para comprobar que una función lanza un error, las fixtures para preparar datos que se repiten en varias pruebas y `tmp_path` para crear archivos temporales. Comparado con xUnit en C#, me pareció más sencillo porque no hay que crear clases ni poner atributos. Hice 5 pruebas para `Inventario` y 8 para el reto.

6. **`pandas` y `openpyxl` para manejo de datos y Excel.**

   `pandas` es una librería para trabajar con datos en forma de tabla, llamada `DataFrame`, que se parece a una hoja de Excel o a una tabla de SQL. Permite leer un CSV con `read_csv`, limpiar datos (`dropna` para quitar vacíos, `drop_duplicates` para los duplicados y `to_datetime` para convertir fechas), agrupar con `groupby`, que es como un `GROUP BY` de SQL, y exportar con `to_excel`. `openpyxl` es la librería que lee y escribe archivos `.xlsx`; pandas la usa por debajo para crear el Excel, y yo la usé directamente para darle formato a las hojas: encabezados en negrita, ancho de columnas y formato de moneda. En el reto, pandas hace la limpieza y los cálculos, y openpyxl el formato del archivo final.

## Lo que aprendí hoy (3 cosas)

- A crear un entorno virtual con `venv`, activarlo e instalar las librerías desde `requirements.txt`, para que cada proyecto tenga sus propias versiones sin afectar a los demás.
- A limpiar datos con pandas (vacíos, duplicados y fechas escritas en varios formatos), agruparlos con `groupby` como en SQL y exportarlos a un Excel con una hoja por análisis, dándole formato con openpyxl.
- A usar `logging` en vez de `print`, `argparse` para recibir parámetros desde la terminal y `pytest` para probar el código con fixtures, `pytest.raises` y `tmp_path`.

## Lo que no entendí o me costó

- Entender los decoradores: que una función recibe otra función y devuelve una nueva que la envuelve, y por qué hace falta `functools.wraps` para no perder el nombre de la función original.
- Convertir fechas escritas en formatos diferentes sin perder las que sí eran válidas. Tuve que probar cada formato con `pd.to_datetime` y llenar las que faltaban con el siguiente formato usando `fillna`.
- Manejar los entornos virtuales: sin querer creé más de un `.venv` y me confundí sobre cuál estaba activo. Entendí que basta con uno que tenga las librerías instaladas y que se puede usar desde cualquier carpeta mientras esté activo.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| `pytest` no se ejecutaba: "Una directiva de Control de aplicaciones bloqueó este archivo" | La política de seguridad de Windows de mi equipo bloquea el archivo `pytest.exe` que pip crea dentro de `.venv\Scripts` | Ejecuté las pruebas con `python -m pytest`, que usa el `python.exe` del entorno virtual, que sí está permitido |
| PowerShell mostró "Set-Location: No se encuentra ningún parámetro de posición" | Pegué dos comandos en la misma línea (`cd ../../..cd semana-1/...`) | Ejecuté los comandos uno por uno |
| Al crear otro `.venv` en la carpeta `ejercicios` salieron "No such file or directory: 'requirements.txt'" y "pytest no se reconoce" | El entorno nuevo estaba vacío, y `requirements.txt`, `generar_ventas.py` y `reporte.py` están en `reporte-ventas`, no en `ejercicios` | Volví a usar un entorno que ya tenía las librerías instaladas: solo se necesita uno activo, no uno por carpeta |
| El log del inventario mostraba "Se descontaron 1 unidades" | El mensaje tenía la palabra "unidades" fija, sin importar la cantidad | Cambié el mensaje a "descuento de 1, quedan 2 unidades" |
| El total de cada venta se calculaba con la cantidad antes de convertirla a entero | Dentro de un mismo `assign`, todas las columnas se calculan con los datos originales | Separé el `assign` en dos pasos: primero convierto la cantidad y después calculo el total |
| markdownlint marcaba MD060 en las tablas del README y de la bitácora | La fila separadora de las tablas no tenía espacios entre las barras y los guiones | Agregué los espacios en la fila separadora de cada tabla |
| No existía la sección de Python básico de `03_Ejercicios_por_Tema.md` | El archivo no estaba en el repositorio ni en el material | Creé `semana-1/python/03_Ejercicios_por_Tema.md` con 10 ejercicios de Python básico |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para entender los temas de la autoinvestigación, guiarme en la estructura del reto (limpieza con pandas, Excel con openpyxl y parámetros con argparse) y revisar los errores que salían al probar el código, como el bloqueo de `pytest.exe` en mi equipo.
- ¿Qué aprendí de eso? Que no basta con que el script corra: hay que probarlo con datos dañados a propósito y revisar que los resultados cuadren, por ejemplo que el total por mes y el total por ciudad sumen lo mismo.

## Autoevaluación del tema (1-5): 4

Logré hacer los ejercicios y el reto completo con sus pruebas, pero todavía necesito practicar más los decoradores y pandas para usarlos sin ayuda.
