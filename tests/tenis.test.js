import { iniciarJuego, puntoJugador, resultado } from '../src/tenis.js'
import './matchers.js'

describe('Puntuación de tenis', () => {

  beforeEach(() => {
    iniciarJuego()
  })

  test('Debe inicializar el juego correctamente', () => {
    const expected = 'Jugador 1: 0 Jugador 2: 0'
    expect(resultado()).toMatchNormalized(expected)
  })

  test('Debe incrementar la puntuación de Jugador 1 a 15', () => {
    puntoJugador(1)

    const expected = 'Jugador 1: 15 Jugador 2: 0'
    expect(resultado()).toMatchNormalized(expected)
  })

  test('Debe incrementar la puntuación de Jugador 2 a 30', () => {
    puntoJugador(2)
    puntoJugador(2)
    const expected = 'Jugador 1: 0 Jugador 2: 30'
    expect(resultado()).toMatchNormalized(expected)
  })

  describe('Deuce', () => {
    beforeEach(() => {
      puntoJugador(1)
      puntoJugador(2)
      puntoJugador(1)
       puntoJugador(2)
      puntoJugador(1)
      puntoJugador(2)
    })

    test('Debe devolver "Deuce" si hay un deuce', () => {
      expect(resultado()).toMatchNormalized('Deuce')
    });

    [1,2].forEach(jugador => {
      test('Debe devolver "Ventaja jugador <número>" si un jugador gana después de deuce', () => {
        puntoJugador(jugador)
        expect(resultado()).toMatchNormalized(`Ventaja jugador ${jugador}`)
      })

      test('Debe regresar a deuce si puntua el otro jugador', () => {
        puntoJugador(jugador) // Ventaja Jugador 1
        puntoJugador(jugador === 1 ? 2: 1) // De vuelta a Deuce
        expect(resultado()).toMatchNormalized('Deuce')
      })
    })
  });

  [1,2].forEach(jugador => {
    test('Debe devolver "Juego terminado" cuando un jugador gana después de la ventaja', () => {
      puntoJugador(1)
      puntoJugador(2)
      puntoJugador(1)
      puntoJugador(2)
      puntoJugador(1)
      puntoJugador(2) // Deuce
      puntoJugador(jugador) // Ventaja Jugador
      puntoJugador(jugador) // Gana Jugador
      expect(resultado()).toMatchNormalized('Juego terminado')
    })
  })

  test('Debe lanzar la excepción "Jugador inválido" si se pasa un número de jugador inválido', () => {
    expect(() => puntoJugador(3)).toThrowMessage('Jugador inválido')
  })

  test('Debe lanzar excepción "El juego ya ha finalizado" si se intenta jugar después de que el juego haya finalizado', () => {
    puntoJugador(1)
    puntoJugador(1)
    puntoJugador(1)
    puntoJugador(1) // Jugador 1 gana
    expect(() => puntoJugador(2)).toThrowMessage('El juego ya ha finalizado.')
  })
})
