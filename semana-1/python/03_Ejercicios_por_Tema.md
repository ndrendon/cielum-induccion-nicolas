# 03 · Ejercicios por tema: Python básico

Estos son los 10 ejercicios de Python básico, cada uno con su enunciado, el código y la salida que muestra al ejecutarlo. Los ejercicios intermedio y avanzado están en la carpeta `ejercicios/`.

## Ejercicio 1: tipos de datos

**Enunciado:** declarar variables de distintos tipos y mostrar su tipo con `type()`.

```python
nombre = "Nicolas"
horas_practica = 6
promedio = 4.2
es_practicante = True
proyecto = None
print(type(nombre), type(horas_practica), type(promedio), type(es_practicante), type(proyecto))
```

**Salida:**

```text
<class 'str'> <class 'int'> <class 'float'> <class 'bool'> <class 'NoneType'>
```

A diferencia de JavaScript, Python separa los números enteros (`int`) de los decimales (`float`). `None` es el equivalente a `null`.

## Ejercicio 2: variables, constantes y alcance

**Enunciado:** reasignar una variable, usar una constante y comprobar desde dónde se puede usar una variable creada dentro de un `if` y dentro de una función.

```python
EMPRESA = "Cielum"
horas = 6
horas = horas + 2

if True:
    dentro_del_if = "visible fuera del if"


def calcular_bono():
    bono = 50000
    return bono


print(EMPRESA, horas)
print(dentro_del_if)
print(calcular_bono())
try:
    print(bono)
except NameError as error:
    print("Error:", error)
```

**Salida:**

```text
Cielum 8
visible fuera del if
50000
Error: name 'bono' is not defined
```

Python no tiene `const`: las constantes se escriben en mayúsculas por convención. Un `if` no crea un alcance nuevo, por eso `dentro_del_if` se puede usar afuera, pero una función sí, por eso `bono` no existe fuera de `calcular_bono`.

## Ejercicio 3: == vs is

**Enunciado:** comparar valores con `==` y objetos con `is`.

```python
lista_a = [1, 2, 3]
lista_b = [1, 2, 3]
lista_c = lista_a
print(lista_a == lista_b, lista_a is lista_b)
print(lista_a is lista_c)
print(5 == "5")
print(0 == False)
proyecto = None
print(proyecto is None)
```

**Salida:**

```text
True False
True
False
True
True
```

`==` compara si los valores son iguales e `is` si son el mismo objeto en memoria. Python no convierte tipos al comparar, por eso `5 == "5"` es `False`. `0 == False` da `True` porque en Python `bool` es un tipo de número. Para preguntar por `None` se usa `is`.

## Ejercicio 4: if/elif/else

**Enunciado:** clasificar una nota como Excelente (4.5 o más), Aprobado (3 o más) o Reprobado.

```python
nota = 4.2
if nota >= 4.5:
    print("Excelente")
elif nota >= 3:
    print("Aprobado")
else:
    print("Reprobado")
```

**Salida:**

```text
Aprobado
```

Python usa `elif` en vez de `else if`, y los bloques se marcan con la sangría en vez de llaves.

## Ejercicio 5: match/case

**Enunciado:** mostrar el nombre del día de la semana según un número del 1 al 7.

```python
dia = 3
match dia:
    case 1:
        print("Lunes")
    case 2:
        print("Martes")
    case 3:
        print("Miércoles")
    case 4:
        print("Jueves")
    case 5:
        print("Viernes")
    case 6 | 7:
        print("Fin de semana")
    case _:
        print("Día no válido")
```

**Salida:**

```text
Miércoles
```

`match` es parecido al `switch` de JavaScript, pero no necesita `break`. Con `|` se juntan varios casos y `_` es el caso por defecto. Funciona desde Python 3.10.

## Ejercicio 6: bucle for

**Enunciado:** imprimir la tabla de multiplicar del 7.

```python
for i in range(1, 11):
    print(f"7 x {i} = {7 * i}")
```

**Salida:**

```text
7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63
7 x 10 = 70
```

`range(1, 11)` va del 1 al 10, porque el último número no se incluye.

## Ejercicio 7: bucle while

**Enunciado:** sumar los números del 1 al 100.

```python
numero = 1
suma = 0
while numero <= 100:
    suma += numero
    numero += 1
print(suma)
```

**Salida:**

```text
5050
```

Python no tiene `++`, por eso se usa `numero += 1`.

## Ejercicio 8: funciones y lambda

**Enunciado:** calcular el IVA con una función que tenga una tarifa por defecto, y ordenar productos por precio con una función `lambda`.

```python
def calcular_iva(precio, tarifa=0.19):
    return round(precio * tarifa)


productos = [("Teclado", 180000), ("Mouse", 65000), ("Monitor", 720000)]
mas_baratos_primero = sorted(productos, key=lambda producto: producto[1])

print(calcular_iva(100000))
print(calcular_iva(100000, 0.05))
print(mas_baratos_primero)
```

**Salida:**

```text
19000
5000
[('Mouse', 65000), ('Teclado', 180000), ('Monitor', 720000)]
```

Si no envío la tarifa se usa el 19 %. La `lambda` es una función corta sin nombre, como una función flecha de JavaScript, y aquí le dice a `sorted` que ordene por el precio.

## Ejercicio 9: listas y tuplas

**Enunciado:** crear una lista de tareas, agregar una, mostrar su tamaño, el primer y el último elemento, recorrerla y buscar una tarea. Después guardar unas coordenadas en una tupla.

```python
tareas = ["Crear rama", "Resolver ejercicios", "Abrir PR"]
tareas.append("Subir bitácora")
print(len(tareas))
print(tareas[0], "|", tareas[-1])
for numero, tarea in enumerate(tareas, start=1):
    print(f"{numero}. {tarea}")
print("Abrir PR" in tareas)

coordenadas_medellin = (6.2442, -75.5812)
latitud, longitud = coordenadas_medellin
print(latitud, longitud)
try:
    coordenadas_medellin[0] = 0
except TypeError as error:
    print("Error:", error)
```

**Salida:**

```text
4
Crear rama | Subir bitácora
1. Crear rama
2. Resolver ejercicios
3. Abrir PR
4. Subir bitácora
True
6.2442 -75.5812
Error: 'tuple' object does not support item assignment
```

El índice `-1` toma el último elemento y `enumerate` da la posición junto con el valor. La tupla no se puede modificar, por eso cambiar un valor da error.

## Ejercicio 10: diccionarios y sets

**Enunciado:** crear un diccionario `practicante`, agregarle una clave, consultarlo y recorrerlo. Después usar sets para quitar ciudades repetidas y encontrar las que están en los dos grupos.

```python
practicante = {
    "nombre": "Nicolas",
    "empresa": "Cielum",
    "habilidades": ["C#", "SQL", "JavaScript"],
}
practicante["semana"] = 1
print(practicante["nombre"], practicante.get("jefe", "Sin asignar"))
for clave, valor in practicante.items():
    print(f"{clave}: {valor}")

ciudades_visitadas = {"Medellín", "Cali", "Medellín", "Bogotá"}
ciudades_proyecto = {"Medellín", "Bogotá", "Barranquilla"}
print(len(ciudades_visitadas))
print(sorted(ciudades_visitadas & ciudades_proyecto))
```

**Salida:**

```text
Nicolas Sin asignar
nombre: Nicolas
empresa: Cielum
habilidades: ['C#', 'SQL', 'JavaScript']
semana: 1
3
['Bogotá', 'Medellín']
```

`get` devuelve un valor por defecto cuando la clave no existe, en vez de lanzar un error. El set guarda solo 3 ciudades porque no permite repetidos, y `&` devuelve las ciudades que están en los dos sets.
