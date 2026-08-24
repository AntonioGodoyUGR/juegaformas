import { useJuego, useTextos } from '../estado/juego'
import { DIFICULTADES, type Mecanica } from '../lib/dominio'

/**
 * El único mando del juego que no es «tocar y jugar»: cuántas piezas trae el
 * tablero de esta mecánica.
 *
 * Va aquí, en la pantalla de la mecánica, y no en ajustes, por dos motivos. El
 * primero es que la dificultad es de cada mecánica y no del juego: en ajustes
 * habría que enseñar las tres a la vez y elegir a ciegas, sin el nombre de la
 * mecánica delante. El segundo es que quien la quiere cambiar es el adulto que
 * está sentado al lado viendo atascarse al niño, y ese adulto no va a irse a
 * otra pantalla —a la que además se entra manteniendo pulsado— para volver.
 *
 * No añade un toque al camino de jugar: los tres botones están en la cabecera,
 * la dificultad ya viene puesta de la última vez, y el niño sigue tocando el
 * tema como si esto no estuviera.
 */
export function SelectorDeDificultad({ mecanica }: { mecanica: Mecanica }) {
  const textos = useTextos()
  const { guardado, elegirDificultad } = useJuego()
  const elegida = guardado.dificultad[mecanica]

  return (
    // `group` con nombre y no una lista de opciones: son tres botones que se
    // quedan pulsados, igual que los dos del idioma en ajustes.
    <div
      role="group"
      aria-label={textos.dificultad.titulo}
      className="flex items-stretch gap-1 rounded-2xl bg-white p-1 shadow-md"
    >
      {DIFICULTADES.map((dificultad, indice) => {
        const activa = dificultad === elegida

        return (
          <button
            key={dificultad}
            type="button"
            data-dificultad={dificultad}
            aria-pressed={activa}
            onClick={() => elegirDificultad(mecanica, dificultad)}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors ${
              activa ? 'bg-purple-600 text-white' : 'text-purple-700'
            }`}
          >
            <Puntos cuantos={indice + 1} activa={activa} />
            {/* El nombre es para el adulto: quien no lee ya tiene los puntos,
                que crecen de izquierda a derecha y se entienden sin idioma. */}
            <span className="text-xs font-bold sm:text-sm">
              {textos.dificultad.nombres[dificultad]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Los puntos de la fuerza de la señal: uno, dos, tres, y crecen. */
function Puntos({ cuantos, activa }: { cuantos: number; activa: boolean }) {
  return (
    <span aria-hidden="true" className="flex items-end gap-0.5">
      {[1, 2, 3].map((punto) => (
        <span
          key={punto}
          style={{ width: `${2 + punto * 2}px`, height: `${2 + punto * 2}px` }}
          className={`rounded-full ${
            punto > cuantos
              ? activa
                ? 'bg-purple-400'
                : 'bg-purple-200'
              : activa
                ? 'bg-white'
                : 'bg-purple-600'
          }`}
        />
      ))}
    </span>
  )
}
