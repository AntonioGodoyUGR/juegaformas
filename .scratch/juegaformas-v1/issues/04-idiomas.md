# Castellano e inglés

Status: done
Blocked by: 01

Ambos catálogos dentro del bundle, cargados por clave. La estructura debe
permitir que un tercer idioma vaya bajo demanda el día que pese.

## Alcance

- Catálogos `es` y `en`
- Idioma inicial: el del dispositivo si es uno de los dos, castellano si no
- El idioma elegido se guarda con el resto del progreso

## Hecho cuando

- Cambiar de idioma no recarga la aplicación ni pierde el progreso
- No queda ningún literal suelto en los componentes

## Comments

Cerrado. Los textos viven en `src/textos/`: un fichero por idioma con la misma
forma (`Textos`) y un registro `CATALOGOS` al que solo llega `textosDe`. Los dos
van dentro del bundle porque son dos ficheros de texto y el juego arranca sin
conexión; el día que un tercero pese, el valor del registro pasa a ser una
promesa y `textosDe` la resuelve, sin que nadie más se entere.

El idioma no es estado aparte: es un campo de `Guardado`, así que se persiste,
se valida y se reinicia con el resto del progreso, y no puede quedar
descuadrado. `elegirIdioma` mira solo la raíz de la etiqueta del dispositivo
(`es-419` es castellano) y cae al castellano si no reconoce ninguna. Lo guardado
gana siempre sobre el dispositivo: una vez que un adulto elige, esa elección es
la buena aunque la tablet esté en otro idioma.

`ProveedorDeJuego` (`src/estado/juego.tsx`) es el primer trozo de React que toca
el progreso; `src/lib/progreso.ts` sigue siendo puro. El proveedor va por fuera
del router, así que navegar no lo reinicia, y cambiar de idioma es cambiar un
campo del estado: no se recarga nada y el resto del guardado viaja intacto en el
mismo objeto. Hay un test que lo comprueba con una partida ya anotada. El
proveedor también sincroniza `document.documentElement.lang`, que es lo que
usan el lector de pantalla para pronunciar y el navegador para partir palabras.

Recogido lo que aplazó el ticket 03: las 42 piezas tienen nombre en los dos
idiomas y `<Pieza>` los usa como `aria-label`. La pieza *es* el contenido —no
hay ningún otro sitio donde ponga «cohete»—, así que sin etiqueta un lector de
pantalla no encuentra nada que leer. Lleva un `decorativa` para el caso en que
la misma pieza salga dos veces (el hueco y la ficha que encaja en él) y repetir
el nombre estorbe.

Los tests comparan los dos catálogos clave a clave contra el catálogo de piezas,
en ambos sentidos: una pieza sin nombre solo se nota en el idioma que nadie mira
a mano.

Efecto lateral que ha caído aquí: las vistas necesitaban traducir el slug de la
URL, así que `Temas` y `Partida` ahora validan `mecanica` y `tema` con
`esMecanica`/`esTema` y devuelven al inicio si son inventados, igual que hace el
comodín del router. Era la validación que `rutas.ts` dejaba pendiente.
