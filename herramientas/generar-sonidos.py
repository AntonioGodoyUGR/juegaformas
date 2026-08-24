# -*- coding: utf-8 -*-
"""
De donde salen los sonidos de `public/sonidos/`.

Estan sintetizados aqui, con senos y envolventes, en vez de descargados de un
banco de sonidos. El motivo no es el sonido sino la procedencia: un fichero de
audio bajado de internet llega sin licencia pegada, y comprobar la de cada uno
—y volver a comprobarla el dia que haya que cambiarlo— cuesta mas que estas
cien lineas. Lo que hay en el repositorio se ha escrito en el repositorio.

Se ejecuta a mano, no en la build: los sonidos cambian una vez al ano y la
build no deberia necesitar ni Python ni ffmpeg.

    python herramientas/generar-sonidos.py

Hace falta ffmpeg en el PATH (libvorbis y libmp3lame) para comprimir los WAV.
"""

import math
import os
import shutil
import struct
import subprocess
import sys
import tempfile
import wave

MUESTREO = 44100

SALIDA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'sonidos')


def hz(midi):
    """La frecuencia de una nota MIDI. 69 es el la de 440 Hz."""
    return 440.0 * 2 ** ((midi - 69) / 12.0)


class Pista(object):
    """Un lienzo de audio al que se le van sumando notas."""

    def __init__(self, segundos):
        self.muestras = [0.0] * int(segundos * MUESTREO)

    def nota(self, comienzo, midi, duracion, volumen, armonicos, ataque=0.006):
        """
        Una nota de campana: unos cuantos armonicos que se apagan solos.

        La envolvente es un ataque muy corto y una caida exponencial. El ataque
        no es cero porque una onda que empieza de golpe suena a chasquido, y un
        chasquido en un juego para ninos es exactamente lo que no se quiere.
        """
        base = hz(midi)
        desde = int(comienzo * MUESTREO)
        total = int(duracion * MUESTREO)
        muestras_ataque = max(1, int(ataque * MUESTREO))

        for i in range(total):
            if desde + i >= len(self.muestras):
                break
            t = i / float(MUESTREO)
            caida = math.exp(-3.2 * t / duracion)
            subida = min(1.0, i / float(muestras_ataque))
            valor = 0.0
            for numero, peso in armonicos:
                valor += peso * math.sin(2 * math.pi * base * numero * t)
            self.muestras[desde + i] += valor * caida * subida * volumen

    def enrollar(self, bucle):
        """
        Dobla la cola sobre el principio para que el bucle no tenga costura.

        Sin esto, la ultima nota se corta en seco al volver al segundo cero y se
        oye un salto cada vuelta. Con la cola sumada al principio, lo que se oye
        al empezar es el final de la vuelta anterior, que es lo que pasaria si
        la musica no se hubiera acabado nunca.
        """
        largo = int(bucle * MUESTREO)
        for i in range(largo, len(self.muestras)):
            self.muestras[i - largo] += self.muestras[i]
        self.muestras = self.muestras[:largo]

    def guardar(self, ruta, pico=0.7):
        maximo = max(0.0001, max(abs(m) for m in self.muestras))
        escala = pico / maximo
        with wave.open(ruta, 'wb') as f:
            f.setnchannels(1)
            f.setsampwidth(2)
            f.setframerate(MUESTREO)
            f.writeframes(b''.join(struct.pack('<h', int(max(-1.0, min(1.0, m * escala)) * 32767)) for m in self.muestras))


# Timbres. Cuantos mas armonicos y mas agudos, mas brillante suena la nota.
CAMPANA = [(1, 1.0), (2, 0.35), (3, 0.12), (5, 0.04)]
CAJA_DE_MUSICA = [(1, 1.0), (2, 0.25), (4, 0.08)]
CUERDA = [(1, 1.0), (2, 0.5), (3, 0.25), (4, 0.12)]
BAJO = [(1, 1.0), (2, 0.18)]


def acierto():
    """Dos notas que suben, muy cortas. Es lo que mas veces se oye en el juego."""
    pista = Pista(0.5)
    pista.nota(0.00, 76, 0.22, 0.5, CAMPANA)
    pista.nota(0.07, 83, 0.35, 0.5, CAMPANA)
    return pista


def partida():
    """El arpegio de la celebracion breve: cuatro notas subiendo y ya."""
    pista = Pista(1.2)
    for i, midi in enumerate([72, 76, 79, 84]):
        pista.nota(i * 0.09, midi, 0.55 + i * 0.15, 0.45, CAMPANA)
    return pista


def nivel():
    """
    La celebracion grande. Cuatro notas de llamada y un acorde que se queda.

    Dura mas que las otras dos juntas a proposito: es la unica vez que el juego
    se para a decir algo, y tiene que sonar a algo que no pasa todos los dias.
    """
    pista = Pista(2.6)
    for i, midi in enumerate([67, 72, 76, 79]):
        pista.nota(i * 0.13, midi, 0.5, 0.4, CUERDA)
    for midi in [72, 76, 79, 84]:
        pista.nota(0.52, midi, 1.8, 0.3, CAMPANA)
    pista.nota(0.52, 48, 1.8, 0.35, BAJO)
    return pista


# La musica: ocho compases de 4/4 a 100 pulsos por minuto, en do mayor. Cada
# compas es un acorde, y la vuelta acaba en sol para que el oido pida volver al
# do del principio: un bucle que termina resuelto se nota que es un bucle.
PULSO = 60.0 / 100
COMPAS = PULSO * 4

ACORDES = [
    ('C', [60, 64, 67], [72, 76, 79, 76]),
    ('Am', [57, 60, 64], [76, 74, 72, 69]),
    ('F', [53, 57, 60], [72, 74, 77, 74]),
    ('G', [55, 59, 62], [71, 74, 79, 74]),
    ('C', [60, 64, 67], [79, 76, 72, 76]),
    ('Am', [57, 60, 64], [76, 72, 69, 72]),
    ('F', [53, 57, 60], [77, 74, 72, 74]),
    ('G', [55, 59, 62], [74, 71, 67, 71]),
]


def musica():
    bucle = len(ACORDES) * COMPAS
    # Metro y medio de cola, que es lo que tarda en apagarse la ultima nota.
    pista = Pista(bucle + 2.0)

    for compas, (_nombre, acorde, melodia) in enumerate(ACORDES):
        inicio = compas * COMPAS

        # El bajo marca el uno y el tres. Solo eso: mas bajo en una musica de
        # fondo se convierte en algo a lo que hacer caso.
        pista.nota(inicio, acorde[0] - 12, PULSO * 1.6, 0.3, BAJO)
        pista.nota(inicio + PULSO * 2, acorde[0] - 12, PULSO * 1.6, 0.24, BAJO)

        # El arpegio en corcheas, subiendo y bajando por las notas del acorde.
        vuelta = acorde + [acorde[1]]
        for i in range(8):
            pista.nota(inicio + i * PULSO / 2, vuelta[i % len(vuelta)], PULSO * 0.9, 0.11, CAJA_DE_MUSICA)

        # La melodia en negras, encima de todo.
        for i, midi in enumerate(melodia):
            pista.nota(inicio + i * PULSO, midi, PULSO * 1.3, 0.22, CAJA_DE_MUSICA)

    pista.enrollar(bucle)
    return pista


def comprimir(wav, destino, argumentos):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1'] + argumentos + [destino], check=True)
    print('%s  %d KB' % (os.path.basename(destino), os.path.getsize(destino) // 1024))


# La musica va en los dos formatos y los efectos solo en MP3. El motivo es el
# bucle: un MP3 lleva silencio de relleno al principio y al final que el
# codificador no puede quitar, y ese silencio se oye como un tropiezo cada
# vuelta. Vorbis no lo tiene. Como Vorbis no lo reproduce todo el mundo, el MP3
# se queda de reserva: con musica de fondo, un tropiezo cada veinte segundos se
# aguanta; no tenerla no.
PIEZAS = [
    ('acierto', acierto, ['mp3']),
    ('partida', partida, ['mp3']),
    ('nivel', nivel, ['mp3']),
    ('musica', musica, ['ogg', 'mp3']),
]


def main():
    if not shutil.which('ffmpeg'):
        sys.exit('Hace falta ffmpeg en el PATH')

    os.makedirs(SALIDA, exist_ok=True)
    temporal = tempfile.mkdtemp()

    for nombre, hacer, formatos in PIEZAS:
        wav = os.path.join(temporal, nombre + '.wav')
        hacer().guardar(wav)
        for formato in formatos:
            destino = os.path.join(SALIDA, nombre + '.' + formato)
            if formato == 'ogg':
                comprimir(wav, destino, ['-c:a', 'libvorbis', '-q:a', '2'])
            else:
                comprimir(wav, destino, ['-c:a', 'libmp3lame', '-b:a', '64k'])

    shutil.rmtree(temporal, ignore_errors=True)


if __name__ == '__main__':
    main()
