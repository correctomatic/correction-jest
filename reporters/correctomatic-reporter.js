import { state } from 'jest-metadata';
import { JestMetadataReporter } from 'jest-metadata/reporter';

function convertResults(results) {
  const converted = {
    failed: {
      total: results.numFailedTests,
      tests: []
    },
    passed: {
      total: results.numPassedTests,
      tests: []
    }
  }

  for (const suite of results.testResults) {
    for (const test of suite.testResults) {
      const testInfo = {
        title: test.title,
        ancestors: test.ancestorTitles,
      };

      if (test.status === 'passed') {
        converted.passed.tests.push(testInfo);
      } else {
        converted.failed.tests.push(testInfo);
      }
    }
  }

  return converted
}

function getRuntimeError(results) {
  for (const testResult of results.testResults)
    if (testResult.testExecError) return testResult.testExecError.message;
}


function isFailFastTest(metadata) {
  const chain = [metadata, ...metadata.ancestors()]
  return chain.some((m) => m.get('failFast'))
}


function foo() {
  return {
    "failed": {
      "total": 1,
      "tests": [
        {
          "title": "Fail fast test",
          "ancestors": [
            "Puntuación de tenis"
          ]
        }
      ]
    }
  }
}

class CustomReporter extends JestMetadataReporter {

  async onTestCaseResult(test, testCaseResult) {
    await super.onTestCaseResult(test, testCaseResult);

    const metadata = state.getTestFileMetadata(test.path).lastTestEntry;
    const failFast = isFailFastTest(metadata)

    if(failFast && testCaseResult.status === 'failed') {
      console.log("Fail fast test failed")
      foo()
      process.exit(1)
    }
  }

  onRunComplete(_contexts, results) {

    if(results.numRuntimeErrorTestSuites) {
      // Find first runtime error
      const runtimeError = getRuntimeError(results)
      if(!runtimeError) {
        console.log("Could not complete the tests")
        process.exit(1)
      }

      console.log(runtimeError)
      process.exit(100)
    }

    const convertedResults = convertResults(results)
    console.log(JSON.stringify(convertedResults, null, 2))
    process.exit(0)
  }
}

export default CustomReporter
