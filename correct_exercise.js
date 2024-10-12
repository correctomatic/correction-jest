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

    let grade
    let comments

    if (testResults.failed.total == 0) {
      grade = 10
      comments = [ 'Buen trabajo']
    } else {
      grade = 0
      comments = failedComments(testResults)
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

function getFileNameFromSrcPath(path) {
  const match = path.match(/\/src\/(.*)/);
  return match ? match[1] : null; // Retorna solo la parte después de "/src/"
}

function eslintErrorResult(file) {

  const result = [ `File: ${getFileNameFromSrcPath(file.filePath)}` ]

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

  return JSON.stringify(result)
}

async function runLinter() {
  try {
    const eslintCommand = 'npx eslint ./src --format json'
    await execAsync(eslintCommand)
    // If we get here, the linter has passed
  } catch (error) {
    // If we get here, the linter has failed
    const { stdout: output } = error
    const lintResult = JSON.parse(output)

    const result = {
      success: false,
      error: eslintErrorsResult(lintResult)
    }
    stdout.write(JSON.stringify(result))
  }

}

async function main() {
  await runTests()
  runLinter()
}

main()
