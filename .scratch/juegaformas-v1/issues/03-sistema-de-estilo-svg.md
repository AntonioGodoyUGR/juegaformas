# Sistema de estilo SVG y primeras piezas

Status: done

Las piezas son ilustraciones originales, no assets de terceros. Esto elimina
cualquier dependencia CC-BY y, con ella, la pantalla de créditos.

## Alcance

- Fijar el sistema de estilo y documentarlo: lienzo cuadrado fijo, relleno plano
  sin degradados, contorno uniforme, paleta corta y cerrada
- Un componente que pinta una pieza a partir de su identificador
- Piezas suficientes para el nivel 1 de las tres mecánicas en los siete temas
- Fronteras de tema respetadas tal y como las fija `CONTEXT.md`: un pez es mar,
  no animales

## Hecho cuando

- Todas las piezas se leen a 96px de lado en una tablet
- Ningún asset del repositorio exige atribución

## Comments

Cerrado. 42 piezas: seis por tema en los siete temas (`espacio`, `animales`,
`mar`, `naturaleza`, `comida`, `deportes`, `vehiculos`).

El sistema de estilo vive en `src/piezas/estilo.ts`: lienzo 256 con margen 24,
grosor 8, un único color de trazo y seis colores de relleno más el blanco. El
trazo y el lienzo los pone el envoltorio `<Pieza>`, nunca el dibujo suelto: es
la única razón por la que 42 ilustraciones hechas de una sentada mantienen el
mismo aspecto. El contorno lleva `vectorEffect="non-scaling-stroke"` para que no
se afine cuando la casilla baja a 96px.

Verificado **a ojo** a 120px y a 96px con una hoja de contactos, no leyendo el
`path`. Cuatro dibujos pasaban el test y el typecheck y aun así estaban mal:

- **luna**: el `path` original encerraba área casi nula y salía como un contorno
  vacío. Rehecho como creciente entre dos círculos del mismo radio desplazados.
- **ballena**: el chorro con líneas finas se leía como antenas de bicho, y en
  versión blanca desaparecía contra la tarjeta. Resuelto con tres elipses
  gruesas saliendo del espiráculo.
- **caracola**: la espiral se convertía en un garabato al reducir. Sustituida
  por un abanico.
- **canasta** y **helado**: ambigüedad de color, no de forma (aro naranja; bola
  morada con cereza roja, porque la roja chocaba con la manzana).

Dos dudas de glosario resueltas en comentarios del código para no rediscutirlas:
el barco es `mar` (CONTEXT.md dice "vive o flota en el agua") y la bicicleta es
`vehiculos`, porque `deportes` son objetos con los que se juega, no cosas que se
montan.

Los nombres accesibles de cada pieza quedan aplazados al ticket 04: son
bilingües y pertenecen al fichero de textos, no al dibujo.

Ningún asset exige atribución: todo es SVG original. Kenney (CC0) queda sólo
para los sonidos del ticket 11.
