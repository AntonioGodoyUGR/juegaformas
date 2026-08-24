import { DETALLE, PALETA, SOMBRA } from '../estilo'

/**
 * Tema `naturaleza`: lo que crece o está en el paisaje. La copa del árbol, la
 * campana de la medusa y la caracola comparten el mismo borde festoneado a
 * propósito, porque es el recurso con el que este juego dibuja lo orgánico.
 */

export function Arbol() {
  return (
    <>
      <path d="M110 140 L110 208 Q110 226 90 234 L166 234 Q146 226 146 208 L146 140 Z" fill={PALETA.naranja} />
      <path d="M146 140 L146 208 Q146 226 166 234 L134 234 Q128 224 128 208 L128 140 Z" fill={SOMBRA.naranja} stroke="none" />
      <path d="M118 168 L118 196 M136 158 L136 190" fill="none" stroke={SOMBRA.naranja} strokeWidth={DETALLE} />
      {/* Copa festoneada: ocho vértices a radio 62 y arcos de 26 que abomban hacia fuera. */}
      <path
        d="M128 42 A 26 26 0 0 1 172 60 A 26 26 0 0 1 190 104 A 26 26 0 0 1 172 148 A 26 26 0 0 1 128 166 A 26 26 0 0 1 84 148 A 26 26 0 0 1 66 104 A 26 26 0 0 1 84 60 A 26 26 0 0 1 128 42 Z"
        fill={SOMBRA.verde}
      />
      <circle cx="116" cy="92" r="50" fill={PALETA.verde} stroke="none" />
      <circle cx="98" cy="118" r="12" fill={PALETA.rojo} strokeWidth={DETALLE} />
      <circle cx="150" cy="80" r="11" fill={PALETA.rojo} strokeWidth={DETALLE} />
      <circle cx="160" cy="130" r="11" fill={PALETA.rojo} strokeWidth={DETALLE} />
    </>
  )
}

export function Flor() {
  return (
    <>
      <path d="M128 130 L128 236" fill="none" stroke={PALETA.verde} />
      <ellipse cx="84" cy="184" rx="30" ry="17" transform="rotate(-18 84 184)" fill={PALETA.verde} />
      <ellipse cx="172" cy="208" rx="28" ry="16" transform="rotate(18 172 208)" fill={PALETA.verde} />
      <path d="M128 178 L86 186 M128 202 L170 212" fill="none" stroke={SOMBRA.verde} strokeWidth={DETALLE} />
      <circle cx="128" cy="52" r="33" fill={SOMBRA.rojo} />
      <circle cx="180" cy="82" r="33" fill={SOMBRA.rojo} />
      <circle cx="180" cy="142" r="33" fill={SOMBRA.rojo} />
      <circle cx="128" cy="172" r="33" fill={SOMBRA.rojo} />
      <circle cx="76" cy="142" r="33" fill={SOMBRA.rojo} />
      <circle cx="76" cy="82" r="33" fill={SOMBRA.rojo} />
      <circle cx="123" cy="47" r="24" fill={PALETA.rojo} stroke="none" />
      <circle cx="175" cy="77" r="24" fill={PALETA.rojo} stroke="none" />
      <circle cx="175" cy="137" r="24" fill={PALETA.rojo} stroke="none" />
      <circle cx="123" cy="167" r="24" fill={PALETA.rojo} stroke="none" />
      <circle cx="71" cy="137" r="24" fill={PALETA.rojo} stroke="none" />
      <circle cx="71" cy="77" r="24" fill={PALETA.rojo} stroke="none" />
      <circle cx="128" cy="112" r="38" fill={PALETA.amarillo} />
      <circle cx="128" cy="112" r="7" fill={SOMBRA.amarillo} stroke="none" />
      <circle cx="112" cy="98" r="6" fill={SOMBRA.amarillo} stroke="none" />
      <circle cx="144" cy="98" r="6" fill={SOMBRA.amarillo} stroke="none" />
      <circle cx="112" cy="126" r="6" fill={SOMBRA.amarillo} stroke="none" />
      <circle cx="144" cy="126" r="6" fill={SOMBRA.amarillo} stroke="none" />
    </>
  )
}

export function Nube() {
  return (
    <>
      {/*
        Un solo camino, no varios círculos: dos formas con trazo que se solapan
        dejan la costura a la vista, y una nube con costuras dentro parece otra
        cosa.
      */}
      <path
        d="M56 194 A 34 34 0 0 1 62 128 A 42 42 0 0 1 108 88 A 46 46 0 0 1 172 96 A 36 36 0 0 1 208 136 A 30 30 0 0 1 200 194 Z"
        fill={PALETA.blanco}
      />
      <path d="M56 194 L200 194 L200 174 Q128 190 56 174 Z" fill={SOMBRA.blanco} stroke="none" />
      <path d="M56 174 Q128 190 200 174" fill="none" strokeWidth={DETALLE} />
      <path d="M96 122 Q112 138 106 160" fill="none" stroke={SOMBRA.blanco} strokeWidth={DETALLE} />
      <path d="M156 116 Q170 134 166 158" fill="none" stroke={SOMBRA.blanco} strokeWidth={DETALLE} />
    </>
  )
}

export function Hoja() {
  return (
    <>
      <path d="M128 26 C200 78 200 178 128 230 C56 178 56 78 128 26 Z" fill={SOMBRA.verde} />
      <path d="M128 26 C56 78 56 178 128 230 Z" fill={PALETA.verde} stroke="none" />
      <path d="M128 26 L128 244" fill="none" strokeWidth={DETALLE} />
      <path d="M128 78 L92 64 M128 78 L164 64" fill="none" strokeWidth={DETALLE} />
      <path d="M128 122 L80 104 M128 122 L176 104" fill="none" strokeWidth={DETALLE} />
      <path d="M128 166 L84 152 M128 166 L172 152" fill="none" strokeWidth={DETALLE} />
      <path d="M128 202 L100 192 M128 202 L156 192" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Montana() {
  return (
    <>
      <circle cx="200" cy="60" r="26" fill={PALETA.amarillo} />
      <path d="M146 62 L232 210 L60 210 Z" fill={PALETA.azul} />
      <path d="M146 62 L232 210 L146 210 Z" fill={SOMBRA.azul} stroke="none" />
      <path d="M120 110 L146 62 L172 110 Q159 100 146 108 Q133 116 120 110 Z" fill={PALETA.blanco} />
      <path d="M92 96 L188 210 L14 210 Z" fill={PALETA.verde} />
      <path d="M92 96 L188 210 L92 210 Z" fill={SOMBRA.verde} stroke="none" />
      <path d="M68 128 L92 96 L116 128 Q104 120 92 128 Q80 136 68 128 Z" fill={PALETA.blanco} />
      <path d="M14 210 L242 210" fill="none" />
      <path d="M52 168 L52 190 M64 176 L52 186 M40 176 L52 186" fill="none" stroke={SOMBRA.verde} strokeWidth={DETALLE} />
      <path d="M206 178 L206 198 M216 184 L206 194 M196 184 L206 194" fill="none" stroke={SOMBRA.azul} strokeWidth={DETALLE} />
    </>
  )
}

export function Seta() {
  return (
    <>
      <path d="M102 142 L102 208 Q102 224 88 232 L168 232 Q154 224 154 208 L154 142 Z" fill={PALETA.blanco} />
      <path d="M154 142 L154 208 Q154 224 168 232 L134 232 Q128 222 128 208 L128 142 Z" fill={SOMBRA.blanco} stroke="none" />
      <path d="M96 168 Q128 182 160 168" fill="none" strokeWidth={DETALLE} />
      <path d="M28 148 A 100 84 0 0 1 228 148 Z" fill={SOMBRA.rojo} />
      <path d="M28 148 A 100 84 0 0 1 160 68 Q118 104 116 148 Z" fill={PALETA.rojo} stroke="none" />
      <path d="M28 148 q25 20 50 0 q25 20 50 0 q25 20 50 0 q25 20 50 0" fill="none" />
      <circle cx="76" cy="118" r="17" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="132" cy="90" r="14" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="182" cy="122" r="12" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M52 232 Q42 208 30 202 M64 232 Q60 214 68 202" fill="none" stroke={PALETA.verde} />
      <path d="M198 232 Q210 210 224 204" fill="none" stroke={PALETA.verde} />
    </>
  )
}
