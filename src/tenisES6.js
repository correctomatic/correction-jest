let puntos = { jugador1: 0, jugador2: 0 };
const secuenciaPuntuacion = [0, 15, 30, 40];
let ventaja = null;
let finalizado = false;

export const iniciarJuego = () => {
  puntos.jugador1 = 0;
  puntos.jugador2 = 0;
  ventaja = null;
  finalizado = false;
};

const incrementarPuntuacion = (jugador) => {
  puntos[jugador] = secuenciaPuntuacion[secuenciaPuntuacion.indexOf(puntos[jugador]) + 1];
};

const esDeuce = () => puntos.jugador1 === 40 && puntos.jugador2 === 40;

const validarJugador = (jugador) => {
  if (![1, 2].includes(jugador)) throw new Error('Jugador inválido.');
};

const manejarFinalizacion = () => {
  if (finalizado) throw new Error('El juego ya ha finalizado.');
};

const obtenerClavesJugadores = (jugador) => ({
  jugadorKey: jugador === 1 ? 'jugador1' : 'jugador2',
  oponenteKey: jugador === 1 ? 'jugador2' : 'jugador1'
});

const manejarPuntoEnDeuce = (jugadorKey, oponenteKey) => {
  if (ventaja === jugadorKey) {
    finalizado = true;
  } else if (ventaja === oponenteKey) {
    ventaja = null;
  } else {
    ventaja = jugadorKey;
  }
};

export const puntoJugador = (jugador) => {
  manejarFinalizacion();
  validarJugador(jugador);

  const { jugadorKey, oponenteKey } = obtenerClavesJugadores(jugador);

  if (esDeuce()) {
    manejarPuntoEnDeuce(jugadorKey, oponenteKey);
  } else if (puntos[jugadorKey] === 40) {
    finalizado = true;
  } else {
    incrementarPuntuacion(jugadorKey);
  }
};

export const resultado = () => {
  if (finalizado) return 'Juego terminado';

  if (ventaja) return `Ventaja ${ventaja === 'jugador1' ? 'jugador 1' : 'jugador 2'}`;

  if (esDeuce()) return 'Deuce';

  return `Jugador 1: ${puntos.jugador1} Jugador 2: ${puntos.jugador2}`;
};
