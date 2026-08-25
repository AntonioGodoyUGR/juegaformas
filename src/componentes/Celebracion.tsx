import { useEffect } from 'react'
import type { Efecto } from '../audio/reproductor'
import { useSonido } from '../estado/audio'
import { useTextos } from '../estado/juego'
import { Mascota } from '../piezas/mascota'
import { PALETA, SOMBRA } from '../piezas/estilo'
import { Lienzo } from '../piezas/lienzo'

/**
 * El único premio del juego. No hay puntuación, ni vidas, ni tiempo, ni nada que
 * se acumule de una sesión a otra: lo que se gana al terminar es que pasa esto.
 *
 * Son dos y se distinguen por lo que ocupan. La de partida es una capa encima
 * del tablero recién resuelto, dura un momento y se va sola. La de nivel es una
 * pantalla entera y se queda hasta que el niño toca: es la única vez en todo el
 * juego que algo espera por él, y por eso es también la señal de que ha pasado
 * algo distinto de lo de siempre.
 *
 * Ninguna de las dos cuenta nada —ni cuántas partidas lleva, ni cuántas faltan,
 * ni qué nivel es este—. Enseñar la cuenta convierte jugar en avanzar, y a los
 * cinco años eso solo sirve para compararse consigo mismo.
 */

/**
 * El sonido de la celebración va aquí y no en quien la monta, pegado a lo que se
 * ve: así no hay forma de que salgan las estrellas sin que suene nada, ni de que
 * suene la de nivel mientras se ve la de partida. Suena una vez por celebración
 * porque las dos se montan de cero cada vez que hay algo que celebrar.
 */
function useSonarAlSalir(cual: Efecto) {
  const sonar = useSonido()

  useEffect(() => {
    sonar(cual)
  }, [sonar, cual])
}

/**
 * Una estrella de cinco puntas en el sistema de estilo de las piezas: relleno
 * plano, la sombra abajo a la derecha y el color encima, sin degradados. Se
 * dibuja aquí en vez de reutilizar una pieza porque una pieza pertenece a un
 * tema, y la celebración es la misma se esté jugando con cohetes o con peces.
 */
const ESTRELLA =
  'M128 28 L155 92 L223 97 L171 142 L187 209 L128 173 L69 209 L85 142 L33 97 L102 92 Z'

function Estrella({ className }: { className?: string }) {
  // Sin nombre: es decorativa. Lo que hay que oír es la frase que va al lado, y
  // tres estrellas que se anuncian una a una son tres interrupciones.
  return (
    <Lienzo className={className}>
      <path d={ESTRELLA} transform="translate(6 6)" fill={SOMBRA.amarillo} />
      <path d={ESTRELLA} fill={PALETA.amarillo} stroke="none" />
    </Lienzo>
  )
}

/**
 * La celebración de partida: una capa sobre el tablero que se acaba de resolver.
 *
 * Va encima y no en su sitio porque lo que el niño acaba de hacer sigue ahí
 * debajo: la última pieza que ha colocado no desaparece en el mismo gesto de
 * colocarla. Y no pide nada —ni un toque, ni esquivarla— porque quien la quita
 * es el tablero siguiente.
 *
 * Tapa el tablero a los toques a propósito. Durante este segundo no hay nada
 * que tocar, y un dedo impaciente que acierte una carta ya resuelta vería
 * responder a un tablero que en realidad está terminado.
 */
export function CelebracionBreve() {
  const textos = useTextos()
  useSonarAlSalir('partida')

  return (
    <div
      data-celebracion="partida"
      // Un destello no se oye, igual que en la pista: quien juega con lector de
      // pantalla se entera de que ha terminado el tablero por esta frase.
      role="status"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-cielo/85"
    >
      <Estrella className="w-28 animate-bounce sm:w-36" />
      <p className="text-3xl font-bold text-white sm:text-4xl">{textos.celebracion.partida}</p>
    </div>
  )
}

/**
 * Cuántas estrellas trae la celebración grande y cuánto tarda cada una en
 * saltar. Escalonadas y no a la vez: tres estrellas que botan al unísono se ven
 * como un solo bloque, y así parecen tres cosas que van saliendo.
 */
const ESTRELLAS = ['', '[animation-delay:150ms]', '[animation-delay:300ms]']

/**
 * La celebración de nivel: pantalla propia y un solo botón.
 *
 * Es lo que marca que se ha desbloqueado el siguiente, y por eso es una pantalla
 * y no una capa: si se fuera sola como la breve, terminar quince partidas se
 * vería igual que terminar una. Espera, pero espera un toque, no dos: el botón
 * ocupa media pantalla y es lo único que hay que tocar.
 */
export function CelebracionDeNivel({ alSeguir }: { alSeguir: () => void }) {
  const textos = useTextos()
  useSonarAlSalir('nivel')

  return (
    <div
      data-celebracion="nivel"
      className="relative flex h-full flex-col items-center justify-center gap-8 p-6"
    >
      <div className="flex items-center gap-2 sm:gap-6">
        {ESTRELLAS.map((retraso, i) => (
          <Estrella
            key={i}
            // La del medio más grande: tres estrellas iguales en fila se leen
            // como un contador de tres, y aquí no se está contando nada.
            className={`animate-bounce ${retraso} ${i === 1 ? 'w-32 sm:w-40' : 'w-24 sm:w-28'}`}
          />
        ))}
      </div>

      <h2 className="text-center text-4xl font-bold text-white sm:text-5xl">
        {textos.celebracion.nivel}
      </h2>

      {/* El foco viene aquí solo. La pantalla ha sustituido al tablero, así que
          el botón que tenía el foco ya no existe: sin esto, quien juega con
          lector de pantalla o con teclado se queda en el cuerpo del documento
          sin que nadie le haya dicho que ha cambiado la pantalla. */}
      <button
        type="button"
        autoFocus
        onClick={alSeguir}
        // El amarillo es el color de la estrella, y este botón es lo que viene
        // después de las estrellas. El canto sólido de debajo es el mismo
        // recurso que en `Volver`: se hunde al pulsarlo en vez de encogerse.
        className="rounded-full bg-amarillo px-12 py-6 text-2xl font-bold text-trazo shadow-[0_8px_0_var(--color-amarillo-hondo)] transition-transform active:translate-y-2 active:shadow-none sm:text-3xl"
      >
        {textos.celebracion.seguir}
      </button>

      {/* La mascota celebra desde la esquina, no desde el centro: lo que ha
          hecho el niño son las estrellas, y la criatura las mira de lado. */}
      <Mascota
        pose="celebra"
        className="pointer-events-none absolute right-3 bottom-2 w-28 sm:right-6 sm:w-40"
      />
    </div>
  )
}
