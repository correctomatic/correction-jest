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

  test('Debe manejar la situación de deuce', () => {
    puntoJugador(1)
    puntoJugador(2)
    puntoJugador(1)
    puntoJugador(2)
    puntoJugador(1)
    puntoJugador(2)
    expect(resultado()).toMatchNormalized('Deuce')
  })

  test('Debe dar ventaja a Jugador 1 después de deuce', () => {
    puntoJugador(1)
    puntoJugador(2)
    puntoJugador(1)
    puntoJugador(2)
    puntoJugador(1)
    puntoJugador(2) // Deuce
    puntoJugador(1) // Ventaja Jugador 1
    expect(resultado()).toMatchNormalized('Ventaja jugador 1')
  })

  test('Debe regresar a deuce si Jugador 2 gana el punto con ventaja para Jugador 1', () => {
    puntoJugador(1)
    puntoJugador(2)
    puntoJugador(1)
    puntoJugador(2)
    puntoJugador(1)
    puntoJugador(2) // Deuce
    puntoJugador(1) // Ventaja Jugador 1
    puntoJugador(2) // De vuelta a Deuce
    expect(resultado()).toMatchNormalized('Deuce')
  })

  test('Debe terminar el juego cuando Jugador 1 gana después de la ventaja', () => {
    puntoJugador(1)
    puntoJugador(2)
    puntoJugador(1)
    puntoJugador(2)
    puntoJugador(1)
    puntoJugador(2) // Deuce
    puntoJugador(1) // Ventaja Jugador 1
    puntoJugador(1) // Gana Jugador 1
    expect(resultado()).toMatchNormalized('Juego terminado')
  })

  test('Debe lanzar excepción si se pasa un número de jugador inválido', () => {
    expect(() => puntoJugador(3)).toThrowMessage('Jugador inválido')
  })

  test('Debe lanzar excepción si se intenta jugar después de que el juego haya finalizado', () => {
    puntoJugador(1)
    puntoJugador(1)
    puntoJugador(1)
    puntoJugador(1) // Jugador 1 gana
    expect(() => puntoJugador(2)).toThrowMessage('El juego ya ha finalizado.')
  })
})
