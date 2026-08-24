import { MECANICAS, type Mecanica } from './dominio'

export const IDIOMAS = ['es', 'en'] as const
export type Idioma = (typeof IDIOMAS)[number]

/**
 * Todo lo que sobrevive a cerrar la aplicación. Un solo perfil por dispositivo:
 * los hermanos comparten progreso, que es lo que pasa de verdad con una tablet
 * de casa.
 *
 * No se guarda el nivel: se deriva de `completadas` (ver `niveles.ts`), así que
 * no puede quedar descuadrado.
 */
export type Guardado = {
  readonly version: 1
  readonly completadas: Readonly<Record<Mecanica, number>>
  readonly idioma: Idioma
  /** De 0 a 1. A 0 el juego es plenamente jugable. */
  readonly volumen: number
}

export const CLAVE = 'juegaformas'

/**
 * El idioma de arranque a partir de lo que pide el dispositivo. Se compara solo
 * la raíz de la etiqueta: `es-419` y `es-ES` son castellano, y a un niño le da
 * igual la variante.
 *
 * Si el dispositivo no habla ninguno de los dos, castellano. No es un empate
 * técnico: el juego se escribe primero en castellano y es el idioma que siempre
 * está completo.
 */
export function elegirIdioma(preferencias: readonly string[] = []): Idioma {
  for (const etiqueta of preferencias) {
    const raiz = etiqueta.toLowerCase().split('-')[0]
    if ((IDIOMAS as readonly string[]).includes(raiz)) return raiz as Idioma
  }
  return 'es'
}

export function porDefecto(idioma: Idioma = 'es'): Guardado {
  return {
    version: 1,
    completadas: { encajar: 0, emparejar: 0, ordenar: 0 },
    idioma,
    volumen: 0.6,
  }
}

function contador(valor: unknown): number {
  return typeof valor === 'number' && Number.isFinite(valor) && valor >= 0 ? Math.trunc(valor) : 0
}

/**
 * Lee el progreso campo a campo y sin confiar en nada. Un niño no puede
 * arreglar un `localStorage` corrupto, y un adulto tampoco va a saber que ese
 * es el problema: cualquier cosa rara se sustituye por su valor por defecto y
 * el juego arranca igual.
 *
 * `idiomaInicial` solo manda cuando no hay nada guardado o lo guardado no sirve:
 * en cuanto un adulto elige idioma, esa elección gana sobre el dispositivo para
 * siempre.
 */
export function leer(
  almacen: Pick<Storage, 'getItem'> = localStorage,
  idiomaInicial: Idioma = 'es',
): Guardado {
  const base = porDefecto(idiomaInicial)

  let crudo: string | null = null
  try {
    crudo = almacen.getItem(CLAVE)
  } catch {
    // Modo privado o almacenamiento bloqueado: se juega sin recordar nada.
    return base
  }
  if (!crudo) return base

  let datos: unknown
  try {
    datos = JSON.parse(crudo)
  } catch {
    return base
  }
  if (typeof datos !== 'object' || datos === null) return base

  const parcial = datos as Record<string, unknown>
  const completadas = (parcial.completadas ?? {}) as Record<string, unknown>

  return {
    version: 1,
    completadas: Object.fromEntries(
      MECANICAS.map((mecanica) => [mecanica, contador(completadas[mecanica])]),
    ) as Record<Mecanica, number>,
    idioma: (IDIOMAS as readonly unknown[]).includes(parcial.idioma)
      ? (parcial.idioma as Idioma)
      : base.idioma,
    volumen:
      typeof parcial.volumen === 'number' && parcial.volumen >= 0 && parcial.volumen <= 1
        ? parcial.volumen
        : base.volumen,
  }
}

/** Guardar nunca puede tumbar una partida, así que un fallo se traga. */
export function guardar(estado: Guardado, almacen: Pick<Storage, 'setItem'> = localStorage): void {
  try {
    almacen.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    // Cuota llena o almacenamiento bloqueado: el niño sigue jugando.
  }
}

/**
 * Borrar y volver a empezar. El idioma se le pasa porque reiniciar es dejar el
 * aparato como recién instalado, y recién instalado el juego habla en el idioma
 * del aparato: no en el que un adulto eligió una vez y ya no está.
 */
export function reiniciar(
  almacen: Pick<Storage, 'removeItem'> = localStorage,
  idioma: Idioma = 'es',
): Guardado {
  try {
    almacen.removeItem(CLAVE)
  } catch {
    // Da igual: lo que se devuelve ya es el estado limpio.
  }
  return porDefecto(idioma)
}

/** Suma una partida completada. Devuelve un estado nuevo; no muta el anterior. */
export function anotarPartida(estado: Guardado, mecanica: Mecanica): Guardado {
  return {
    ...estado,
    completadas: { ...estado.completadas, [mecanica]: estado.completadas[mecanica] + 1 },
  }
}
