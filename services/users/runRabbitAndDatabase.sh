#!/bin/bash
# This script will run the rabbitmq and database containers

docker compose build
docker compose up rabbitmq db-users-service
