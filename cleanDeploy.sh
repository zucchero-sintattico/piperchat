#!/bin/bash

rm -rf ./.docker
./composeAll.sh down --rmi all --volumes --remove-orphans
docker build . --tag piperchat
./composeAll.sh up --build --force-recreate
