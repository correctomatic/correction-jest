# Correctomatic Jest corrections

This container serves as base for launching Correctomatic corrections with Jest. The container will run the tests and
then pass the linter. If any test fails, the grade will be 0, and the comments will be the failed tests descriptions.
If the linter fails, the grade will be 0, and the comments will be the linter output. If the tests pass and the linter
pass, the grade will be 10, and the comments will be "Good work!" (you can configure that)

The linter can be disabled and/or configured for the specific needs of the exercise.

## How to use

The recommended way to use this container is to develop the tests in your local machine and then create the derived
container overriding the necessary files, usually only the tests files in the `tests` folder, the configuration file
`.env` in the root folder and the `eslint.config.js` file in the root folder.

You can use this project for developing the tests, and then create a derived container with the tests and the configuration.

### Prepare the git repository

If you want to save the tests in a git repository you will need to set the remote to your repository. You can do that
with `git remote` command:

```bash
git remote rename origin correctomatic # Rename the original remote to correctomatic, in case you need to push something
git remote set-url origin <your repo url>
```

### 0. Configure the project

**TO-DO**: How to install new dependencies. Maybe we need a copy package.json and yarn install again?

If you need to install new dependencies, you can do that with the `yarn add` command. Do not delete the already installed
dependencies, as they are needed for the container to work. If you modify the `package.json` file, you will need to run
`yarn install` in the `Dockerfile.correction` file.

In the project there is a `jest.config.js` file that you can modify to configure Jest. It's prepared for fail fast tests
(you can see an example in tests.example folder) If you want to use the fail fast feature, you will need to keep the corresponding
line in the file.

### 1. Create the tests

Install the dependencies with `yarn install` and then create a set of tests in the tests folder.

### 2. Configure the linter

Prepare the linter configuration modifying the `eslint.config.js` file. You can use the `eslint --init` command to create a new configuration file and start from there.

You can disable the linter with the `.env` file. **TO-DO**

### 2. Create the derived container

Once you have the tests working, you can create a derived container with the tests and the configuration.
There is an script, `build.sh`, prepared for building the new container:

```bash
./build.sh <container-name:with-tag> <docker-options>
```

This will use the `correctomatic/jest-correction` container as base, saving lots of time and space when creating the
derived correction.

Once the container is created you can test it with:
```bash
docker run --rm -v `pwd`/path/to/the/exercise/to/test:/tmp/exercise <container-name>
```

It should return a valid correctomatic response, with the failed tests descriptions as comments.

### Update the base container

If the base container is updated, you can fetch the changes and merge them with the derived container:
```bash
git fetch origin
git fetch correctomatic
git checkout origin/master
git merge correctomatic/master
```
If there are any conflicts, it's because you've modified files belonging to the base container. You  should discard the
changes in the derived container, and made them again in the base container.

You can also rebase the derived container with the base container, this can be useful in the early stages of development, when the derived container is not yet published:
```bash
git fetch origin
git fetch correctomatic
git checkout origin/master
git rebase correctomatic/master
```

## Development

If you want to modify the base container, you can use the build_dev.sh script. This will build the container with the
Dockerfile.dev file, which will ignore the cypress folder and create a container with the infraestructure needed to
run the cypress tests in the child containers. It will use `latest` as tag if not specified. The docker options must be
quoted and will be passed to the `docker build` command, so you can use them to use `--no-cache`, for example.

```bash
./build_dev.sh <tag> <docker-options>
```

You can have a cypress folder with some tests to check that the base container is working correctly: the folder won't be
copyied to the base container, it's in the `.dockerignore` file. The files under the site folder won't be copied either, so
some example projects can reside there.

You can run the tests with the `run_correction.sh` script, that is the one that will be used as entrypoint. It will take the
exercise from the `/tmp/exercise` file, so put there the exercise you want to test.
