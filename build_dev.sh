#!/usr/bin/env bash

#--------------------------------------------------------------------
# This script will create the BASE container for cypress corrections
# For creating a child container, use the build.sh script
#--------------------------------------------------------------------


function handle_error() {
    restore_dockerignore
    exit 1
}

function restore_dockerignore {
    mv .dockerignore .dockerignore.dev
    mv .dockerignore.disabled .dockerignore
}

CONTAINER_NAME="correctomatic/jest-correction"
TAG=${1:-latest}
DOCKER_OPTIONS=${2:-""}

# We will use the .dockerignore.dev file to build the image
# The .dockerignore file will be disabled, it's meant for creating the child containers
mv .dockerignore .dockerignore.disabled
cp .dockerignore.dev .dockerignore

# Restore the .dockerignore files in case of error
trap handle_error ERR

# Build the image
docker build $DOCKER_OPTIONS -f ./Dockerfile.dev -t $CONTAINER_NAME:$TAG .

restore_dockerignore
