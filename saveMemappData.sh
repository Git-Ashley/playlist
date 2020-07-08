#!/usr/bin/env bash

MONGO_DB_NAME="memapp-test-1"
DATA_NAME="memapp-data-2020-07-08"

docker exec ${MONGO_DB_NAME} mongodump --quiet --out /tmp/${DATA_NAME}
mkdir -p ./backup
docker cp ${MONGO_DB_NAME}:/tmp/${DATA_NAME} ./backup/${DATA_NAME}
docker exec ${MONGO_DB_NAME} rm -rf /tmp/${DATA_NAME}
