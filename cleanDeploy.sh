#!/bin/bash

rm -rf ./.docker
docker image rm piperchat
./deploy.sh
