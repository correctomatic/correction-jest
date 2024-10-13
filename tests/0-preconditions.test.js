import { $Set } from 'jest-metadata'

$Set('failFast', true)
describe('Preconditions', () => {

  let logSpy
  let iniciarJuego, puntoJugador, resultado

  beforeAll(async () => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    ({ iniciarJuego, puntoJugador, resultado } = await import('../src/tenis.js'))
  })

  test('Debe exportar la función "iniciarJuego"', () => {
    expect(iniciarJuego).not.toBeUndefined()
  })

  test('Debe exportar la función "puntoJugador"', () => {
    expect(puntoJugador).not.toBeUndefined()
  })

  test('Debe exportar la función "resultado"', () => {
    expect(resultado).not.toBeUndefined()
  })

  test('El formato de salida debe ser "Jugador 1:<puntuacion> Jugador 2:<puntuacion>', () => {
    iniciarJuego()
    expect(resultado()).toMatch(/Jugador 1:\s*\d+\s*Jugador 2:\s*\d+/)
  })

  test('No debe imprimir nada en la consola', () => {
    iniciarJuego()
    puntoJugador(1)
    puntoJugador(2)
    resultado()
    expect(logSpy).not.toHaveBeenCalled()
  })
})
