# Arranque sin conexión

Status: ready-for-agent
Blocked by: 03, 11

El juego tiene que arrancar entero en modo avión después de la primera visita.

## Alcance

- Precache de ilustraciones y sonidos en el service worker
- Verificar que el presupuesto de tamaño del precache cubre todos los assets
- Sin peticiones de red en tiempo de ejecución: no hay telemetría ni fuentes
  remotas

## Hecho cuando

- Con la red desconectada, arrancar desde el icono de la pantalla de inicio
  lleva a un tablero jugable
- El panel de red no registra ninguna petición saliente durante una partida
