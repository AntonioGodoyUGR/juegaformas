import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Volver } from '../componentes/Volver'
import { useJuego, useTextos } from '../estado/juego'
import { IDIOMAS, type Idioma } from '../lib/progreso'
import { rutas } from '../rutas'
import { NOMBRES_DE_IDIOMA } from '../textos'

/**
 * La única pantalla del juego que no es para el niño. Tres cosas y ninguna más:
 * en qué idioma habla, cuánto suena y borrarlo todo.
 *
 * No hay perfiles. Una tablet de casa la usan los dos hermanos y el progreso es
 * de la tablet, no de una persona: elegir perfil sería un paso más antes de
 * jugar y una pregunta —«¿quién eres?»— que a los cinco años se contesta
 * tocando el primer botón.
 *
 * Tampoco hay nada de lo que suele haber aquí: ni tiempo de pantalla ni
 * estadísticas —cuánto ha jugado un niño lo sabe quien está con él—. La
 * dificultad tampoco está aquí, aunque se elija: es de cada mecánica, y se
 * cambia en la pantalla de temas de esa mecánica, con su nombre delante y sin
 * salir de donde se está jugando.
 */
export default function Ajustes() {
  const textos = useTextos()

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-cielo">
      <header className="flex shrink-0 items-center gap-4 p-4">
        <Volver a={rutas.inicio} />
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{textos.ajustes.titulo}</h1>
      </header>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-4 pb-10">
        <Idiomas />
        <Volumen />
        <Reinicio />
      </div>
    </main>
  )
}

/** Un bloque blanco con su título. Los tres ajustes se ven igual de importantes. */
function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-[0_6px_0_var(--color-trazo)]">
      <h2 className="text-lg font-bold text-trazo">{titulo}</h2>
      {children}
    </section>
  )
}

/**
 * El idioma, con los dos nombres escritos cada uno en su idioma: quien abre
 * esto con el juego en inglés sin querer reconoce «Castellano» para volver
 * aunque no entienda el resto de la pantalla.
 */
function Idiomas() {
  const textos = useTextos()
  const { guardado, cambiarIdioma } = useJuego()

  return (
    <Bloque titulo={textos.ajustes.idioma}>
      <div className="flex gap-3">
        {IDIOMAS.map((idioma: Idioma) => {
          const activo = guardado.idioma === idioma

          return (
            <button
              key={idioma}
              type="button"
              // `aria-pressed` y no una lista de opciones: son dos botones que
              // se quedan pulsados, y eso es exactamente lo que hacen.
              aria-pressed={activo}
              onClick={() => cambiarIdioma(idioma)}
              className={`flex-1 rounded-2xl px-4 py-3 text-lg font-bold transition-colors ${
                activo ? 'bg-suelo text-white' : 'bg-trazo/10 text-trazo'
              }`}
            >
              {NOMBRES_DE_IDIOMA[idioma]}
            </button>
          )
        })}
      </div>
    </Bloque>
  )
}

/** Los pasos del volumen. De diez en diez: nadie afina el sonido de un juego al 3 %. */
const PASO = 0.1

function Volumen() {
  const textos = useTextos()
  const { guardado, actualizar } = useJuego()
  const porciento = Math.round(guardado.volumen * 100)

  return (
    <Bloque titulo={textos.ajustes.volumen}>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={1}
          step={PASO}
          value={guardado.volumen}
          aria-label={textos.ajustes.volumen}
          // Sin esto el lector de pantalla dice «0,3»; con esto dice lo mismo
          // que se ve al lado, y en el cero dice que no suena en vez de un número.
          aria-valuetext={porciento === 0 ? textos.ajustes.silencio : `${porciento} %`}
          onChange={(evento) =>
            actualizar((estado) => ({ ...estado, volumen: Number(evento.target.value) }))
          }
          className="h-3 w-full accent-suelo"
        />
        <span className="w-28 shrink-0 text-right text-base font-bold text-trazo">
          {porciento === 0 ? textos.ajustes.silencio : `${porciento} %`}
        </span>
      </div>
    </Bloque>
  )
}

/**
 * Borrar el progreso, en dos pasos. El primero no borra: enseña qué se pierde.
 *
 * La confirmación va aquí dentro y no en un `confirm()` del navegador porque un
 * `confirm()` no se puede traducir, no se puede leer bien con lector de
 * pantalla y en una aplicación instalada aparece con el nombre del dominio
 * encima, que es lo último que tranquiliza a nadie.
 */
function Reinicio() {
  const textos = useTextos()
  const { reiniciar } = useJuego()
  const navegar = useNavigate()
  const [preguntando, setPreguntando] = useState(false)

  function borrar() {
    reiniciar()
    // Al inicio: lo que se acaba de pedir es un juego recién instalado, y un
    // juego recién instalado empieza en su primera pantalla.
    navegar(rutas.inicio, { replace: true })
  }

  if (!preguntando) {
    return (
      <Bloque titulo={textos.ajustes.reiniciar.titulo}>
        <button
          type="button"
          onClick={() => setPreguntando(true)}
          className="rounded-2xl bg-trazo/10 px-4 py-3 text-lg font-bold text-trazo"
        >
          {textos.ajustes.reiniciar.boton}
        </button>
      </Bloque>
    )
  }

  return (
    <Bloque titulo={textos.ajustes.reiniciar.titulo}>
      <p className="text-base text-trazo">{textos.ajustes.reiniciar.pregunta}</p>

      <div className="flex gap-3">
        {/* Cancelar primero y con el foco puesto: quien ha llegado aquí sin
            querer se sale con la tecla que ya tiene debajo del dedo. */}
        <button
          type="button"
          autoFocus
          onClick={() => setPreguntando(false)}
          className="flex-1 rounded-2xl bg-trazo/10 px-4 py-3 text-lg font-bold text-trazo"
        >
          {textos.ajustes.reiniciar.cancelar}
        </button>
        <button
          type="button"
          onClick={borrar}
          className="flex-1 rounded-2xl bg-alerta px-4 py-3 text-lg font-bold text-white"
        >
          {textos.ajustes.reiniciar.confirmar}
        </button>
      </div>
    </Bloque>
  )
}
