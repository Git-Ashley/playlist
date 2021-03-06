#!/usr/bin/env bash

MONGO_DB_NAME="memapp-test-1"
DATA_NAME="memapp-data-2021-03-06"

docker exec ${MONGO_DB_NAME} mongodump --quiet --out /tmp/${DATA_NAME}
docker cp ${MONGO_DB_NAME}:/tmp/${DATA_NAME} ./${DATA_NAME}
docker exec ${MONGO_DB_NAME} rm -rf /tmp/${DATA_NAME}
