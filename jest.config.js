export default {
  // Required to use the correctomatic-reporter with fail-fast tests
  testEnvironment: "jest-metadata/environment-node",
  testSequencer: "./jest/correctomatic-sequencer.js",
  maxWorkers: 1,
  forceExit: true,
}
