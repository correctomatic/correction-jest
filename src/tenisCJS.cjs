let puntos = { jugador1: 0, jugador2: 0 };
const secuenciaPuntuacion = [0, 15, 30, 40];
let ventaja = null;
let finalizado = false;

function iniciarJuego() {
  puntos.jugador1 = 0;
  puntos.jugador2 = 0;
  ventaja = null;
  finalizado = false;
}

function incrementarPuntuacion(jugador) {
  puntos[jugador] = secuenciaPuntuacion[secuenciaPuntuacion.indexOf(puntos[jugador]) + 1];
}

function esDeuce() {
  return puntos.jugador1 === 40 && puntos.jugador2 === 40;
}

function manejarVentaja(jugador, oponente) {
  if (ventaja === jugador) {
    finalizado = true;
  } else if (ventaja === oponente) {
    ventaja = null;
  } else {
    ventaja = jugador;
  }
}

function puntoJugador(jugador) {
  if (finalizado) throw new Error('El juego ya ha finalizado.');

  const oponente = jugador === 'jugador1' ? 'jugador2' : 'jugador1';

  if (esDeuce()) {
    manejarVentaja(jugador, oponente);
  } else if (puntos[jugador] === 40) {
    finalizado = true;
  } else {
    incrementarPuntuacion(jugador);
  }
}

function resultado() {
  if (finalizado) return 'Juego terminado';

  if (ventaja) return `Ventaja ${ventaja}`;

  if (esDeuce()) return 'Deuce';

  return `Jugador 1: ${puntos.jugador1}, Jugador 2: ${puntos.jugador2}`;
}

module.exports = { iniciarJuego, puntoJugador, resultado };
