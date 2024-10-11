#!/usr/bin/env bash

#--------------------------------------------------------------------
# This script will create the child corrections, for correcting a
# specific exercise
#--------------------------------------------------------------------

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <container-name> <docker-options>"
    exit 1
fi
CONTAINER_NAME=$1
DOCKER_OPTIONS=${2:-""}

docker build $DOCKER_OPTIONS -f ./Dockerfile.correction -t "$CONTAINER_NAME" .
