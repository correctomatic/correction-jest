const { iniciarJuego, puntoJugador, resultado } = require("./tenisCJS.cjs");

iniciarJuego();
puntoJugador("jugador1");
console.log(resultado()); // Jugador 1: 0, Jugador 2: 0
