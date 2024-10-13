import TestSequencer from '@jest/test-sequencer';

console.log(TestSequencer.default)

export default class AlphabeticalSequencer extends TestSequencer.default {
  sort(tests) {
    return tests.sort((a, b) => a.path.localeCompare(b.path));
  }
}
