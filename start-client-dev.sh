sudo docker-compose -f ./docker-compose-dev.yml stop client

sudo docker-compose -f ./docker-compose-dev.yml up --build --force-recreate client
