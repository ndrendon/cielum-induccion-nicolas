# Ejercicio avanzado: orden de salida del event loop

Código: `03-avanzado-event-loop.js`

## Mi predicción

```text
A
G
I
C
H
D
B
E
F
```

## Justificación

1. **Código síncrono primero (call stack):** se imprime `A`. Los dos `setTimeout` se mandan a la task queue y el primer `.then()` se manda a la microtask queue. Al llamar `tarea()` se ejecuta de forma síncrona hasta el `await`, por eso sale `G`, y lo que sigue después del `await` queda como microtarea. Luego se imprime `I` y el call stack queda vacío.
2. **Microtareas:** se ejecutan en el orden en que entraron. Primero el `.then()` que imprime `C`, y al terminar se encola el segundo `.then()`. Después sigue la continuación del `await`, que imprime `H`. Por último se ejecuta el segundo `.then()`, que imprime `D`.
3. **Primera tarea (macrotarea):** cuando ya no quedan microtareas, el event loop toma el primer `setTimeout` e imprime `B`.
4. **Segunda tarea:** se ejecuta el segundo `setTimeout`, que imprime `E` y encola una nueva microtarea.
5. **Microtarea dentro de la tarea:** antes de pasar a otra tarea, el event loop vacía la microtask queue, así que se imprime `F`.

La conclusión es que todo el código síncrono va primero, luego todas las microtareas (promesas y `await`) y solo después cada `setTimeout`, vaciando las microtareas entre una tarea y otra.

Fuente: <https://developer.mozilla.org/es/docs/Web/JavaScript/Event_loop>
