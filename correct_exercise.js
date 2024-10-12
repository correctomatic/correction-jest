import { exec } from 'child_process'
import { promisify } from 'util'
import { stdout } from 'process'

const execAsync = promisify(exec)

function failedComments(testResults) {
  const result = []

  result.push(`Se han encontrado ${testResults.failed.total} error(es) en la aplicación:`)
  for(const test of testResults.failed.tests) {
    result.push(`- ${test.title}`)
  }

  return [ result.join('\n') ]
}

function syntaxErrorResult(output) {
  const result = {
    success: true,
    grade: 0,
    comments: [ output ]
  }
  return JSON.stringify(result)
}

async function runTests() {
  try {
    const command = 'npx jest --json --outputFile=test-results.json --silent --reporters ./reporters/correctomatic-reporter.js'
    // const command = 'yarn test'
    // If we want to get the output of the command, we can use this
    const { stdout: output, code } = await execAsync(command)
    const testResults = JSON.parse(output)


    // We don't need the output, it outputs the results to a file
    // await execAsync('yarn test')
    // const testResults = getResults(RESULTS_FILE)

    let comments = [ 'Buen trabajo']
    let grade = 10
    if (testResults.failed.total > 0) {
      comments = failedComments(testResults)
      grade = 0
    }

    const result = {
      success: true,
      grade: grade,
      comments: comments
    }

    stdout.write(JSON.stringify(result))

  } catch (error) {
    // 100 is the error code for a syntax error
    if(error.code === 100) {
      stdout.write(syntaxErrorResult(error.stdout))
      return
    }

    // If we get here, we couldn't run the tests
    const result = {
      success: false,
      error: "Could not run the tests"
    }
    stdout.write(JSON.stringify(result))
  }
}

runTests()
