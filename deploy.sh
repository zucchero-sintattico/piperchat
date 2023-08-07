docker compose \
    --project-name piperchat \
    --env-file ./.env \
    -f ./services/broker/docker-compose.yaml \
    -f ./services/gateway/docker-compose.yaml \
    -f ./services/messages/docker-compose.yaml \
    -f ./services/users/docker-compose.yaml \
    up
