import { $Set } from 'jest-metadata'

// You can use $Set('failFast', true) in describe, nested describe, or test
$Set('failFast', true)
describe('Preconditions', () => {
  test('Suite will not continue if this test fails', () => {
    expect(1).toBe(1)
  })

  test('Or if this fails', () => {
    expect(2).toBe(2)
  })
})
