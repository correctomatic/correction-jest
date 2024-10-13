import { exec } from 'child_process'
import { promisify } from 'util'
import { stdout } from 'process'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const getCurrentFileDir = () => {
  const __filename = fileURLToPath(import.meta.url);
  return dirname(__filename);
};
const SOURCES_PATH = `${getCurrentFileDir()}/src/`

const execAsync = promisify(exec)

function failedComments(testResults) {
  const result = []

  result.push(`Se han encontrado ${testResults.failed.total} error(es) en la aplicación:`)
  for(const test of testResults.failed.tests) {
    result.push(`- ${test.title}`)
  }

  return [ result.join('\n') ]
}

function getBasePaths(path) {
  return path.replaceAll(SOURCES_PATH, '')
}

function syntaxErrorResult(output) {
  // Must remove the path to the file until the first src
  output = getBasePaths(output)
  return {
    success: true,
    grade: 0,
    comments: [ output ]
  }
}

async function runTests() {
  try {
    const command = 'npx jest --silent --reporters ./reporters/correctomatic-reporter.js'

    // If we want to get the output of the command, we can use this
    const { stdout: output } = await execAsync(command)
    const testResults = JSON.parse(output)


    // We don't need the output, it outputs the results to a file
    // await execAsync('yarn test')
    // const testResults = getResults(RESULTS_FILE)

    let result = {}
    let testPassed = true

    if (testResults.failed.total !== 0) {
      testPassed = false
      result = {
        success: true,
        grade: 0,
        comments: failedComments(testResults)
      }
    }

    return { passed: testPassed, response: result }

  } catch (error) {
    // 100 is the error code for a syntax error
    if(error.code === 100) {
      return { passed: false, response: syntaxErrorResult(error.stdout) }
    }

    // If we get here, we couldn't run the tests
    const result = {
      success: false,
      error: "Could not run the tests"
    }
    return { passed: false, response: result }
  }
}

function eslintErrorResult(file) {

  const result = [ `File: ${getBasePaths(file.filePath)}` ]

  for(const msg of file.messages) {
    result.push(`  Line ${msg.line}: ${msg.message} (${msg.ruleId})`)
  }

  return result.join('\n')
}

function eslintErrorsResult(lintResults) {
  const result = {
    success: false,
    grade: 0,
    comments: []
  }

  for(const file of lintResults) {
    if (file.errorCount !== 0) result.comments.push(eslintErrorResult(file))
  }

  return result
}

async function runLinter() {
  try {
    const eslintCommand = 'npx eslint ./src --format json'
    await execAsync(eslintCommand)
    // If we get here, the linter has passed
    return { passed: true }

  } catch (error) {

    const { stdout: output } = error
    const lintResult = JSON.parse(output)

    const result = eslintErrorsResult(lintResult)
    return { passed: false, response: result }
  }

}

async function main() {

  const successResponse = {
    success: true,
    grade: 10,
    comments: [ "Buen trabajo" ]
  }

  const { passed: testPassed, response: testResponse } = await runTests()
  if(!testPassed) {
    stdout.write(JSON.stringify(testResponse))
    return
  }

  const { passed: linterPassed, response: linterResponse } = await runLinter()
  if(!linterPassed) {
    stdout.write(JSON.stringify(linterResponse))
    return
  }

  // Everything passed
  stdout.write(JSON.stringify(successResponse))
}

main()
