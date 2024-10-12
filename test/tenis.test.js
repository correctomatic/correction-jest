import { iniciarJuego, puntoJugador, resultado } from '../src/tenisES6.js';

const normalizarCadena = (cadena) => cadena.replace(/\s+/g, '').toLowerCase();

describe('Puntuación de tenis', () => {
  beforeEach(() => {
    iniciarJuego();
  });

  const expectResultado = (expected) => {
    expect(normalizarCadena(resultado())).toBe(normalizarCadena(expected));
  };

  const expectError = (fn, expectedMessage) => {
    try {
      fn();
    } catch (error) {
      expect(normalizarCadena(error.message)).toBe(normalizarCadena(expectedMessage));
    }
  };

  test('Debe inicializar el juego correctamente', () => {
    expectResultado('Jugador 1: 0 Jugador 2: 0');
  });

  test('Debe incrementar la puntuación de Jugador 1 a 15', () => {
    puntoJugador(1);
    expectResultado('Jugador 1: 15 Jugador 2: 0');
  });

  test('Debe incrementar la puntuación de Jugador 2 a 30', () => {
    puntoJugador(2);
    puntoJugador(2);
    expectResultado('Jugador 1: 0 Jugador 2: 30');
  });

  test('Debe manejar la situación de deuce', () => {
    puntoJugador(1);
    puntoJugador(2);
    puntoJugador(1);
    puntoJugador(2);
    puntoJugador(1);
    puntoJugador(2);
    expectResultado('Deuce');
  });

  test('Debe dar ventaja a Jugador 1 después de deuce', () => {
    puntoJugador(1);
    puntoJugador(2);
    puntoJugador(1);
    puntoJugador(2);
    puntoJugador(1);
    puntoJugador(2); // Deuce
    puntoJugador(1); // Ventaja Jugador 1
    expectResultado('Ventaja jugador 1');
  });

  test('Debe regresar a deuce si Jugador 2 gana el punto con ventaja para Jugador 1', () => {
    puntoJugador(1);
    puntoJugador(2);
    puntoJugador(1);
    puntoJugador(2);
    puntoJugador(1);
    puntoJugador(2); // Deuce
    puntoJugador(1); // Ventaja Jugador 1
    puntoJugador(2); // De vuelta a Deuce
    expectResultado('Deuce');
  });

  test('Debe terminar el juego cuando Jugador 1 gana después de la ventaja', () => {
    puntoJugador(1);
    puntoJugador(2);
    puntoJugador(1);
    puntoJugador(2);
    puntoJugador(1);
    puntoJugador(2); // Deuce
    puntoJugador(1); // Ventaja Jugador 1
    puntoJugador(1); // Gana Jugador 1
    expectResultado('Juego terminado');
  });

  test('Debe lanzar excepción si se pasa un número de jugador inválido', () => {
    expectError(() => puntoJugador(3), 'Jugador inválido');
  });

  test('Debe lanzar excepción si se intenta jugar después de que el juego haya finalizado', () => {
    puntoJugador(1);
    puntoJugador(1);
    puntoJugador(1);
    puntoJugador(1); // Jugador 1 gana
    expectError(() => puntoJugador(2), 'El juego ya ha finalizado.');
  });
});
