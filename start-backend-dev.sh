sudo docker-compose -f ./docker-compose-dev.yml stop api
sudo docker-compose -f ./docker-compose-dev.yml stop db

sudo docker-compose -f ./docker-compose-dev.yml up --build --force-recreate api
sudo docker-compose -f ./docker-compose-dev.yml up db
