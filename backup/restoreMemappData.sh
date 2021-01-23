#!/usr/bin/env bash

MONGO_DB_NAME="memapp-test-1"
DB_NAME="docker-node-mongo"
DATA_NAME="memapp-data-n2"

docker exec -it $(docker ps -aqf "name=${MONGO_DB_NAME}") mongo ${DB_NAME} --eval "db.dropDatabase();"
docker cp ./$DATA_NAME $(docker ps -aqf "name=${MONGO_DB_NAME}"):/tmp
docker exec -it $(docker ps -aqf "name=${MONGO_DB_NAME}") mongorestore --drop /tmp/${DATA_NAME}
