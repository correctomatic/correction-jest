const { iniciarJuego, puntoJugador, resultado } = require("./test1.cjs");

console.log(iniciarJuego)

iniciarJuego();
puntoJugador("jugador1");
console.log(resultado()); // Jugador 1: 0, Jugador 2: 0
