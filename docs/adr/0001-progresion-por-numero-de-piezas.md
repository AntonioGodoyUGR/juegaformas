# La progresión desbloquea tamaño de tablero, no contenido

Lo que el niño desbloquea jugando es el **nivel** (cuántas piezas tiene la
partida), no los **temas**: los siete están disponibles desde el primer día, en
cualquier nivel. Un niño de cinco años que quiere dinosaurios y se encuentra un
candado cierra la aplicación, y como el juego no lleva telemetría, nunca nos
enteraríamos.

## Alternativa descartada

Repartir los temas en escalones desbloqueables, que es el patrón habitual en
juegos infantiles. Se descartó porque convierte el mayor gancho de retención que
tenemos —elegir el mundo que te gusta— en la primera frustración de la sesión.

## Consecuencia

Los assets no necesitan atributos de dificultad: basta `tema` + `nombre`. La
única palanca de progresión es el número de piezas.
