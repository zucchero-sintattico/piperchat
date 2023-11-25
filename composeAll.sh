#!/bin/bash

docker compose \
    --project-name piperchat \
    --project-directory . \
    --env-file ./.env \
    -f ./services/broker/docker-compose.yaml \
    -f ./services/frontend/docker-compose.yaml \
    -f ./services/gateway/docker-compose.yaml \
    -f ./services/messages/docker-compose.yaml \
    -f ./services/monitoring/docker-compose.yaml \
    -f ./services/notifications/docker-compose.yaml \
    -f ./services/piperchat/docker-compose.yaml \
    -f ./services/users/docker-compose.yaml \
    -f ./services/multimedia/docker-compose.yaml \
    -f ./dev/inspector.docker-compose.yaml \
    $@