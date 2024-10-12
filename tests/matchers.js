// customMatchers.js

const normalizarCadena = (str) => {
  // Your implementation of normalizarCadena
  return str // Replace with actual normalization logic
}

expect.extend({
  toMatchNormalized(received, expected) {
    const normalizedReceived = normalizarCadena(received)
    const normalizedExpected = normalizarCadena(expected)

    const pass = normalizedReceived === normalizedExpected

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(normalizedReceived)} not to match ${this.utils.printExpected(normalizedExpected)}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(normalizedReceived)} to match ${this.utils.printExpected(normalizedExpected)}`,
        pass: false,
      }
    }
  },
})

expect.extend({
  toThrowMessage(received, expectedMessage) {
    let errorMessage
    try {
      received() // Call the function passed to the matcher
    } catch (error) {
      errorMessage = error.message // Capture the error message
    }

    const normalizedErrorMessage = normalizarCadena(errorMessage)
    const normalizedExpectedMessage = normalizarCadena(expectedMessage)

    // const pass = normalizedErrorMessage === normalizedExpectedMessage
    const pass = normalizedErrorMessage.includes(normalizedExpectedMessage) // Check if normalized error contains the expected message


    if (pass) {
      return {
        message: () =>
          `expected function not to throw an error with message ${this.utils.printExpected(normalizedExpectedMessage)}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected function to throw an error with message ${this.utils.printExpected(normalizedExpectedMessage)} but received ${this.utils.printReceived(normalizedErrorMessage)}`,
        pass: false,
      }
    }
  },
})
